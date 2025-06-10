import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { InsertUser } from "@shared/schema";

// Setup passport local strategy
export const setupAuth = (app: any) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Set up local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Get user by email
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Check if user has a password (local auth)
          if (!user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Check password
          const isPasswordValid = await verifyPassword(
            password,
            user.password
          );
          
          if (!isPasswordValid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Password utility functions
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};

// Login handler
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message || "Authentication failed" });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Exclude sensitive information
      const { password, ...userInfo } = user;
      
      return res.status(200).json({ message: "Login successful", user: userInfo });
    });
  })(req, res, next);
};

// Logout handler
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    
    res.status(200).json({ message: "Logout successful" });
  });
};

// Get current user
export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(200).json(null);
  }
  
  // Exclude sensitive information
  const { password, ...userInfo } = req.user as any;
  
  return res.status(200).json(userInfo);
};

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user (storage layer handles email uniqueness validation)
    const userData: InsertUser = {
      email,
      password: hashedPassword,
      fullName: fullName || null,
      provider: "local",
    };
    
    const newUser = await storage.createUser(userData);
    
    // Log in the new user
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      
      // Exclude sensitive information
      const { password, ...userInfo } = newUser;
      
      return res.status(201).json({
        message: "Registration successful",
        user: userInfo,
      });
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle specific error messages
    if (error.message === 'Email already in use') {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (error.message === 'Username already in use') {
      return res.status(400).json({ message: "Username already in use" });
    }
    
    return res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};