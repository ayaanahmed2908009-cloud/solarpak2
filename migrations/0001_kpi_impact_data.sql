CREATE TABLE IF NOT EXISTS "kpi_impact_data" (
  "id" serial PRIMARY KEY NOT NULL,
  "month" text NOT NULL,
  "families_served" integer DEFAULT 0 NOT NULL,
  "co2_avoided_kg" double precision DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "kpi_impact_data_month_unique" UNIQUE("month")
);
