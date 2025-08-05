import { pgTable, serial, doublePrecision, text, integer, boolean, timestamp, index, varchar, jsonb, unique, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const donations = pgTable("donations", {
	id: serial().primaryKey().notNull(),
	amount: doublePrecision().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	projectId: integer("project_id"),
	isRecurring: boolean("is_recurring").default(false).notNull(),
	paymentStatus: text("payment_status").default('pending').notNull(),
	paymentIntentId: text("payment_intent_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const impactStories = pgTable("impact_stories", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	location: text().notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	location: text().notNull(),
	imageUrl: text("image_url").notNull(),
	totalFundingGoal: doublePrecision("total_funding_goal").notNull(),
	currentFunding: doublePrecision("current_funding").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const stats = pgTable("stats", {
	id: serial().primaryKey().notNull(),
	hoursWithoutPower: doublePrecision("hours_without_power").notNull(),
	temperature: doublePrecision().notNull(),
	homesHelped: integer("homes_helped").default(0).notNull(),
	solarPanelsInstalled: integer("solar_panels_installed").default(0).notNull(),
	co2Reduced: integer("co2_reduced").default(0).notNull(),
	peopleImpacted: integer("people_impacted").default(0).notNull(),
	cleanEnergy: integer("clean_energy").default(0).notNull(),
	amountRaised: doublePrecision("amount_raised").default(0).notNull(),
	goal: doublePrecision().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("subscribers_email_unique").on(table.email),
]);

export const testimonials = pgTable("testimonials", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	location: text().notNull(),
	message: text().notNull(),
	imageUrl: text("image_url").notNull(),
	rating: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text(),
	fullName: text("full_name"),
	username: text(),
	profileImageUrl: text("profile_image_url"),
	provider: text().default('local'),
	providerId: text("provider_id"),
	stripeCustomerId: text("stripe_customer_id"),
	isVerified: boolean("is_verified").default(false),
	role: text().default('user').notNull(),
	membershipTier: text("membership_tier").default('none'),
	totalDonated: doublePrecision("total_donated").default(0),
	lastDonationDate: timestamp("last_donation_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const userImpacts = pgTable("user_impacts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	mediaType: text("media_type").notNull(),
	mediaUrl: text("media_url").notNull(),
	title: text().notNull(),
	description: text(),
	addedBy: integer("added_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_impacts_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.addedBy],
			foreignColumns: [users.id],
			name: "user_impacts_added_by_users_id_fk"
		}),
]);

export const workerSessions = pgTable("worker_sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("idx_worker_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const workers = pgTable("workers", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar().notNull(),
	password: varchar().notNull(),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	role: varchar().default('worker').notNull(),
	department: varchar(),
	isActive: boolean("is_active").default(true).notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("workers_username_key").on(table.username),
	unique("workers_email_key").on(table.email),
]);

export const workerLogs = pgTable("worker_logs", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	workerId: varchar("worker_id").notNull(),
	action: varchar().notNull(),
	details: text(),
	ipAddress: varchar("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [workers.id],
			name: "worker_logs_worker_id_fkey"
		}),
]);

export const tasks = pgTable("tasks", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: varchar().notNull(),
	description: text(),
	status: varchar().default('pending').notNull(),
	priority: varchar().default('medium').notNull(),
	assignedTo: varchar("assigned_to"),
	assignedBy: varchar("assigned_by").notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.assignedTo],
			foreignColumns: [workers.id],
			name: "tasks_assigned_to_fkey"
		}),
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [workers.id],
			name: "tasks_assigned_by_fkey"
		}),
]);

export const events = pgTable("events", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	title: varchar().notNull(),
	description: text(),
	location: varchar(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
	status: varchar().default('planned').notNull(),
	organizer: varchar().notNull(),
	participants: text().array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	department: varchar(),
	attendees: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.organizer],
			foreignColumns: [workers.id],
			name: "events_organizer_fkey"
		}),
]);
