import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  updateRoleController,
  updateStatusController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateRoleSchema, updateStatusSchema } from "../validators/user.validator";
import { Role } from "@prisma/client";

const router = express.Router();

// All user management routes require Admin role
router.use(authMiddleware, authorize([Role.ADMIN]));

// List all users
router.get("/", getAllUsersController);

// Get user by ID
router.get("/:id", getUserByIdController);

// Update user role
router.patch("/:id/role", validate(updateRoleSchema), updateRoleController);

// Update user status (activate/deactivate)
router.patch("/:id/status", validate(updateStatusSchema), updateStatusController);

export default router;
