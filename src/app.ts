import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/record.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";

const app = express();

// ── Global Middlewares ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// ── Health Check ────────────────────────────────────────────────
app.get(["/", "/health"], (req, res) => {
  res.json({
    success: true,
    message: "Finance Dashboard API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler (must be last) ─────────────────────────
app.use(errorHandler);

export default app;
