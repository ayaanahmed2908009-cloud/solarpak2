CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"location" varchar,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" varchar DEFAULT 'planned' NOT NULL,
	"department" varchar NOT NULL,
	"attendees" varchar,
	"organizer" varchar NOT NULL,
	"participants" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worker_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"related_id" varchar,
	"related_type" varchar,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "performance_periods" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"month" varchar NOT NULL,
	"year" varchar NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"status" varchar DEFAULT 'open' NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "performance_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"scored_by" varchar NOT NULL,
	"task_completion" varchar NOT NULL,
	"teamwork" varchar NOT NULL,
	"initiative" varchar NOT NULL,
	"reliability" varchar NOT NULL,
	"quality_of_work" varchar NOT NULL,
	"overall_score" varchar NOT NULL,
	"strengths" text,
	"areas_for_improvement" text,
	"goals" text,
	"admin_notes" text,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"employee_acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"priority" varchar DEFAULT 'medium' NOT NULL,
	"assigned_to" varchar,
	"assigned_by" varchar NOT NULL,
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" varchar NOT NULL,
	"worker_id" varchar NOT NULL,
	"description" text NOT NULL,
	"screenshot_url" varchar,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"admin_response" text,
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_workers_id_fk" FOREIGN KEY ("organizer") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_periods" ADD CONSTRAINT "performance_periods_created_by_workers_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_scores" ADD CONSTRAINT "performance_scores_period_id_performance_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."performance_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_scores" ADD CONSTRAINT "performance_scores_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_scores" ADD CONSTRAINT "performance_scores_scored_by_workers_id_fk" FOREIGN KEY ("scored_by") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_workers_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_by_workers_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_submissions" ADD CONSTRAINT "work_submissions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_submissions" ADD CONSTRAINT "work_submissions_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_submissions" ADD CONSTRAINT "work_submissions_reviewed_by_workers_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;