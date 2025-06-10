CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" double precision NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"project_id" integer,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_intent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impact_stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"image_url" text NOT NULL,
	"total_funding_goal" double precision NOT NULL,
	"current_funding" double precision DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"hours_without_power" double precision NOT NULL,
	"temperature" double precision NOT NULL,
	"homes_helped" integer DEFAULT 0 NOT NULL,
	"solar_panels_installed" integer DEFAULT 0 NOT NULL,
	"co2_reduced" integer DEFAULT 0 NOT NULL,
	"people_impacted" integer DEFAULT 0 NOT NULL,
	"clean_energy" integer DEFAULT 0 NOT NULL,
	"amount_raised" double precision DEFAULT 0 NOT NULL,
	"goal" double precision NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"message" text NOT NULL,
	"image_url" text NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_impacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"media_type" text NOT NULL,
	"media_url" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"added_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"full_name" text,
	"username" text,
	"profile_image_url" text,
	"provider" text DEFAULT 'local',
	"provider_id" text,
	"stripe_customer_id" text,
	"is_verified" boolean DEFAULT false,
	"role" text DEFAULT 'user' NOT NULL,
	"membership_tier" text DEFAULT 'none',
	"total_donated" double precision DEFAULT 0,
	"last_donation_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user_impacts" ADD CONSTRAINT "user_impacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_impacts" ADD CONSTRAINT "user_impacts_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");