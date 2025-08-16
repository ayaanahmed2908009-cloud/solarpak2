import { type Express, type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { workerStorage } from "./worker-storage";
import { workerLoginSchema, workerRegisterSchema } from "@shared/worker-schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Extend session types
declare module "express-session" {
  interface SessionData {
    workerId?: string;
    workerRole?: string;
  }
}

// Extend request type
declare global {
  namespace Express {
    interface Request {
      worker?: any;
    }
  }
}

export function setupWorkerAuth(app: Express) {
  const sessionTtl = 24 * 60 * 60 * 1000; // 24 hours
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "worker_sessions",
  });

  app.use(
    "/worker",
    session({
      secret: process.env.SESSION_SECRET || "worker-session-secret-key",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: sessionTtl,
      },
    })
  );
}

export const workerLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = workerLoginSchema.parse(req.body);
    const { username, password } = validatedData;

    console.log("Worker login attempt:", { username, hasPassword: !!password });

    const worker = await workerStorage.verifyWorkerPassword(username, password);
    if (!worker) {
      console.log("Worker login failed: Invalid credentials for", username);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log("Worker login successful:", { id: worker.id, username: worker.username, role: worker.role });

    // Update last login
    await workerStorage.updateWorkerLastLogin(worker.id);

    // Log the login activity
    await workerStorage.logWorkerActivity({
      workerId: worker.id,
      action: "login",
      details: "Worker logged in",
      ipAddress: req.ip,
    });

    // Create session
    req.session.workerId = worker.id;
    req.session.workerRole = worker.role;

    console.log("Session created:", { workerId: req.session.workerId, workerRole: req.session.workerRole });

    // Return worker info (without password)
    const { password: _, ...workerInfo } = worker;
    res.json({ 
      message: "Login successful", 
      worker: workerInfo 
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error("Worker login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const workerRegister = async (req: Request, res: Response) => {
  try {
    const validatedData = workerRegisterSchema.parse(req.body);
    const { confirmPassword, ...workerData } = validatedData;

    // Check if username or email already exists
    const existingWorkerByUsername = await workerStorage.getWorkerByUsername(workerData.username);
    if (existingWorkerByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingWorkerByEmail = await workerStorage.getWorkerByEmail(workerData.email);
    if (existingWorkerByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const worker = await workerStorage.createWorker(workerData);

    // Log the registration activity
    await workerStorage.logWorkerActivity({
      workerId: worker.id,
      action: "register",
      details: "Worker account created",
      ipAddress: req.ip,
    });

    // Return worker info (without password)
    const { password: _, ...workerInfo } = worker;
    res.status(201).json({ 
      message: "Registration successful", 
      worker: workerInfo 
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error("Worker registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const workerLogout = async (req: Request, res: Response) => {
  try {
    if (req.session.workerId) {
      // Log the logout activity
      await workerStorage.logWorkerActivity({
        workerId: req.session.workerId,
        action: "logout",
        details: "Worker logged out",
        ipAddress: req.ip,
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Worker logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentWorker = async (req: Request, res: Response) => {
  try {
    console.log("getCurrentWorker called, session data:", { 
      workerId: req.session.workerId, 
      workerRole: req.session.workerRole,
      sessionID: req.sessionID 
    });

    if (!req.session.workerId) {
      console.log("No workerId in session");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const worker = await workerStorage.getWorker(req.session.workerId);
    if (!worker || !worker.isActive) {
      console.log("Worker not found or inactive:", { workerId: req.session.workerId, found: !!worker, active: worker?.isActive });
      return res.status(401).json({ message: "Worker not found or inactive" });
    }

    console.log("Returning worker info:", { id: worker.id, username: worker.username, role: worker.role });

    // Return worker info (without password)
    const { password: _, ...workerInfo } = worker;
    res.json(workerInfo);
  } catch (error) {
    console.error("Get current worker error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isWorkerAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.workerId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const worker = await workerStorage.getWorker(req.session.workerId);
    if (!worker || !worker.isActive) {
      return res.status(401).json({ message: "Worker not found or inactive" });
    }

    req.worker = worker;
    next();
  } catch (error) {
    console.error("Worker authentication middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isWorkerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.worker || (req.worker.role !== "admin" && req.worker.role !== "manager")) {
    return res.status(403).json({ message: "Admin or manager access required" });
  }
  next();
};