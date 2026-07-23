import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { initializeDatabase } from "../server/initializeDatabase";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const PgStore = connectPg(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "solar-impact-secret",
    resave: false,
    saveUninitialized: false,
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "sessions",
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  })
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

let initialized = false;

const init = async () => {
  if (!initialized) {
    await initializeDatabase();
    await registerRoutes(app);
    initialized = true;
  }
};

export default async function handler(req: any, res: any) {
  await init();
  (app as any)(req, res);
}
