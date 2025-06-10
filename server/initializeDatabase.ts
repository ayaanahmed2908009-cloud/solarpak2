import { db } from "./db";
import { 
  users, projects, impactStories, testimonials, stats,
  type InsertUser, type InsertProject, type InsertImpactStory, 
  type InsertTestimonial, type InsertStats 
} from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

export async function initializeDatabase() {
  try {
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
          isVerified: true,
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
          isVerified: true,
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
        goal: 200000,
        updatedAt: new Date()
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
          currentFunding: 0,
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