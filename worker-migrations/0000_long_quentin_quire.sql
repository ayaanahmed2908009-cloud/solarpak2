CREATE TABLE "worker_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worker_id" varchar NOT NULL,
	"action" varchar NOT NULL,
	"details" text,
	"ip_address" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "worker_sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"role" varchar DEFAULT 'worker' NOT NULL,
	"department" varchar,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "workers_username_unique" UNIQUE("username"),
	CONSTRAINT "workers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "worker_logs" ADD CONSTRAINT "worker_logs_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_worker_session_expire" ON "worker_sessions" USING btree ("expire");