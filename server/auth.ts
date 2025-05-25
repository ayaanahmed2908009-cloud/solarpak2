import { Request, Response, NextFunction } from "express";
import { compare, hash } from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await compare(plainPassword, hashedPassword);
}

// Configure passport local strategy
const configurePassport = () => {
  // Local strategy for username/password login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: "Incorrect email or password" });
          }
          
          // For users registered with OAuth, they won't have a password
          if (!user.password) {
            return done(null, false, { 
              message: `This account uses ${user.provider} authentication. Please sign in with ${user.provider}.` 
            });
          }
          
          const isValid = await verifyPassword(password, user.password);
          
          if (!isValid) {
            return done(null, false, { message: "Incorrect email or password" });
          }
          
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  
  // User serialization/deserialization for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

// Session and auth setup
export const setupAuth = (app: any) => {
  const PgSession = connectPgSimple(session);
  
  // Set up session middleware
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "solar-panel-project-dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport strategies
  configurePassport();
};

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: "Unauthorized" });
};

// Auth controller methods
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Don't send sensitive information to the client
      const safeUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        provider: user.provider,
      };
      
      return res.json({ user: safeUser });
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.json(null);
  }
  
  const user = req.user as any;
  
  // Don't send sensitive information to the client
  const safeUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    provider: user.provider,
  };
  
  res.json(safeUser);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName, username } = req.body;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      fullName,
      username,
      provider: "local",
    });
    
    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Don't send sensitive information to the client
      const safeUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        provider: user.provider,
      };
      
      res.status(201).json({ user: safeUser });
    });
  } catch (err) {
    next(err);
  }
};