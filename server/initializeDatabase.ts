import { db } from "./db";
import { sql } from "drizzle-orm";
import {
  users, projects, impactStories, testimonials, stats,
  type InsertUser, type InsertProject, type InsertImpactStory,
  type InsertTestimonial, type InsertStats
} from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function ensureTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "uploaded_images" (
      "id" serial PRIMARY KEY NOT NULL,
      "filename" text NOT NULL,
      "mime_type" text NOT NULL,
      "data" text NOT NULL,
      "created_at" timestamp DEFAULT now(),
      CONSTRAINT "uploaded_images_filename_unique" UNIQUE("filename")
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "impact_labs_articles" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "slug" text NOT NULL,
      "summary" text NOT NULL,
      "content" text NOT NULL,
      "cover_image_url" text,
      "author_name" text NOT NULL,
      "category" text NOT NULL DEFAULT 'report',
      "tags" text[],
      "is_published" boolean NOT NULL DEFAULT false,
      "published_at" timestamp,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "impact_labs_articles_slug_unique" UNIQUE("slug")
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "job_listings" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "department" text NOT NULL,
      "type" text NOT NULL,
      "location" text NOT NULL,
      "description" text NOT NULL,
      "responsibilities" text[] NOT NULL,
      "qualifications" text[] NOT NULL,
      "is_active" boolean NOT NULL DEFAULT true,
      "applications_open" boolean NOT NULL DEFAULT true,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "job_applications" (
      "id" serial PRIMARY KEY NOT NULL,
      "job_id" integer NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "phone" text,
      "cover_letter" text NOT NULL,
      "resume_url" text,
      "resume_filename" text,
      "resume_mime_type" text,
      "status" text NOT NULL DEFAULT 'pending',
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "kpi_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "team_id" text NOT NULL,
      "week_number" integer NOT NULL,
      "inputs" jsonb NOT NULL,
      "kpi_scores" jsonb NOT NULL,
      "team_score" double precision NOT NULL,
      "submitted_at" timestamp NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "kpi_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "start_date" text NOT NULL DEFAULT '2025-01-01',
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `);
}

export async function initializeDatabase() {
  try {
    await ensureTables();
    // Check if admin accounts already exist
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'ayaan@solarpak.com')).limit(1);
    
    if (existingAdmin.length === 0) {
      // Create admin accounts
      const ayaanPasswordHash = await hashPassword('ayaan.123');
      const test1PasswordHash = await hashPassword('654321');
      
      const adminUsers: InsertUser[] = [
        {
          email: 'ayaan@solarpak.com',
          password: ayaanPasswordHash,
          fullName: 'Ayaan Administrator',
          username: 'ayaan',
          role: 'admin',
          membershipTier: 'platinum',
          totalDonated: 5000,
          lastDonationDate: new Date()
        },
        {
          email: 'test1@solarlightpakistan.org',
          password: test1PasswordHash,
          fullName: 'Test Administrator',
          username: 'test1',
          role: 'admin',
          membershipTier: 'platinum',
          totalDonated: 5000,
          lastDonationDate: new Date()
        }
      ];

      await db.insert(users).values(adminUsers);
      console.log('Admin accounts created successfully');
    }

    // Check if stats data exists
    const existingStats = await db.select().from(stats).limit(1);
    if (existingStats.length === 0) {
      const initialStats: InsertStats = {
        hoursWithoutPower: 12,
        temperature: 45, // Keep consistent with Khairpur Mirs conditions
        homesHelped: 5,
        solarPanelsInstalled: 5,
        co2Reduced: 10,
        peopleImpacted: 30,
        cleanEnergy: 15,
        amountRaised: 5000,
        goal: 200000
      };

      await db.insert(stats).values(initialStats);
      console.log('Initial stats created');
    }

    // Check if projects exist
    const existingProjects = await db.select().from(projects).limit(1);
    if (existingProjects.length === 0) {
      const initialProjects: InsertProject[] = [
        {
          name: "Bringing Light to Khairpur Mirs Sindh",
          description: "Bringing solar power to families in Khairpur Mirs, Sindh facing 12+ hour power outages daily in extreme heat conditions.",
          location: "Khairpur Mirs, Sindh, Pakistan",
          imageUrl: "",
          totalFundingGoal: 10000,
          isActive: true
        }
      ];

      await db.insert(projects).values(initialProjects);
      console.log('Initial projects created');
    }

    // Check if impact stories exist
    const existingStories = await db.select().from(impactStories).limit(1);
    if (existingStories.length === 0) {
      const initialStories: InsertImpactStory[] = [
        {
          title: "The Ahmed Family",
          description: "After receiving solar panels, the Ahmed family can now power their home consistently. Their children can study at night, and they no longer worry about food spoiling in their refrigerator.",
          location: "Khairpur Mirs, Sindh, Pakistan",
          imageUrl: "",
        },
        {
          title: "Community School",
          description: "A local school serving 120 students now has reliable electricity throughout the day. Students can use computers and attend classes without interruption, even during the hottest months.",
          location: "Khairpur Mirs, Sindh, Pakistan",
          imageUrl: "",
        },
        {
          title: "Local Clinic",
          description: "A healthcare facility serving rural communities now has 24/7 electricity. They can refrigerate vaccines, use medical equipment, and treat patients during evening hours.",
          location: "Khairpur Mirs, Sindh, Pakistan",
          imageUrl: "",
        }
      ];

      await db.insert(impactStories).values(initialStories);
      console.log('Initial impact stories created');
    }

    // Check if testimonials exist
    const existingTestimonials = await db.select().from(testimonials).limit(1);
    if (existingTestimonials.length === 0) {
      const initialTestimonials: InsertTestimonial[] = [
        {
          name: "Farhan Ahmed",
          location: "Khairpur Mirs, Sindh, Pakistan",
          message: "The solar panels have completely changed our lives. My children can now study at night, and we can keep our home cool during the hottest days. We no longer have to worry about the grid going down.",
          imageUrl: "",
          rating: 5
        }
      ];

      await db.insert(testimonials).values(initialTestimonials);
      console.log('Initial testimonials created');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}