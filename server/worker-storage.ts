import { 
  workers, 
  workerLogs, 
  tasks, 
  events,
  workSubmissions,
  notifications,
  performancePeriods,
  performanceScores,
  type Worker, 
  type InsertWorker, 
  type WorkerLog, 
  type InsertWorkerLog,
  type Task,
  type InsertTask,
  type Event,
  type InsertEvent,
  type WorkSubmission,
  type InsertWorkSubmission,
  type Notification,
  type InsertNotification,
  type PerformancePeriod,
  type InsertPerformancePeriod,
  type PerformanceScore,
  type InsertPerformanceScore
} from "@shared/worker-schema";
import { workerDb } from "./worker-db";
import { eq, desc, and, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IWorkerStorage {
  // Worker operations
  getWorker(id: string): Promise<Worker | undefined>;
  getWorkerByUsername(username: string): Promise<Worker | undefined>;
  getWorkerByEmail(email: string): Promise<Worker | undefined>;
  createWorker(worker: InsertWorker): Promise<Worker>;
  updateWorker(id: string, updates: Partial<InsertWorker>): Promise<Worker | undefined>;
  updateWorkerLastLogin(id: string): Promise<void>;
  getAllWorkers(): Promise<Worker[]>;
  getWorkersByDepartment(department: string): Promise<Worker[]>;
  
  // Authentication
  verifyWorkerPassword(username: string, password: string): Promise<Worker | null>;
  
  // Activity logs
  logWorkerActivity(log: InsertWorkerLog): Promise<WorkerLog>;
  getWorkerLogs(workerId: string, limit?: number): Promise<WorkerLog[]>;
  
  // Task management
  createTask(task: InsertTask): Promise<Task>;
  getTasks(workerId?: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTaskById(id: string): Promise<Task | undefined>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;
  
  // Event management
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;
  
  // Work submission management
  createWorkSubmission(submission: InsertWorkSubmission): Promise<WorkSubmission>;
  getWorkSubmissions(taskId?: string): Promise<WorkSubmission[]>;
  getWorkSubmission(id: string): Promise<WorkSubmission | undefined>;
  updateWorkSubmission(id: string, updates: Partial<InsertWorkSubmission>): Promise<WorkSubmission | undefined>;
  
  // Notification management
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(workerId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(workerId: string): Promise<void>;
  
  // Performance scoring management
  createPerformancePeriod(period: InsertPerformancePeriod): Promise<PerformancePeriod>;
  getPerformancePeriods(): Promise<PerformancePeriod[]>;
  getActivePerformancePeriod(): Promise<PerformancePeriod | undefined>;
  setActivePerformancePeriod(periodId: string): Promise<void>;
  createPerformanceScore(score: InsertPerformanceScore): Promise<PerformanceScore>;
  getPerformanceScores(periodId?: string, workerId?: string): Promise<PerformanceScore[]>;
  getPerformanceScore(periodId: string, workerId: string): Promise<PerformanceScore | undefined>;
  updatePerformanceScore(id: string, updates: Partial<InsertPerformanceScore>): Promise<PerformanceScore | undefined>;
  acknowledgePerformanceScore(scoreId: string): Promise<void>;
}

export class WorkerStorage implements IWorkerStorage {
  async getWorker(id: string): Promise<Worker | undefined> {
    const [worker] = await workerDb.select().from(workers).where(eq(workers.id, id));
    return worker;
  }

  async getWorkerByUsername(username: string): Promise<Worker | undefined> {
    const [worker] = await workerDb.select().from(workers).where(eq(workers.username, username));
    return worker;
  }

  async getWorkerByEmail(email: string): Promise<Worker | undefined> {
    const [worker] = await workerDb.select().from(workers).where(eq(workers.email, email));
    return worker;
  }

  async createWorker(workerData: InsertWorker): Promise<Worker> {
    // Hash password before storing
    if (workerData.password) {
      workerData.password = await bcrypt.hash(workerData.password, 12);
    }

    const [worker] = await workerDb
      .insert(workers)
      .values({
        ...workerData,
        updatedAt: new Date(),
      })
      .returning();
    return worker;
  }

  async updateWorker(id: string, updates: Partial<InsertWorker>): Promise<Worker | undefined> {
    // Hash password if being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const [worker] = await workerDb
      .update(workers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(workers.id, id))
      .returning();
    return worker;
  }

  async updateWorkerLastLogin(id: string): Promise<void> {
    await workerDb
      .update(workers)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(workers.id, id));
  }

  async getAllWorkers(): Promise<Worker[]> {
    return await workerDb.select().from(workers);
  }

  async getWorkersByDepartment(department: string): Promise<Worker[]> {
    return await workerDb.select().from(workers).where(eq(workers.department, department));
  }

  async verifyWorkerPassword(username: string, password: string): Promise<Worker | null> {
    const worker = await this.getWorkerByUsername(username);
    if (!worker || !worker.isActive) {
      return null;
    }

    const isValid = await bcrypt.compare(password, worker.password);
    return isValid ? worker : null;
  }

  async logWorkerActivity(logData: InsertWorkerLog): Promise<WorkerLog> {
    const [log] = await workerDb
      .insert(workerLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getWorkerLogs(workerId: string, limit: number = 50): Promise<WorkerLog[]> {
    return await workerDb
      .select()
      .from(workerLogs)
      .where(eq(workerLogs.workerId, workerId))
      .orderBy(desc(workerLogs.createdAt))
      .limit(limit);
  }

  // Task management methods
  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await workerDb
      .insert(tasks)
      .values({
        ...taskData,
        updatedAt: new Date(),
      })
      .returning();
    return task;
  }

  async getTasks(workerId?: string): Promise<Task[]> {
    if (workerId) {
      return await workerDb
        .select()
        .from(tasks)
        .where(or(eq(tasks.assignedTo, workerId), eq(tasks.assignedBy, workerId)))
        .orderBy(desc(tasks.createdAt));
    }
    return await workerDb
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await workerDb.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    const [task] = await workerDb.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await workerDb
      .update(tasks)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await workerDb.delete(tasks).where(eq(tasks.id, id));
  }

  async deleteWorkSubmissionsByTaskId(taskId: string): Promise<void> {
    await workerDb.delete(workSubmissions).where(eq(workSubmissions.taskId, taskId));
  }

  // Event management methods
  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await workerDb
      .insert(events)
      .values({
        ...eventData,
        updatedAt: new Date(),
      })
      .returning();
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return await workerDb
      .select()
      .from(events)
      .orderBy(desc(events.startDate));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await workerDb.select().from(events).where(eq(events.id, id));
    return event;
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await workerDb
      .update(events)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    await workerDb.delete(events).where(eq(events.id, id));
  }

  // Work submission management methods
  async createWorkSubmission(submissionData: InsertWorkSubmission): Promise<WorkSubmission> {
    const [submission] = await workerDb
      .insert(workSubmissions)
      .values({
        ...submissionData,
        updatedAt: new Date(),
      })
      .returning();
    return submission;
  }

  async getWorkSubmissions(taskId?: string): Promise<WorkSubmission[]> {
    if (taskId) {
      return await workerDb
        .select()
        .from(workSubmissions)
        .where(eq(workSubmissions.taskId, taskId))
        .orderBy(desc(workSubmissions.createdAt));
    }
    return await workerDb
      .select()
      .from(workSubmissions)
      .orderBy(desc(workSubmissions.createdAt));
  }

  async getWorkSubmission(id: string): Promise<WorkSubmission | undefined> {
    const [submission] = await workerDb.select().from(workSubmissions).where(eq(workSubmissions.id, id));
    return submission;
  }

  async updateWorkSubmission(id: string, updates: Partial<InsertWorkSubmission>): Promise<WorkSubmission | undefined> {
    const [submission] = await workerDb
      .update(workSubmissions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(workSubmissions.id, id))
      .returning();
    return submission;
  }

  async getAllWorkSubmissions(): Promise<any[]> {
    return await workerDb
      .select({
        id: workSubmissions.id,
        taskId: workSubmissions.taskId,
        workerId: workSubmissions.workerId,
        description: workSubmissions.description,
        screenshotUrl: workSubmissions.screenshotUrl,
        status: workSubmissions.status,
        adminResponse: workSubmissions.adminResponse,
        reviewedBy: workSubmissions.reviewedBy,
        reviewedAt: workSubmissions.reviewedAt,
        createdAt: workSubmissions.createdAt,
        updatedAt: workSubmissions.updatedAt,
        // Join with tasks and workers to get additional info
        taskTitle: tasks.title,
        taskDescription: tasks.description,
        workerFirstName: workers.firstName,
        workerLastName: workers.lastName,
        workerUsername: workers.username,
      })
      .from(workSubmissions)
      .innerJoin(tasks, eq(workSubmissions.taskId, tasks.id))
      .innerJoin(workers, eq(workSubmissions.workerId, workers.id))
      .orderBy(desc(workSubmissions.createdAt));
  }

  async getWorkSubmissionsByDepartment(department: string): Promise<any[]> {
    return await workerDb
      .select({
        id: workSubmissions.id,
        taskId: workSubmissions.taskId,
        workerId: workSubmissions.workerId,
        description: workSubmissions.description,
        screenshotUrl: workSubmissions.screenshotUrl,
        status: workSubmissions.status,
        adminResponse: workSubmissions.adminResponse,
        reviewedBy: workSubmissions.reviewedBy,
        reviewedAt: workSubmissions.reviewedAt,
        createdAt: workSubmissions.createdAt,
        updatedAt: workSubmissions.updatedAt,
        // Join with tasks and workers to get additional info
        taskTitle: tasks.title,
        taskDescription: tasks.description,
        workerFirstName: workers.firstName,
        workerLastName: workers.lastName,
        workerUsername: workers.username,
      })
      .from(workSubmissions)
      .innerJoin(tasks, eq(workSubmissions.taskId, tasks.id))
      .innerJoin(workers, eq(workSubmissions.workerId, workers.id))
      .where(eq(workers.department, department))
      .orderBy(desc(workSubmissions.createdAt));
  }

  async getWorkSubmissionsByWorker(workerId: string): Promise<any[]> {
    return await workerDb
      .select({
        id: workSubmissions.id,
        taskId: workSubmissions.taskId,
        workerId: workSubmissions.workerId,
        description: workSubmissions.description,
        screenshotUrl: workSubmissions.screenshotUrl,
        status: workSubmissions.status,
        adminResponse: workSubmissions.adminResponse,
        reviewedBy: workSubmissions.reviewedBy,
        reviewedAt: workSubmissions.reviewedAt,
        createdAt: workSubmissions.createdAt,
        updatedAt: workSubmissions.updatedAt,
        // Join with tasks to get task info
        taskTitle: tasks.title,
        taskDescription: tasks.description,
      })
      .from(workSubmissions)
      .innerJoin(tasks, eq(workSubmissions.taskId, tasks.id))
      .where(eq(workSubmissions.workerId, workerId))
      .orderBy(desc(workSubmissions.createdAt));
  }

  // Notification management methods
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await workerDb
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getNotifications(workerId: string, unreadOnly?: boolean): Promise<Notification[]> {
    if (unreadOnly) {
      return await workerDb
        .select()
        .from(notifications)
        .where(and(
          eq(notifications.workerId, workerId),
          eq(notifications.isRead, false)
        ))
        .orderBy(desc(notifications.createdAt));
    }

    return await workerDb
      .select()
      .from(notifications)
      .where(eq(notifications.workerId, workerId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await workerDb
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(workerId: string): Promise<void> {
    await workerDb
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(
        eq(notifications.workerId, workerId),
        eq(notifications.isRead, false)
      ));
  }

  // Performance scoring methods
  async createPerformancePeriod(period: InsertPerformancePeriod): Promise<PerformancePeriod> {
    // First set all existing periods to inactive
    await workerDb
      .update(performancePeriods)
      .set({ isActive: false });
    
    const [newPeriod] = await workerDb
      .insert(performancePeriods)
      .values({
        ...period,
        isActive: true
      })
      .returning();
    return newPeriod;
  }

  async getPerformancePeriods(): Promise<PerformancePeriod[]> {
    return await workerDb
      .select()
      .from(performancePeriods)
      .orderBy(desc(performancePeriods.createdAt));
  }

  async getActivePerformancePeriod(): Promise<PerformancePeriod | undefined> {
    const [period] = await workerDb
      .select()
      .from(performancePeriods)
      .where(eq(performancePeriods.isActive, true));
    return period;
  }

  async setActivePerformancePeriod(periodId: string): Promise<void> {
    // Set all periods to inactive
    await workerDb
      .update(performancePeriods)
      .set({ isActive: false });
    
    // Set the specified period to active
    await workerDb
      .update(performancePeriods)
      .set({ isActive: true })
      .where(eq(performancePeriods.id, periodId));
  }

  async createPerformanceScore(score: InsertPerformanceScore): Promise<PerformanceScore> {
    // Calculate overall score
    const scores = [
      parseInt(score.taskCompletion),
      parseInt(score.teamwork),
      parseInt(score.initiative),
      parseInt(score.reliability),
      parseInt(score.qualityOfWork)
    ];
    const overallScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

    const [newScore] = await workerDb
      .insert(performanceScores)
      .values({
        ...score,
        overallScore: overallScore.toString()
      })
      .returning();
    return newScore;
  }

  async getPerformanceScores(periodId?: string, workerId?: string): Promise<PerformanceScore[]> {
    if (periodId && workerId) {
      return await workerDb
        .select()
        .from(performanceScores)
        .where(and(
          eq(performanceScores.periodId, periodId),
          eq(performanceScores.workerId, workerId)
        ))
        .orderBy(desc(performanceScores.createdAt));
    } else if (periodId) {
      return await workerDb
        .select()
        .from(performanceScores)
        .where(eq(performanceScores.periodId, periodId))
        .orderBy(desc(performanceScores.createdAt));
    } else if (workerId) {
      return await workerDb
        .select()
        .from(performanceScores)
        .where(eq(performanceScores.workerId, workerId))
        .orderBy(desc(performanceScores.createdAt));
    }

    return await workerDb
      .select()
      .from(performanceScores)
      .orderBy(desc(performanceScores.createdAt));
  }

  async getPerformanceScore(periodId: string, workerId: string): Promise<PerformanceScore | undefined> {
    const [score] = await workerDb
      .select()
      .from(performanceScores)
      .where(and(
        eq(performanceScores.periodId, periodId),
        eq(performanceScores.workerId, workerId)
      ));
    return score;
  }

  async updatePerformanceScore(id: string, updates: Partial<InsertPerformanceScore>): Promise<PerformanceScore | undefined> {
    // Recalculate overall score if any category scores are updated
    if (updates.taskCompletion || updates.teamwork || updates.initiative || 
        updates.reliability || updates.qualityOfWork) {
      const [currentScore] = await workerDb
        .select()
        .from(performanceScores)
        .where(eq(performanceScores.id, id));
      
      if (currentScore) {
        const scores = [
          parseInt(updates.taskCompletion || currentScore.taskCompletion),
          parseInt(updates.teamwork || currentScore.teamwork),
          parseInt(updates.initiative || currentScore.initiative),
          parseInt(updates.reliability || currentScore.reliability),
          parseInt(updates.qualityOfWork || currentScore.qualityOfWork)
        ];
        const overallScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
        updates.overallScore = overallScore.toString();
      }
    }

    const [updated] = await workerDb
      .update(performanceScores)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(performanceScores.id, id))
      .returning();
    return updated;
  }

  async acknowledgePerformanceScore(scoreId: string): Promise<void> {
    await workerDb
      .update(performanceScores)
      .set({ 
        employeeAcknowledgedAt: new Date(),
        status: "acknowledged"
      })
      .where(eq(performanceScores.id, scoreId));
  }
}

export const workerStorage = new WorkerStorage();