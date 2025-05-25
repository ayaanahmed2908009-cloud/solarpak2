import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, login, logout, register, isAuthenticated, getCurrentUser } from "./auth";
import Stripe from "stripe";
import { insertDonationSchema, insertSubscriberSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  setupAuth(app);
  
  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/logout", logout);
  app.get("/api/auth/user", getCurrentUser);
  
  // Prefix all routes with /api
  
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

  // Create payment intent for donation - requires authentication
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      const { amount, donationId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        // Add metadata for tracking
        metadata: {
          donationId: donationId ? donationId.toString() : undefined,
          integration_check: 'accept_a_payment'
        },
      });

      // If we have a donation ID, update its payment intent ID
      if (donationId) {
        await storage.updateDonationStatus(donationId, "pending", paymentIntent.id);
      }

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error.message);
      res.status(500).json({ message: "Error creating payment intent", error: error.message });
    }
  });

  // Webhook for Stripe payment confirmation
  app.post("/api/webhook", async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'] as string;

    let event;

    try {
      // This is just a basic implementation - in production, you'd want to verify signatures
      // using a webhook secret from the Stripe dashboard
      event = payload;
      
      // If this were a real implementation with webhook signature verification:
      // event = stripe.webhooks.constructEvent(
      //   req.body,
      //   sig,
      //   'your_webhook_secret'
      // );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific event types
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Find the donation associated with this payment
      if (paymentIntent.metadata.donationId) {
        const donationId = parseInt(paymentIntent.metadata.donationId);
        const donation = await storage.getDonation(donationId);
        
        if (donation) {
          // Update donation status
          await storage.updateDonationStatus(donationId, "succeeded", paymentIntent.id);
          
          // If it's for a specific project, update project funding
          if (donation.projectId) {
            await storage.updateProjectFunding(donation.projectId, donation.amount);
          }
          
          // Update stats for successful donations
          await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0.1);
          await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
        }
      }
    }

    res.json({ received: true });
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

      // If payment succeeded and it's for a specific project, update project funding
      if (status === "succeeded" && donation.projectId) {
        await storage.updateProjectFunding(donation.projectId, donation.amount);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error processing payment webhook" });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(validatedData);
      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });
  
  // ======== User Management APIs (Admin only) ========
  
  // Middleware to check if user is an admin
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  };
  
  // Get all users (admin only)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove sensitive information
      const safeUsers = users.map(user => {
        const { password, ...userInfo } = user;
        return userInfo;
      });
      
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  // Update user role (admin only)
  app.patch("/api/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!role || !['user', 'member', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.updateUserRole(userId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...userInfo } = updatedUser;
      
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ message: "Error updating user role" });
    }
  });
  
  // Update user membership tier (admin only)
  app.patch("/api/admin/users/:id/membership", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { tier } = req.body;
      
      if (!tier || !['none', 'bronze', 'silver', 'gold', 'platinum'].includes(tier)) {
        return res.status(400).json({ message: "Invalid membership tier" });
      }
      
      const updatedUser = await storage.updateUserMembership(userId, tier);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive information
      const { password, ...userInfo } = updatedUser;
      
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ message: "Error updating user membership" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
