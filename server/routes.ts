import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWorkerAuth, workerLogin, workerRegister, workerLogout, getCurrentWorker, isWorkerAuthenticated, isWorkerAdmin } from "./worker-auth";
import { workerStorage } from "./worker-storage";
import { createTaskSchema, createEventSchema, createWorkSubmissionSchema, workerRegisterSchema } from "@shared/worker-schema";
import { ObjectStorageService } from "./objectStorage";
import { wsManager } from "./websocket";
import { db } from "./db";
import { sql, eq, desc } from "drizzle-orm";

import { insertDonationSchema, insertSubscriberSchema, insertUserSchema, insertImpactLabsArticleSchema, insertJobListingSchema, insertJobApplicationSchema, jobListings, jobApplications } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads (memory storage for DB persistence)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for CVs
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (extname && allowedMimes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up worker authentication middleware
  setupWorkerAuth(app);
  
  // Worker authentication routes
  app.post("/worker/api/login", workerLogin);
  app.post("/worker/api/register", workerRegister);
  app.post("/worker/api/logout", workerLogout);
  app.get("/worker/api/user", getCurrentWorker);
  
  // Worker management routes (admin only)
  app.get("/worker/api/workers", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const workers = await workerStorage.getAllWorkers();
      // Remove passwords from response
      const safeWorkers = workers.map(({ password, ...worker }) => worker);
      res.json(safeWorkers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workers" });
    }
  });

  // Get workers login status (admin only)
  app.get("/worker/api/workers/login-status", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const workers = await workerStorage.getAllWorkers();
      const loginStatus = workers.map(worker => ({
        id: worker.id,
        username: worker.username,
        firstName: worker.firstName,
        lastName: worker.lastName,
        department: worker.department,
        role: worker.role,
        lastLogin: worker.lastLogin,
        isActive: worker.isActive,
      }));
      res.json(loginStatus);
    } catch (error) {
      res.status(500).json({ message: "Error fetching login status" });
    }
  });

  // Get workers by department (for department-specific task assignment)
  app.get("/worker/api/workers/department/:department", isWorkerAuthenticated, async (req, res) => {
    try {
      const { department } = req.params;
      const workers = await workerStorage.getWorkersByDepartment(department);
      // Remove passwords from response
      const safeWorkers = workers.map(({ password, ...worker }) => worker);
      res.json(safeWorkers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workers by department" });
    }
  });

  // Get last login information for all workers (admin only)
  app.get("/worker/api/workers/login-status", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const workers = await workerStorage.getAllWorkers();
      const loginStatus = workers.map(worker => ({
        id: worker.id,
        username: worker.username,
        firstName: worker.firstName,
        lastName: worker.lastName,
        department: worker.department,
        role: worker.role,
        lastLogin: worker.lastLogin,
        isActive: worker.isActive
      }));
      
      res.json(loginStatus);
    } catch (error) {
      console.error("Error fetching login status:", error);
      res.status(500).json({ message: "Error fetching login status" });
    }
  });
  
  app.get("/worker/api/activity/:workerId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { workerId } = req.params;
      
      // Workers can only see their own activity unless they're admin
      if (req.worker.id !== workerId && req.worker.role !== "admin" && req.worker.role !== "manager") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const logs = await workerStorage.getWorkerLogs(workerId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activity logs" });
    }
  });

  // Admin: Create new employee account
  app.post("/worker/api/admin/create-employee", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const validatedData = workerRegisterSchema.parse(req.body);
      const { confirmPassword, ...workerData } = validatedData;

      // Check if username or email already exists
      const existingWorkerByUsername = await workerStorage.getWorkerByUsername(workerData.username);
      if (existingWorkerByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingWorkerByEmail = await workerStorage.getWorkerByEmail(workerData.email);
      if (existingWorkerByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const worker = await workerStorage.createWorker(workerData);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "create_employee",
        details: `Created employee account: ${worker.username}`,
        ipAddress: req.ip,
      });

      const { password: _, ...workerInfo } = worker;
      res.status(201).json({ 
        message: "Employee account created successfully", 
        worker: workerInfo 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Create employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Update employee account
  app.put("/worker/api/admin/employees/:employeeId", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const { employeeId } = req.params;
      const updates = req.body;

      const updatedWorker = await workerStorage.updateWorker(employeeId, updates);
      if (!updatedWorker) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "update_employee",
        details: `Updated employee: ${updatedWorker.username}`,
        ipAddress: req.ip,
      });

      const { password: _, ...workerInfo } = updatedWorker;
      res.json({ message: "Employee updated successfully", worker: workerInfo });
    } catch (error) {
      console.error("Update employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Task management routes
  app.get("/worker/api/tasks", isWorkerAuthenticated, async (req, res) => {
    try {
      // Admin can see all tasks, workers see their own
      const workerId = req.worker.role === "admin" || req.worker.role === "manager" ? undefined : req.worker.id;
      const tasks = await workerStorage.getTasks(workerId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  });

  app.post("/worker/api/tasks", isWorkerAuthenticated, async (req, res) => {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      
      // Department restriction check for managers
      if (req.worker.role === "manager" && validatedData.assignedTo) {
        const assigneeWorker = await workerStorage.getWorker(validatedData.assignedTo);
        if (!assigneeWorker) {
          return res.status(400).json({ message: "Assigned worker not found" });
        }
        
        // Managers can only assign tasks to workers in their own department
        if (assigneeWorker.department !== req.worker.department) {
          return res.status(403).json({ 
            message: "Permission denied. You can only assign tasks to workers in your department." 
          });
        }
      }

      const task = await workerStorage.createTask({
        ...validatedData,
        assignedBy: req.worker.id,
      });

      // Create notification for assigned worker if task is assigned to someone
      if (task.assignedTo) {
        await workerStorage.createNotification({
          workerId: task.assignedTo,
          type: "task_assigned",
          title: "New Task Assigned",
          message: `You have been assigned a new task: "${task.title}"`,
          relatedId: task.id,
          relatedType: "task",
        });
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "create_task",
        details: `Created task: ${task.title}`,
        ipAddress: req.ip,
      });

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating task" });
    }
  });

  app.put("/worker/api/tasks/:taskId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { taskId } = req.params;
      const updates = req.body;

      // First get the existing task to check permissions
      const existingTask = await workerStorage.getTask(taskId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Permission check: Only allow admins or the task creator to edit tasks
      // Assigned workers (including managers) cannot edit tasks assigned to them
      const isAdmin = req.worker.role === "admin";
      const isTaskCreator = existingTask.assignedBy === req.worker.id;
      const isAssignedToTask = existingTask.assignedTo === req.worker.id;

      // If the user is assigned to the task (even if they're a manager), they cannot edit it
      if (isAssignedToTask && !isAdmin) {
        return res.status(403).json({ 
          message: "Permission denied. You cannot edit tasks assigned to you." 
        });
      }

      // Only admins and task creators can edit tasks
      if (!isAdmin && !isTaskCreator) {
        return res.status(403).json({ 
          message: "Permission denied. Only task creators and admins can edit tasks." 
        });
      }

      // Department restriction check for managers when reassigning tasks
      if (req.worker.role === "manager" && updates.assignedTo && updates.assignedTo !== existingTask.assignedTo) {
        const assigneeWorker = await workerStorage.getWorker(updates.assignedTo);
        if (!assigneeWorker) {
          return res.status(400).json({ message: "Assigned worker not found" });
        }
        
        // Managers can only assign tasks to workers in their own department
        if (assigneeWorker.department !== req.worker.department) {
          return res.status(403).json({ 
            message: "Permission denied. You can only assign tasks to workers in your department." 
          });
        }
      }

      const task = await workerStorage.updateTask(taskId, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "update_task",
        details: `Updated task: ${task.title}`,
        ipAddress: req.ip,
      });

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  });

  app.delete("/worker/api/tasks/:taskId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { taskId } = req.params;
      
      console.log(`Task deletion attempt - User: ${req.worker.username}, Role: ${req.worker.role}, TaskID: ${taskId}`);
      
      const task = await workerStorage.getTaskById(taskId);
      if (!task) {
        console.log(`Task not found: ${taskId}`);
        return res.status(404).json({ message: "Task not found" });
      }

      console.log(`Task found - Title: ${task.title}, AssignedBy: ${task.assignedBy}, AssignedTo: ${task.assignedTo}`);

      // Permission check for task deletion
      const isAdmin = req.worker.role === "admin";
      const isTaskCreator = task.assignedBy === req.worker.id;
      const isAssignedToTask = task.assignedTo === req.worker.id;

      console.log(`Permission check - IsAdmin: ${isAdmin}, IsTaskCreator: ${isTaskCreator}, IsAssignedToTask: ${isAssignedToTask}`);

      // If the user is assigned to the task (even if they're a manager), they cannot delete it
      if (isAssignedToTask && !isAdmin) {
        console.log("Permission denied: User is assigned to task");
        return res.status(403).json({ 
          message: "Permission denied. You cannot delete tasks assigned to you." 
        });
      }

      // Only admins and task creators can delete tasks
      if (!isAdmin && !isTaskCreator) {
        console.log("Permission denied: Not admin or task creator");
        return res.status(403).json({ 
          message: "Permission denied. Only task creators and admins can delete tasks." 
        });
      }

      console.log("Deleting task and related work submissions...");
      // First delete any work submissions for this task
      await workerStorage.deleteWorkSubmissionsByTaskId(taskId);
      // Then delete the task itself
      await workerStorage.deleteTask(taskId);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "delete_task",
        details: `Deleted task: ${task.title}`,
        ipAddress: req.ip,
      });

      console.log("Task deleted successfully");
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Task deletion error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Error deleting task", error: errorMessage });
    }
  });

  // Event management routes
  app.get("/worker/api/events", isWorkerAuthenticated, async (req, res) => {
    try {
      const events = await workerStorage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  });

  app.post("/worker/api/events", isWorkerAuthenticated, async (req, res) => {
    try {
      const validatedData = createEventSchema.parse(req.body);
      
      // Get workers in selected departments to add as participants
      let participants: string[] = [];
      
      if (validatedData.department && validatedData.department !== 'all') {
        const departmentWorkers = await workerStorage.getWorkersByDepartment(validatedData.department);
        participants = departmentWorkers.map(worker => worker.id);
      } else if (validatedData.department === 'all') {
        const allWorkers = await workerStorage.getAllWorkers();
        participants = allWorkers.map(worker => worker.id);
      }

      const event = await workerStorage.createEvent({
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        participants,
        organizer: req.worker.id,
      });

      // Create notifications for all participants
      if (participants.length > 0) {
        for (const participantId of participants) {
          await workerStorage.createNotification({
            workerId: participantId,
            type: "event_created",
            title: "New Event Created",
            message: `You're invited to "${event.title}" on ${new Date(event.startDate).toLocaleDateString()}`,
            relatedId: event.id,
            relatedType: "event",
          });
        }
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "create_event",
        details: `Created event: ${event.title} for ${validatedData.department} department`,
        ipAddress: req.ip,
      });

      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Create event error:", error);
      res.status(500).json({ message: "Error creating event" });
    }
  });

  app.put("/worker/api/events/:eventId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { eventId } = req.params;
      const updates = req.body;

      const event = await workerStorage.updateEvent(eventId, updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "update_event",
        details: `Updated event: ${event.title}`,
        ipAddress: req.ip,
      });

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error updating event" });
    }
  });

  app.delete("/worker/api/events/:eventId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const event = await workerStorage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Admins can delete any event, managers and organizers can delete their own events
      const isAdmin = req.worker.role === "admin";
      const isEventOrganizer = event.organizer === req.worker.id;
      const isManager = req.worker.role === "manager";
      
      if (!isAdmin && !isEventOrganizer && !isManager) {
        return res.status(403).json({ message: "Access denied. Only administrators, managers, or event organizers can delete events." });
      }

      await workerStorage.deleteEvent(eventId);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "delete_event",
        details: `Deleted event: ${event.title}`,
        ipAddress: req.ip,
      });

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event" });
    }
  });

  // Work submission routes
  app.get("/worker/api/work-submissions", isWorkerAuthenticated, async (req, res) => {
    try {
      const { taskId, department, workerId } = req.query;
      
      if (workerId) {
        // Get submissions for a specific worker (for employee dashboard)
        const submissions = await workerStorage.getWorkSubmissionsByWorker(workerId as string);
        res.json(submissions);
      } else if (department && (req.worker.role === "admin" || req.worker.role === "manager")) {
        // If department is specified, get submissions for that department (managers only)
        const submissions = await workerStorage.getWorkSubmissionsByDepartment(department as string);
        res.json(submissions);
      } else if (taskId) {
        const submissions = await workerStorage.getWorkSubmissions(taskId as string);
        res.json(submissions);
      } else {
        // Get all submissions for admins, or department submissions for managers
        const submissions = req.worker.role === "admin" 
          ? await workerStorage.getAllWorkSubmissions()
          : await workerStorage.getWorkSubmissionsByDepartment(req.worker.department || "");
        res.json(submissions);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching work submissions" });
    }
  });

  app.post("/worker/api/work-submissions", isWorkerAuthenticated, async (req, res) => {
    try {
      const validatedData = createWorkSubmissionSchema.parse(req.body);
      
      // Get the task to verify assignment
      const task = await workerStorage.getTaskById(validatedData.taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Only the worker assigned to the task can submit work for it
      if (task.assignedTo !== req.worker.id) {
        return res.status(403).json({ message: "You can only submit work for tasks assigned to you" });
      }
      
      const submission = await workerStorage.createWorkSubmission({
        ...validatedData,
        workerId: req.worker.id,
      });

      // Update task status to completed
      await workerStorage.updateTask(validatedData.taskId, {
        status: "completed",
        completedAt: new Date(),
      });

      console.log("Task updated to completed:", validatedData.taskId);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "submit_work",
        details: `Submitted work for task: ${validatedData.taskId}`,
        ipAddress: req.ip,
      });

      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating work submission" });
    }
  });

  app.put("/worker/api/work-submissions/:submissionId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const updates = req.body;

      // Only admins and managers can review work submissions
      if (req.worker.role !== "admin" && req.worker.role !== "manager") {
        return res.status(403).json({ message: "Only admins and managers can review work submissions" });
      }

      const submission = await workerStorage.updateWorkSubmission(submissionId, {
        ...updates,
        reviewedBy: req.worker.id,
        reviewedAt: new Date(),
      });

      if (!submission) {
        return res.status(404).json({ message: "Work submission not found" });
      }

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "review_work",
        details: `Reviewed work submission: ${submissionId}`,
        ipAddress: req.ip,
      });

      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Error updating work submission" });
    }
  });

  // Object storage routes for screenshots
  app.post("/worker/api/objects/upload", isWorkerAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  // Notification routes
  app.get("/worker/api/notifications", isWorkerAuthenticated, async (req, res) => {
    try {
      const { unreadOnly } = req.query;
      const notifications = await workerStorage.getNotifications(
        req.worker.id,
        unreadOnly === 'true'
      );
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });

  app.put("/worker/api/notifications/:notificationId/read", isWorkerAuthenticated, async (req, res) => {
    try {
      const { notificationId } = req.params;
      await workerStorage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });

  app.put("/worker/api/notifications/mark-all-read", isWorkerAuthenticated, async (req, res) => {
    try {
      await workerStorage.markAllNotificationsAsRead(req.worker.id);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Error marking all notifications as read" });
    }
  });

  // Performance scoring endpoints
  
  // Create a new performance period (admin only)
  app.post("/worker/api/performance-periods", isWorkerAuthenticated, async (req, res) => {
    try {
      if (req.worker.role !== "admin") {
        return res.status(403).json({ message: "Only administrators can create performance periods" });
      }

      const { month, year } = req.body;
      
      console.log("Creating performance period:", { month, year, createdBy: req.worker.id });
      
      const period = await workerStorage.createPerformancePeriod({
        month,
        year,
        createdBy: req.worker.id
      });

      console.log("Performance period created successfully:", period);
      res.json(period);
    } catch (error) {
      console.error("Error creating performance period:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: `Error creating performance period: ${errorMessage}` });
    }
  });

  // Get all performance periods
  app.get("/worker/api/performance-periods", isWorkerAuthenticated, async (req, res) => {
    try {
      const periods = await workerStorage.getPerformancePeriods();
      res.json(periods);
    } catch (error) {
      res.status(500).json({ message: "Error fetching performance periods" });
    }
  });

  // Get active performance period
  app.get("/worker/api/performance-periods/active", isWorkerAuthenticated, async (req, res) => {
    try {
      const period = await workerStorage.getActivePerformancePeriod();
      res.json(period);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active performance period" });
    }
  });

  // Create or update performance score (admin only)
  app.post("/worker/api/performance-scores", isWorkerAuthenticated, async (req, res) => {
    try {
      if (req.worker.role !== "admin") {
        return res.status(403).json({ message: "Only administrators can create performance scores" });
      }

      console.log("Creating performance score:", req.body);

      const score = await workerStorage.createPerformanceScore({
        ...req.body,
        scoredBy: req.worker.id
      });

      console.log("Performance score created successfully:", score);

      // Create notification for the employee
      await workerStorage.createNotification({
        workerId: req.body.workerId,
        type: "performance_score",
        title: "New Performance Score Available",
        message: "Your monthly performance score has been submitted. Please review your feedback.",
        relatedId: score.id,
        relatedType: "performance_score"
      });

      res.json(score);
    } catch (error) {
      console.error("Error creating performance score:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: `Error creating performance score: ${errorMessage}` });
    }
  });

  // Get performance scores
  app.get("/worker/api/performance-scores", isWorkerAuthenticated, async (req, res) => {
    try {
      const { periodId, workerId } = req.query;
      
      // Non-admin users can only see their own scores
      let targetWorkerId = workerId as string;
      if (req.worker.role !== "admin") {
        targetWorkerId = req.worker.id;
      }

      console.log("Fetching performance scores for:", {
        requestingUser: req.worker.id,
        requestingRole: req.worker.role,
        targetWorkerId: targetWorkerId,
        periodId: periodId
      });

      const scores = await workerStorage.getPerformanceScores(
        periodId as string, 
        targetWorkerId
      );
      
      console.log("Found performance scores:", scores);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching performance scores:", error);
      res.status(500).json({ message: "Error fetching performance scores" });
    }
  });

  // Acknowledge performance score (employee)
  app.patch("/worker/api/performance-scores/:id/acknowledge", isWorkerAuthenticated, async (req, res) => {
    try {
      await workerStorage.acknowledgePerformanceScore(req.params.id);
      res.json({ message: "Performance score acknowledged" });
    } catch (error) {
      res.status(500).json({ message: "Error acknowledging performance score" });
    }
  });
  
  // Public platform routes below
  
  // Get stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  // Get a specific project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });

  // Get impact stories
  app.get("/api/impact-stories", async (req, res) => {
    try {
      const stories = await storage.getImpactStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching impact stories" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Get all donations
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });

  // Create a donation (public endpoint)
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating donation" });
    }
  });





  // Create donation without payment processing (public endpoint)
  app.post("/api/create-donation", async (req, res) => {
    try {
      const { amount, isMonthly, projectId, name, email, message } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create donation record as completed (no payment processing)
      const donationData = {
        name: name || 'Anonymous',
        email: email,
        amount: amount,
        projectId: projectId || null,
        isRecurring: isMonthly || false
      };

      const donation = await storage.createDonation(donationData);
      
      res.json({ 
        success: true,
        donationId: donation.id,
        amount: amount,
        message: "Donation recorded successfully"
      });
    } catch (error: any) {
      console.error("Donation creation error:", error);
      res.status(500).json({ 
        message: "Error creating donation", 
        error: error.message 
      });
    }
  });



  // Get donation session details for success page (public endpoint)
  app.get("/api/donation-session/:donationId", async (req, res) => {
    try {
      const { donationId } = req.params;
      
      if (!donationId) {
        return res.status(400).json({ message: "Donation ID is required" });
      }

      const donation = await storage.getDonation(parseInt(donationId));
      
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Return donation details for success page
      const donationData = {
        amount: donation.amount,
        currency: 'USD',
        isMonthly: donation.isRecurring,
        projectId: donation.projectId?.toString(),
        donorName: donation.name,
        donorEmail: donation.email,
        status: donation.paymentStatus,
        donationId: donation.id
      };

      res.json(donationData);
    } catch (error: any) {
      console.error("Error retrieving donation details:", error);
      res.status(500).json({ message: "Error retrieving donation details" });
    }
  });

  // Manual payment confirmation (for testing without webhook setup)
  app.post("/api/payment-webhook", async (req, res) => {
    try {
      const { donationId, status } = req.body;

      if (!donationId) {
        return res.status(400).json({ message: "Donation ID is required" });
      }

      const donation = await storage.getDonation(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Update donation status
      await storage.updateDonationStatus(donationId, status || "succeeded");

      // If donation is successful, update stats
      if (status === "succeeded") {
        await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0);
        await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
      }

      res.json({ message: "Payment status updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating payment status" });
    }
  });

  // Admin routes removed - public platform only

  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Serve static files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // ============================================
  // IMPACT LABS ROUTES
  // ============================================
  
  const IMPACT_LABS_PASSWORD = process.env.IMPACT_LABS_PASSWORD || "impactlabs76";

  const requireImpactLabsAuth = (req: Request, res: Response, next: Function) => {
    const session = req.session as any;
    if (session?.impactLabsAuth) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  app.post("/api/impact-labs/auth", (req, res) => {
    const { password } = req.body;
    if (password === IMPACT_LABS_PASSWORD) {
      (req.session as any).impactLabsAuth = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  app.get("/api/impact-labs/auth/check", (req, res) => {
    const session = req.session as any;
    res.json({ authenticated: !!session?.impactLabsAuth });
  });

  app.post("/api/impact-labs/auth/logout", (req, res) => {
    (req.session as any).impactLabsAuth = false;
    res.json({ success: true });
  });

  app.get("/api/impact-labs/articles", async (_req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/impact-labs/articles/all", requireImpactLabsAuth, async (_req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/impact-labs/articles/:idOrSlug", async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let article;
      const parsed = parseInt(idOrSlug);
      if (!isNaN(parsed)) {
        article = await storage.getArticleById(parsed);
      } else {
        article = await storage.getArticleBySlug(idOrSlug);
      }
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      if (!article.isPublished) {
        const session = req.session as any;
        if (!session?.impactLabsAuth) {
          return res.status(404).json({ message: "Article not found" });
        }
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post("/api/impact-labs/articles", requireImpactLabsAuth, async (req, res) => {
    try {
      const data = { ...req.body };
      if (data.isPublished && !data.publishedAt) {
        data.publishedAt = new Date();
      }
      if (typeof data.publishedAt === 'string') {
        data.publishedAt = new Date(data.publishedAt);
      }
      const validated = insertImpactLabsArticleSchema.parse(data);
      const article = await storage.createArticle(validated);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Error creating article" });
    }
  });

  app.patch("/api/impact-labs/articles/:id", requireImpactLabsAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = { ...req.body };
      if (updates.isPublished) {
        const existing = await storage.getArticleById(id);
        if (existing && !existing.isPublished) {
          updates.publishedAt = new Date();
        }
      }
      if (typeof updates.publishedAt === 'string') {
        updates.publishedAt = new Date(updates.publishedAt);
      }
      const article = await storage.updateArticle(id, updates);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Error updating article" });
    }
  });

  app.delete("/api/impact-labs/articles/:id", requireImpactLabsAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  app.post("/api/impact-labs/upload", requireImpactLabsAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `impact-${uniqueSuffix}${ext}`;

      await db.execute(
        sql`INSERT INTO uploaded_images (filename, mime_type, data) VALUES (${filename}, ${req.file.mimetype}, ${req.file.buffer})`
      );

      const fileUrl = `/api/images/${filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  app.get("/api/images/:filename", async (req, res) => {
    try {
      const result = await db.execute(
        sql`SELECT mime_type, data FROM uploaded_images WHERE filename = ${req.params.filename}`
      );
      const row = (result as any).rows?.[0];
      if (!row) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.set('Content-Type', row.mime_type);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      const buffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data, 'base64');
      res.send(buffer);
    } catch (error) {
      console.error("Image serve error:", error);
      res.status(500).json({ message: "Error serving image" });
    }
  });

  // ============================================
  // OPPORTUNITIES ADMIN ROUTES
  // ============================================

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ayaanahmed";

  const requireAdminAuth = (req: Request, res: Response, next: Function) => {
    const session = req.session as any;
    if (session?.adminAuth) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      (req.session as any).adminAuth = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  app.get("/api/admin/auth/check", (req, res) => {
    const session = req.session as any;
    res.json({ authenticated: !!session?.adminAuth });
  });

  app.post("/api/admin/auth/logout", (req, res) => {
    (req.session as any).adminAuth = false;
    res.json({ success: true });
  });

  // Job listings CRUD
  app.get("/api/admin/jobs", requireAdminAuth, async (_req, res) => {
    try {
      const jobs = await db.select().from(jobListings).orderBy(desc(jobListings.createdAt));
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs" });
    }
  });

  app.post("/api/admin/jobs", requireAdminAuth, async (req, res) => {
    try {
      const validated = insertJobListingSchema.parse(req.body);
      const [job] = await db.insert(jobListings).values(validated).returning();
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Error creating job" });
    }
  });

  app.patch("/api/admin/jobs/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const allowedFields = ["title", "department", "type", "location", "description", "responsibilities", "qualifications", "isActive", "applicationsOpen"];
      const updates: Record<string, any> = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }
      if (Object.keys(updates).length === 0) return res.status(400).json({ message: "No valid fields to update" });
      const [job] = await db.update(jobListings).set(updates).where(eq(jobListings.id, id)).returning();
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Error updating job" });
    }
  });

  app.delete("/api/admin/jobs/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(jobApplications).where(eq(jobApplications.jobId, id));
      const [deleted] = await db.delete(jobListings).where(eq(jobListings.id, id)).returning();
      if (!deleted) return res.status(404).json({ message: "Job not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting job" });
    }
  });

  // Applications management
  app.get("/api/admin/applications", requireAdminAuth, async (_req, res) => {
    try {
      const apps = await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });

  app.patch("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
      if (!req.body.status || !validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status. Must be one of: " + validStatuses.join(", ") });
      }
      const [app] = await db.update(jobApplications).set({ status: req.body.status }).where(eq(jobApplications.id, id)).returning();
      if (!app) return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (error) {
      res.status(500).json({ message: "Error updating application" });
    }
  });

  app.delete("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [deleted] = await db.delete(jobApplications).where(eq(jobApplications.id, id)).returning();
      if (!deleted) return res.status(404).json({ message: "Application not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting application" });
    }
  });

  // Public routes for job listings & applications
  app.get("/api/jobs", async (_req, res) => {
    try {
      const jobs = await db.select().from(jobListings).where(eq(jobListings.isActive, true)).orderBy(desc(jobListings.createdAt));
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs" });
    }
  });

  app.post("/api/jobs/:id/apply", cvUpload.single("resume"), async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const [job] = await db.select().from(jobListings).where(eq(jobListings.id, jobId));
      if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });
      if ((job as any).applicationsOpen === false) return res.status(403).json({ message: "Applications for this role are currently closed" });

      const body = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
      const validated = insertJobApplicationSchema.parse({ ...body, jobId });

      const [application] = await db.insert(jobApplications).values(validated).returning();

      if (req.file) {
        await db.execute(
          sql`UPDATE job_applications SET resume_filename = ${req.file.originalname}, resume_mime_type = ${req.file.mimetype}, resume_data = ${req.file.buffer} WHERE id = ${application.id}`
        );
      }

      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Apply error:", error);
      res.status(500).json({ message: "Error submitting application" });
    }
  });

  app.get("/api/admin/applications/:id/cover-letter", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await db.execute(
        sql`SELECT name, cover_letter, created_at FROM job_applications WHERE id = ${id}`
      );
      const row = result.rows[0] as any;
      if (!row) return res.status(404).json({ message: "Application not found" });

      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: "Cover Letter", bold: true })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Applicant: ${row.name}`, italics: true, color: "555555" })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Date: ${new Date(row.created_at).toLocaleDateString()}`, italics: true, color: "555555" })],
            }),
            new Paragraph({ children: [new TextRun({ text: "" })] }),
            ...String(row.cover_letter || "").split("\n").map(
              (line: string) => new Paragraph({ children: [new TextRun({ text: line })] })
            ),
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      const filename = `cover-letter-${row.name.replace(/\s+/g, "-").toLowerCase()}.docx`;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      console.error("Cover letter DOCX error:", error);
      res.status(500).json({ message: "Error generating cover letter" });
    }
  });

  app.get("/api/admin/applications/:id/resume", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await db.execute(
        sql`SELECT resume_filename, resume_mime_type, resume_data FROM job_applications WHERE id = ${id}`
      );
      const row = result.rows[0] as any;
      if (!row || !row.resume_data) return res.status(404).json({ message: "No resume found" });

      res.setHeader("Content-Type", row.resume_mime_type);
      res.setHeader("Content-Disposition", `attachment; filename="${row.resume_filename}"`);
      res.send(Buffer.from(row.resume_data));
    } catch (error) {
      res.status(500).json({ message: "Error downloading resume" });
    }
  });

  // KPI Settings
  app.get("/api/kpi/settings", async (req, res) => {
    try {
      const settings = await storage.getKpiSettings();
      res.json(settings || { startDate: "2025-01-01" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching KPI settings" });
    }
  });

  app.post("/api/kpi/settings", async (req, res) => {
    try {
      const { startDate } = req.body;
      if (!startDate) return res.status(400).json({ message: "startDate required" });
      const settings = await storage.upsertKpiSettings(startDate);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error saving KPI settings" });
    }
  });

  // KPI Submissions
  app.get("/api/kpi/submissions", async (req, res) => {
    try {
      const { teamId } = req.query;
      const submissions = teamId
        ? await storage.getKpiSubmissionsByTeam(String(teamId))
        : await storage.getKpiSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching KPI submissions" });
    }
  });

  app.post("/api/kpi/submissions", async (req, res) => {
    try {
      const { teamId, weekNumber, inputs, kpiScores, teamScore } = req.body;
      if (!teamId || weekNumber == null || !inputs || !kpiScores || teamScore == null) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const submission = await storage.createKpiSubmission({
        teamId,
        weekNumber,
        inputs,
        kpiScores,
        teamScore,
      });
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Error saving KPI submission" });
    }
  });

  app.delete("/api/kpi/submissions", async (req, res) => {
    try {
      await storage.deleteAllKpiSubmissions();
      res.json({ message: "All KPI submissions deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting submissions" });
    }
  });

  // KPI Impact Data (manual monthly metrics)
  app.get("/api/kpi/impact-data", async (req, res) => {
    try {
      const data = await storage.getKpiImpactData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching impact data" });
    }
  });

  app.post("/api/kpi/impact-data", isWorkerAuthenticated, isWorkerAdmin, async (req, res) => {
    try {
      const { month, familiesServed, co2AvoidedKg } = req.body;
      if (!month) return res.status(400).json({ message: "month required" });
      const record = await storage.upsertKpiImpactData(
        month,
        Number(familiesServed) || 0,
        Number(co2AvoidedKg) || 0,
      );
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Error saving impact data" });
    }
  });

  // AI Probability Analysis
  app.post("/api/kpi/analysis", async (req, res) => {
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ message: "ANTHROPIC_API_KEY not configured. Please add it in Secrets." });
      }

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey });

      const { weekNumber, submissions, currentInputs } = req.body;
      if (weekNumber == null || !submissions || !currentInputs) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const kpiTargets = {
        marketing: {
          "Total Social Following": "5,000 followers by end of Year 1",
          "Avg Engagement Rate": "5% average engagement rate",
          "Posts Per Month": "12 posts per month (3/week)",
          "Press / Media Mentions": "4 confirmed mentions in Year 1",
        },
        partnerships: {
          "Active Institutional Partners": "6 active partners by end of Year 1",
          "Communities Reached": "5 communities reached",
          "Outreach Meetings / Month": "2 outreach meetings per month",
          "Partnership Conversion Rate": "30% conversion rate from outreach to partnership",
        },
        management: {
          "Active Team Members": "22 active members (up from 14)",
          "Member Retention Rate": "80% retention rate",
          "OKR Completion Rate": "70% of OKR tasks completed on time",
          "Team Leads in Place": "4 team leads",
        },
        impactlabs: {
          "Annual Impact Report": "1 published impact report",
          "Research Articles Published": "8 research articles in Year 1",
          "Data Accuracy Audit Score": "85% audit score",
          "External Citations": "2 external citations",
        },
        events: {
          "Events Organised / Year": "3 events organised",
          "Total Event Attendees": "300 total attendees",
          "Avg Attendees / Event": "100 average attendees per event",
          "Post-Event Satisfaction": "4.0 / 5 satisfaction score",
          "Repeat Attendee Rate": "15% repeat attendees",
          "Events with a Sponsor": "1 event with a confirmed sponsor",
        },
      };

      const prompt = `You are a KPI performance analyst for SolarPak, a growing solar energy nonprofit.

Given the complete weekly input history for all five teams, the Year 1 annual KPI targets, and the current week number out of 52, calculate the probability (0–100%) that each team will hit each KPI's annual target by year end, based on current pace and trajectory.

Current week: ${weekNumber} of 52 (${52 - weekNumber} weeks remaining)

Annual KPI targets:
${JSON.stringify(kpiTargets, null, 2)}

Weekly input history (most recent ${Math.min(submissions.length, 20)} submissions of ${submissions.length} total):
${JSON.stringify(submissions.slice(-20), null, 2)}

Current week inputs:
${JSON.stringify(currentInputs, null, 2)}

Analysis instructions:
- Calculate probability based on current pace vs what is needed by week 52
- Consider trajectory: is performance improving, flat, or declining?
- For cumulative KPIs (total followers, total articles, total attendees), extrapolate from current rate
- For quarterly fields, treat 0 as "not submitted this week" and use the last non-zero value
- For binary/event-triggered fields, check rolling frequency
- If there is no history yet, use current week inputs to estimate pace and return a moderate probability (40–60%) with appropriate uncertainty
- Self-assessed probability field should be cross-checked against your own calculation

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "marketing": {
    "overall": <0-100 integer>,
    "kpis": {
      "Total Social Following": <0-100>,
      "Avg Engagement Rate": <0-100>,
      "Posts Per Month": <0-100>,
      "Press / Media Mentions": <0-100>
    }
  },
  "partnerships": {
    "overall": <0-100>,
    "kpis": {
      "Active Institutional Partners": <0-100>,
      "Communities Reached": <0-100>,
      "Outreach Meetings / Month": <0-100>,
      "Partnership Conversion Rate": <0-100>
    }
  },
  "management": {
    "overall": <0-100>,
    "kpis": {
      "Active Team Members": <0-100>,
      "Member Retention Rate": <0-100>,
      "OKR Completion Rate": <0-100>,
      "Team Leads in Place": <0-100>
    }
  },
  "impactlabs": {
    "overall": <0-100>,
    "kpis": {
      "Annual Impact Report": <0-100>,
      "Research Articles Published": <0-100>,
      "Data Accuracy Audit Score": <0-100>,
      "External Citations": <0-100>
    }
  },
  "events": {
    "overall": <0-100>,
    "kpis": {
      "Events Organised / Year": <0-100>,
      "Total Event Attendees": <0-100>,
      "Avg Attendees / Event": <0-100>,
      "Post-Event Satisfaction": <0-100>,
      "Repeat Attendee Rate": <0-100>,
      "Events with a Sponsor": <0-100>
    }
  }
}`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(500).json({ message: "AI returned invalid response", raw });
      }
      const probabilities = JSON.parse(jsonMatch[0]);

      const teamIds = ["marketing", "partnerships", "management", "impactlabs", "events"];
      const executiveScore = Math.round(
        teamIds.reduce((sum, id) => sum + (probabilities[id]?.overall ?? 0), 0) / teamIds.length
      );

      res.json({ probabilities, executiveScore, weekNumber, timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("AI analysis error:", error);
      res.status(500).json({ message: error.message || "Analysis failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}