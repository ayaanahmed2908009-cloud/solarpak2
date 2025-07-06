import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, login, logout, register, isAuthenticated, getCurrentUser } from "./auth";
import { wsManager } from "./websocket";

import { insertDonationSchema, insertSubscriberSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `impact-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  setupAuth(app);
  
  // Authentication routes
  app.post("/api/login", login);
  app.post("/api/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/logout", logout);
  app.get("/api/auth/logout", logout);
  app.get("/api/auth/user", getCurrentUser);
  
  // Get stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  // Get a specific project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });

  // Get impact stories
  app.get("/api/impact-stories", async (req, res) => {
    try {
      const stories = await storage.getImpactStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching impact stories" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  // Get all donations
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });

  // Create a donation (initial record before payment) - requires authentication
  app.post("/api/donations", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      
      // Use the authenticated user's email if available
      if (req.user && (req.user as any).email) {
        validatedData.email = (req.user as any).email;
      }
      
      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating donation" });
    }
  });





  // Create donation without payment processing
  app.post("/api/create-donation", isAuthenticated, async (req, res) => {
    try {
      const { amount, isMonthly, projectId, name, email, message } = req.body;
      const user = req.user as any;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create donation record as completed (no payment processing)
      const donationData = {
        name: name || user.fullName || 'Anonymous',
        email: email || user.email,
        amount: amount,
        projectId: projectId || null,
        isRecurring: isMonthly || false
      };

      const donation = await storage.createDonation(donationData);
      
      // Update user's total donated amount and membership tier
      if (user) {
        await storage.updateUserDonationStats(user.id, amount);
        
        // Notify admins of the donation
        wsManager.broadcastToAdmins({
          type: 'new_donation',
          data: {
            donorName: donation.name,
            amount: donation.amount,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      res.json({ 
        success: true,
        donationId: donation.id,
        amount: amount,
        message: "Donation recorded successfully"
      });
    } catch (error: any) {
      console.error("Donation creation error:", error);
      res.status(500).json({ 
        message: "Error creating donation", 
        error: error.message 
      });
    }
  });



  // Get donation session details for success page
  app.get("/api/donation-session/:donationId", isAuthenticated, async (req, res) => {
    try {
      const { donationId } = req.params;
      
      if (!donationId) {
        return res.status(400).json({ message: "Donation ID is required" });
      }

      const donation = await storage.getDonation(parseInt(donationId));
      
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Return donation details for success page
      const donationData = {
        amount: donation.amount,
        currency: 'USD',
        isMonthly: donation.isRecurring,
        projectId: donation.projectId?.toString(),
        donorName: donation.name,
        donorEmail: donation.email,
        status: donation.paymentStatus,
        donationId: donation.id
      };

      res.json(donationData);
    } catch (error: any) {
      console.error("Error retrieving donation details:", error);
      res.status(500).json({ message: "Error retrieving donation details" });
    }
  });

  // Manual payment confirmation (for testing without webhook setup)
  app.post("/api/payment-webhook", async (req, res) => {
    try {
      const { donationId, status } = req.body;

      if (!donationId) {
        return res.status(400).json({ message: "Donation ID is required" });
      }

      const donation = await storage.getDonation(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }

      // Update donation status
      await storage.updateDonationStatus(donationId, status || "succeeded");

      // If donation is successful, update stats
      if (status === "succeeded") {
        await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0);
        await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
      }

      res.json({ message: "Payment status updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating payment status" });
    }
  });

  // Admin routes (require authentication)
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    const user = req.user as any;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Get all users (admin only)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Update user role (admin only)
  app.put("/api/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.updateUserRole(userId, role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user role" });
    }
  });

  // Create project (admin only)
  app.post("/api/admin/projects", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { name, description, location, imageUrl, totalFundingGoal } = req.body;
      
      if (!name || !description || !location || !totalFundingGoal) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const project = await storage.createProject({
        name,
        description,
        location,
        imageUrl: imageUrl || "",
        totalFundingGoal,
        isActive: true
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Error creating project" });
    }
  });

  // Create impact story (admin only)
  app.post("/api/admin/impact-stories", isAuthenticated, isAdmin, upload.single('media'), async (req, res) => {
    try {
      const { title, description, location } = req.body;
      
      if (!title || !description || !location) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

      const story = await storage.createImpactStory({
        title,
        description,
        location,
        imageUrl
      });

      res.status(201).json(story);
    } catch (error) {
      res.status(500).json({ message: "Error creating impact story" });
    }
  });

  // Create testimonial (admin only)
  app.post("/api/admin/testimonials", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { name, location, message, imageUrl, rating } = req.body;
      
      if (!name || !location || !message || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const testimonial = await storage.createTestimonial({
        name,
        location,
        message,
        imageUrl: imageUrl || "",
        rating
      });

      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Serve static files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}