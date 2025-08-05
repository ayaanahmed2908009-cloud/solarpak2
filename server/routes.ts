import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWorkerAuth, workerLogin, workerRegister, workerLogout, getCurrentWorker, isWorkerAuthenticated, isWorkerAdmin } from "./worker-auth";
import { workerStorage } from "./worker-storage";
import { createTaskSchema, createEventSchema, createWorkSubmissionSchema, workerRegisterSchema } from "@shared/worker-schema";
import { ObjectStorageService } from "./objectStorage";
import { wsManager } from "./websocket";

import { insertDonationSchema, insertSubscriberSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `impact-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
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
      
      const task = await workerStorage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Permission check for task deletion
      const isAdmin = req.worker.role === "admin";
      const isTaskCreator = task.assignedBy === req.worker.id;
      const isAssignedToTask = task.assignedTo === req.worker.id;

      // If the user is assigned to the task (even if they're a manager), they cannot delete it
      if (isAssignedToTask && !isAdmin) {
        return res.status(403).json({ 
          message: "Permission denied. You cannot delete tasks assigned to you." 
        });
      }

      // Only admins and task creators can delete tasks
      if (!isAdmin && !isTaskCreator) {
        return res.status(403).json({ 
          message: "Permission denied. Only task creators and admins can delete tasks." 
        });
      }

      await workerStorage.deleteTask(taskId);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "delete_task",
        details: `Deleted task: ${task.title}`,
        ipAddress: req.ip,
      });

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
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
      const event = await workerStorage.createEvent({
        ...validatedData,
        organizer: req.worker.id,
      });

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "create_event",
        details: `Created event: ${event.title}`,
        ipAddress: req.ip,
      });

      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
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

      // Only admins or event organizer can delete
      if (req.worker.role !== "admin" && req.worker.role !== "manager" && event.organizer !== req.worker.id) {
        return res.status(403).json({ message: "Access denied" });
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
      const { taskId } = req.query;
      const submissions = await workerStorage.getWorkSubmissions(taskId as string);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work submissions" });
    }
  });

  app.post("/worker/api/work-submissions", isWorkerAuthenticated, async (req, res) => {
    try {
      console.log("Work submission request:", {
        body: req.body,
        workerId: req.worker.id,
        workerUsername: req.worker.username
      });
      
      const validatedData = createWorkSubmissionSchema.parse(req.body);
      
      // Get the task to verify assignment
      const task = await workerStorage.getTaskById(validatedData.taskId);
      if (!task) {
        console.log("Task not found:", validatedData.taskId);
        return res.status(404).json({ message: "Task not found" });
      }
      
      console.log("Task assignment check:", {
        taskId: task.id,
        assignedTo: task.assignedTo,
        requestingWorker: req.worker.id,
        canSubmit: task.assignedTo === req.worker.id
      });
      
      // Only the worker assigned to the task can submit work for it
      if (task.assignedTo !== req.worker.id) {
        return res.status(403).json({ message: "You can only submit work for tasks assigned to you" });
      }
      
      const submission = await workerStorage.createWorkSubmission({
        ...validatedData,
        workerId: req.worker.id,
      });

      console.log("Work submission created successfully:", submission.id);

      // Log the action
      await workerStorage.logWorkerActivity({
        workerId: req.worker.id,
        action: "submit_work",
        details: `Submitted work for task: ${validatedData.taskId}`,
        ipAddress: req.ip,
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error("Work submission error:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.log("Validation error details:", validationError);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating work submission" });
    }
  });

  app.put("/worker/api/work-submissions/:submissionId", isWorkerAuthenticated, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const updates = req.body;

      // Only admins can review work submissions
      if (req.worker.role !== "admin") {
        return res.status(403).json({ message: "Only admins can review work submissions" });
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

  const httpServer = createServer(app);
  return httpServer;
}