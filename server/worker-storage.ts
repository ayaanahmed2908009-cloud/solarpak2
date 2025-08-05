import { 
  workers, 
  workerLogs, 
  tasks, 
  events,
  workSubmissions,
  type Worker, 
  type InsertWorker, 
  type WorkerLog, 
  type InsertWorkerLog,
  type Task,
  type InsertTask,
  type Event,
  type InsertEvent,
  type WorkSubmission,
  type InsertWorkSubmission
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

  async getAllWorkSubmissions(): Promise<WorkSubmission[]> {
    return await workerDb
      .select()
      .from(workSubmissions)
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
}

export const workerStorage = new WorkerStorage();