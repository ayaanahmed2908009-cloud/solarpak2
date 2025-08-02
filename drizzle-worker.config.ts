import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/worker-schema.ts",
  out: "./worker-migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});