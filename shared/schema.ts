import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User schema with enhanced auth fields and roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"), // Can be null for OAuth users
  fullName: text("full_name"),
  username: text("username").unique(),
  profileImageUrl: text("profile_image_url"),
  provider: text("provider").default("local"), // 'local', 'google', 'apple'
  providerId: text("provider_id"), // External ID from provider
  stripeCustomerId: text("stripe_customer_id"),
  isVerified: boolean("is_verified").default(false),
  role: text("role").default("user").notNull(), // 'user', 'member', 'admin'
  membershipTier: text("membership_tier").default("none"), // 'none', 'bronze', 'silver', 'gold', 'platinum'
  totalDonated: doublePrecision("total_donated").default(0), // Track total donations
  lastDonationDate: timestamp("last_donation_date"), // Track last donation date
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Validate email and password for local sign up
export const insertUserSchema = createInsertSchema(users)
  .pick({
    email: true,
    password: true,
    fullName: true,
    username: true,
    provider: true,
    providerId: true,
    profileImageUrl: true,
    role: true,
    membershipTier: true,
    totalDonated: true,
    lastDonationDate: true
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    role: z.enum(['user', 'member', 'admin']).default('user').optional(),
    membershipTier: z.enum(['none', 'bronze', 'silver', 'gold', 'platinum']).default('none').optional(),
    totalDonated: z.number().default(0).optional(),
    lastDonationDate: z.date().optional().nullable()
  });

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  totalFundingGoal: doublePrecision("total_funding_goal").notNull(),
  currentFunding: doublePrecision("current_funding").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  currentFunding: true,
  createdAt: true,
});

// Donation schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  projectId: integer("project_id"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  paymentStatus: true,
  paymentIntentId: true,
  createdAt: true,
});

// Impact stories schema
export const impactStories = pgTable("impact_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertImpactStorySchema = createInsertSchema(impactStories).omit({
  id: true,
  createdAt: true,
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Stats schema
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  hoursWithoutPower: doublePrecision("hours_without_power").notNull(),
  temperature: doublePrecision("temperature").notNull(),
  homesHelped: integer("homes_helped").notNull().default(0),
  solarPanelsInstalled: integer("solar_panels_installed").notNull().default(0),
  co2Reduced: integer("co2_reduced").notNull().default(0),
  peopleImpacted: integer("people_impacted").notNull().default(0),
  cleanEnergy: integer("clean_energy").notNull().default(0),
  amountRaised: doublePrecision("amount_raised").notNull().default(0),
  goal: doublePrecision("goal").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  updatedAt: true,
});

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

// Uploaded images (stored in database for persistence across deployments)
export const uploadedImages = pgTable("uploaded_images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull().unique(),
  mimeType: text("mime_type").notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Impact Labs articles
export const impactLabsArticles = pgTable("impact_labs_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url"),
  authorName: text("author_name").notNull(),
  category: text("category").notNull().default("report"),
  tags: text("tags").array(),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertImpactLabsArticleSchema = createInsertSchema(impactLabsArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User impact media table
export const userImpacts = pgTable("user_impacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mediaType: text("media_type").notNull(), // 'photo' or 'video'
  mediaUrl: text("media_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  addedBy: integer("added_by").notNull().references(() => users.id), // admin who added it
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserImpactSchema = createInsertSchema(userImpacts).omit({
  id: true,
  createdAt: true,
});

// Job listings (managed via admin panel)
export const jobListings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").array().notNull(),
  qualifications: text("qualifications").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertJobListingSchema = createInsertSchema(jobListings).omit({
  id: true,
  createdAt: true,
});

// Job applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobListings.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  coverLetter: text("cover_letter").notNull(),
  resumeUrl: text("resume_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Type exports
export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type ImpactStory = typeof impactStories.$inferSelect;
export type InsertImpactStory = z.infer<typeof insertImpactStorySchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type UserImpact = typeof userImpacts.$inferSelect;
export type InsertUserImpact = z.infer<typeof insertUserImpactSchema>;

export type ImpactLabsArticle = typeof impactLabsArticles.$inferSelect;
export type InsertImpactLabsArticle = z.infer<typeof insertImpactLabsArticleSchema>;
