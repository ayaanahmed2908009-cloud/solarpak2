import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Worker session storage table
export const workerSessions = pgTable(
  "worker_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_worker_session_expire").on(table.expire)],
);

// Worker accounts table
export const workers = pgTable("workers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // bcrypt hashed
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  role: varchar("role").default("worker").notNull(), // worker, admin, manager
  department: varchar("department"), // events, social-media, sponsorships, healthcare
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Worker activity logs
export const workerLogs = pgTable("worker_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  action: varchar("action").notNull(), // login, logout, create_project, etc.
  details: text("details"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertWorkerSchema = createInsertSchema(workers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkerLogSchema = createInsertSchema(workerLogs).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const workerLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration schema  
export const workerRegisterSchema = insertWorkerSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;
export type WorkerLog = typeof workerLogs.$inferSelect;
export type InsertWorkerLog = typeof workerLogs.$inferInsert;
export type WorkerLoginInput = z.infer<typeof workerLoginSchema>;
export type WorkerRegisterInput = z.infer<typeof workerRegisterSchema>;