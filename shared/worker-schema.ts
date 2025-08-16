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

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  status: varchar("status").default("pending").notNull(), // pending, in_progress, completed, cancelled
  priority: varchar("priority").default("medium").notNull(), // low, medium, high, urgent
  assignedTo: varchar("assigned_to").references(() => workers.id),
  assignedBy: varchar("assigned_by").references(() => workers.id).notNull(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  location: varchar("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: varchar("status").default("planned").notNull(), // planned, ongoing, completed, cancelled
  department: varchar("department").notNull(), // events, social-media, sponsorships, healthcare, management
  attendees: varchar("attendees"), // expected number of attendees
  organizer: varchar("organizer").references(() => workers.id).notNull(),
  participants: text("participants").array(), // Array of worker IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Work submissions table
export const workSubmissions = pgTable("work_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id).notNull(),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  description: text("description").notNull(),
  screenshotUrl: varchar("screenshot_url"), // URL to uploaded screenshot
  status: varchar("status").default("pending").notNull(), // pending, approved, rejected
  adminResponse: text("admin_response"), // Admin feedback/message
  reviewedBy: varchar("reviewed_by").references(() => workers.id), // Admin who reviewed
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workerId: varchar("worker_id").references(() => workers.id).notNull(),
  type: varchar("type").notNull(), // task_assigned, event_created, task_completed, etc.
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  relatedId: varchar("related_id"), // ID of related task/event/etc
  relatedType: varchar("related_type"), // task, event, submission, etc.
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
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

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkSubmissionSchema = createInsertSchema(workSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
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

// Task creation schema
export const createTaskSchema = insertTaskSchema.omit({
  assignedBy: true,
}).extend({
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Event creation schema
export const createEventSchema = insertEventSchema.omit({
  organizer: true,
  participants: true,
}).extend({
  startDate: z.string(),
  endDate: z.string().optional(),
});

// Work submission schema
export const createWorkSubmissionSchema = insertWorkSubmissionSchema.omit({
  workerId: true,
  reviewedBy: true,
  reviewedAt: true,
  adminResponse: true,
});

// Types
export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;
export type WorkerLog = typeof workerLogs.$inferSelect;
export type InsertWorkerLog = typeof workerLogs.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type WorkSubmission = typeof workSubmissions.$inferSelect;
export type InsertWorkSubmission = typeof workSubmissions.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type WorkerLoginInput = z.infer<typeof workerLoginSchema>;
export type WorkerRegisterInput = z.infer<typeof workerRegisterSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateWorkSubmissionInput = z.infer<typeof createWorkSubmissionSchema>;