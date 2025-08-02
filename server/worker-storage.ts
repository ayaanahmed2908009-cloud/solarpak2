import { workers, workerLogs, type Worker, type InsertWorker, type WorkerLog, type InsertWorkerLog } from "@shared/worker-schema";
import { workerDb } from "./worker-db";
import { eq, desc } from "drizzle-orm";
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
  
  // Authentication
  verifyWorkerPassword(username: string, password: string): Promise<Worker | null>;
  
  // Activity logs
  logWorkerActivity(log: InsertWorkerLog): Promise<WorkerLog>;
  getWorkerLogs(workerId: string, limit?: number): Promise<WorkerLog[]>;
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
}

export const workerStorage = new WorkerStorage();