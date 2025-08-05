import { relations } from "drizzle-orm/relations";
import { users, userImpacts, workers, workerLogs, tasks, events } from "./schema";

export const userImpactsRelations = relations(userImpacts, ({one}) => ({
	user_userId: one(users, {
		fields: [userImpacts.userId],
		references: [users.id],
		relationName: "userImpacts_userId_users_id"
	}),
	user_addedBy: one(users, {
		fields: [userImpacts.addedBy],
		references: [users.id],
		relationName: "userImpacts_addedBy_users_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userImpacts_userId: many(userImpacts, {
		relationName: "userImpacts_userId_users_id"
	}),
	userImpacts_addedBy: many(userImpacts, {
		relationName: "userImpacts_addedBy_users_id"
	}),
}));

export const workerLogsRelations = relations(workerLogs, ({one}) => ({
	worker: one(workers, {
		fields: [workerLogs.workerId],
		references: [workers.id]
	}),
}));

export const workersRelations = relations(workers, ({many}) => ({
	workerLogs: many(workerLogs),
	tasks_assignedTo: many(tasks, {
		relationName: "tasks_assignedTo_workers_id"
	}),
	tasks_assignedBy: many(tasks, {
		relationName: "tasks_assignedBy_workers_id"
	}),
	events: many(events),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	worker_assignedTo: one(workers, {
		fields: [tasks.assignedTo],
		references: [workers.id],
		relationName: "tasks_assignedTo_workers_id"
	}),
	worker_assignedBy: one(workers, {
		fields: [tasks.assignedBy],
		references: [workers.id],
		relationName: "tasks_assignedBy_workers_id"
	}),
}));

export const eventsRelations = relations(events, ({one}) => ({
	worker: one(workers, {
		fields: [events.organizer],
		references: [workers.id]
	}),
}));