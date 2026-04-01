import express from "express";
import {
  getSummaryController,
  getCategoryWiseController,
  getMonthlyTrendsController,
  getRecentActivityController,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Summary — all roles can view dashboard data
router.get(
  "/summary",
  authorize([Role.ADMIN, Role.ANALYST, Role.VIEWER]),
  getSummaryController
);

// Category-wise breakdown — Admin, Analyst
router.get(
  "/category-wise",
  authorize([Role.ADMIN, Role.ANALYST]),
  getCategoryWiseController
);

// Monthly trends — Admin, Analyst
router.get(
  "/monthly-trends",
  authorize([Role.ADMIN, Role.ANALYST]),
  getMonthlyTrendsController
);

// Recent activity — all roles can view
router.get(
  "/recent-activity",
  authorize([Role.ADMIN, Role.ANALYST, Role.VIEWER]),
  getRecentActivityController
);

export default router;
