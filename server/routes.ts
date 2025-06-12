import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, login, logout, register, isAuthenticated, getCurrentUser } from "./auth";
import { wsManager } from "./websocket";
import Stripe from "stripe";
import { insertDonationSchema, insertSubscriberSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  // Create Stripe checkout session for donations
  app.post("/api/create-checkout-session", isAuthenticated, async (req, res) => {
    try {
      const { amount, isMonthly, projectId } = req.body;
      const user = req.user as any;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create the checkout session configuration
      const sessionConfig: any = {
        payment_method_types: ['card'],
        customer_email: user.email,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Solar Panel Donation${projectId ? ` - Project ${projectId}` : ''}`,
              description: 'Supporting solar energy access for families in Pakistan',
              images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=300&fit=crop'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: isMonthly ? 'subscription' : 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        metadata: {
          userId: user.id.toString(),
          projectId: projectId || '',
          amount: amount.toString(),
          type: isMonthly ? 'monthly' : 'one-time'
        }
      };

      // For monthly payments, set up recurring billing
      if (isMonthly) {
        sessionConfig.line_items[0].price_data.recurring = {
          interval: 'month'
        };
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.json({ 
        checkoutUrl: session.url,
        sessionId: session.id 
      });
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({ 
        message: "Error creating checkout session", 
        error: error.message 
      });
    }
  });
  
  // Create subscription for recurring donation - requires authentication
  app.post("/api/create-subscription", isAuthenticated, async (req, res) => {
    try {
      const { amount, donationId, email, name } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Get the donation details if we have an ID
      let donationEmail = email;
      let donationName = name;
      
      if (donationId) {
        const donation = await storage.getDonation(donationId);
        if (donation) {
          donationEmail = donation.email;
          donationName = donation.name;
        }
      }
      
      if (!donationEmail) {
        return res.status(400).json({ message: "Email is required for subscriptions" });
      }
      
      // First, create or retrieve the customer
      let customer;
      
      // Try to find an existing customer with this email
      const customers = await stripe.customers.list({ email: donationEmail });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        // Create a new customer
        customer = await stripe.customers.create({
          email: donationEmail,
          name: donationName || undefined,
        });
      }
      
      // Create a price for this donation amount
      // In a production app, you would probably have predefined price IDs
      const price = await stripe.prices.create({
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'Monthly Donation to SolarPak',
        },
        metadata: {
          donationId: donationId ? donationId.toString() : undefined,
        },
      });
      
      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          donationId: donationId ? donationId.toString() : undefined,
        },
      });
      
      // Access the client secret
      const invoice = subscription.latest_invoice as any;
      const clientSecret = invoice?.payment_intent?.client_secret;
      
      // If we have a donation ID, update its status
      if (donationId) {
        await storage.updateDonationStatus(donationId, "pending", subscription.id);
      }
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: clientSecret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error.message);
      res.status(500).json({ message: "Error creating subscription", error: error.message });
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
    try {
      // Handle one-time payment success
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Find the donation associated with this payment
        if (paymentIntent.metadata?.donationId) {
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
            await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0);
            await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
            
            // Find the user by email and update their membership status
            const user = await storage.getUserByEmail(donation.email);
            if (user) {
              // Update user's donation stats and membership tier
              const updatedUser = await storage.updateUserDonationStats(user.id, donation.amount);
              console.log(`Updated membership for user ${user.id} after donation of $${donation.amount}`);
              
              // Notify via WebSocket for real-time updates
              if (updatedUser) {
                const { wsManager } = await import('./websocket');
                wsManager.notifyUserUpdate(updatedUser.id, {
                  type: 'donation_processed',
                  user: updatedUser,
                  donation: donation
                });
                
                // Notify all admin users about the new donation
                wsManager.broadcastToAdmins({
                  type: 'new_donation_processed',
                  user: updatedUser,
                  donation: donation
                });
              }
            }
            
            console.log(`Payment succeeded for donation ${donationId}`);
          }
        }
      }
      
      // Handle subscription payment success
      else if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        
        // Check if this is a subscription payment
        if (invoice.subscription) {
          // Get the subscription details to find the metadata
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          if (subscription.metadata?.donationId) {
            const donationId = parseInt(subscription.metadata.donationId);
            const donation = await storage.getDonation(donationId);
            
            if (donation) {
              // Update donation status
              await storage.updateDonationStatus(donationId, "succeeded", subscription.id);
              
              // If it's for a specific project, update project funding
              if (donation.projectId) {
                await storage.updateProjectFunding(donation.projectId, donation.amount);
              }
              
              // Update stats for successful donations
              await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0);
              await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
              
              // Find the user by email and update their membership status
              const user = await storage.getUserByEmail(donation.email);
              if (user) {
                // Update user's donation stats and membership tier
                const updatedUser = await storage.updateUserDonationStats(user.id, donation.amount);
                console.log(`Updated membership for user ${user.id} after subscription payment of $${donation.amount}`);
                
                // Notify via WebSocket for real-time updates
                if (updatedUser) {
                  const { wsManager } = await import('./websocket');
                  wsManager.notifyUserUpdate(updatedUser.id, {
                    type: 'subscription_payment_processed',
                    user: updatedUser,
                    donation: donation
                  });
                  
                  // Notify all admin users about the subscription payment
                  wsManager.broadcastToAdmins({
                    type: 'new_subscription_payment_processed',
                    user: updatedUser,
                    donation: donation
                  });
                }
              }
              
              console.log(`Subscription payment succeeded for donation ${donationId}`);
            }
          }
        }
      }
      
      // Handle subscription creation (first payment)
      else if (event.type === 'customer.subscription.created') {
        const subscription = event.data.object;
        
        if (subscription.metadata?.donationId) {
          const donationId = parseInt(subscription.metadata.donationId);
          const donation = await storage.getDonation(donationId);
          
          if (donation) {
            // Update donation status
            await storage.updateDonationStatus(donationId, "active", subscription.id);
            console.log(`Subscription created for donation ${donationId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
    }

    // Always return a 200 response to acknowledge receipt of the event
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

      // If payment succeeded
      if (status === "succeeded" || !status) {
        // If it's for a specific project, update project funding
        if (donation.projectId) {
          await storage.updateProjectFunding(donation.projectId, donation.amount);
        }
        
        // Update stats for successful donations
        await storage.incrementStatsHomesHelped(donation.amount >= 1000 ? 1 : 0);
        await storage.incrementStatsSolarPanels(Math.ceil(donation.amount / 200));
        
        // Find the user by email and update their membership status
        const user = await storage.getUserByEmail(donation.email);
        if (user) {
          // Update user's donation stats and membership tier
          const updatedUser = await storage.updateUserDonationStats(user.id, donation.amount);
          console.log(`Updated membership for user ${user.id} after donation of $${donation.amount}`);
          
          // Notify via WebSocket for real-time updates
          if (updatedUser) {
            const { wsManager } = await import('./websocket');
            wsManager.notifyUserUpdate(updatedUser.id, {
              type: 'manual_donation_processed',
              user: updatedUser,
              donation: donation
            });
            
            // Notify all admin users about the donation
            wsManager.broadcastToAdmins({
              type: 'new_manual_donation_processed',
              user: updatedUser,
              donation: donation
            });
          }
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing payment webhook:", error);
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
    console.log('Admin check - User:', { id: user?.id, email: user?.email, role: user?.role });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  };
  
  // Get all users (admin only) - includes password hashes for admin view
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Include password hashes for admin view as requested
      const adminUserView = users.map(user => ({
        ...user,
        passwordHash: user.password // Expose password hash for admin
      }));
      
      res.json(adminUserView);
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

  // File upload endpoint for admin users
  app.post("/api/admin/upload-media", isAuthenticated, isAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        message: "File uploaded successfully",
        fileUrl,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get user impacts (for user dashboard)
  app.get("/api/user-impacts/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const impacts = await storage.getUserImpacts(userId);
      res.json(impacts);
    } catch (error) {
      console.error("Error fetching user impacts:", error);
      res.status(500).json({ message: "Failed to fetch user impacts" });
    }
  });

  // User impact routes
  app.post("/api/admin/user-impact", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId, mediaType, mediaUrl, title, description } = req.body;
      const adminId = (req as any).user.id;

      if (!userId || !mediaType || !mediaUrl || !title) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const impact = await storage.addUserImpact({
        userId: parseInt(userId),
        mediaType,
        mediaUrl,
        title,
        description: description || null,
        addedBy: adminId
      });

      // Send real-time notification to the user
      wsManager.notifyUserImpactUpdate(parseInt(userId), impact);

      res.json(impact);
    } catch (error) {
      console.error("Error adding user impact:", error);
      res.status(500).json({ message: "Failed to add user impact" });
    }
  });

  // Get user impacts for specific user (for user dashboard and admin viewing specific user)
  app.get("/api/user-impacts/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const impacts = await storage.getUserImpacts(userId);
      res.json(impacts);
    } catch (error) {
      console.error("Error fetching user impacts:", error);
      res.status(500).json({ message: "Failed to fetch user impacts" });
    }
  });

  // Get current user's impacts (for user dashboard)
  app.get("/api/user-impacts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const impacts = await storage.getUserImpacts(userId);
      res.json(impacts);
    } catch (error) {
      console.error("Error fetching user impacts:", error);
      res.status(500).json({ message: "Failed to fetch user impacts" });
    }
  });

  app.delete("/api/admin/user-impact/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const impactId = parseInt(req.params.id);
      const success = await storage.deleteUserImpact(impactId);
      
      if (!success) {
        return res.status(404).json({ message: "Impact not found" });
      }
      
      res.json({ message: "Impact deleted successfully" });
    } catch (error) {
      console.error("Error deleting user impact:", error);
      res.status(500).json({ message: "Failed to delete user impact" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
