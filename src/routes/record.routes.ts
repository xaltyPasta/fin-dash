import express from "express";
import {
  createRecordController,
  getRecordsController,
  getRecordByIdController,
  updateRecordController,
  deleteRecordController,
} from "../controllers/record.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createRecordSchema, updateRecordSchema } from "../validators/record.validator";
import { Role } from "@prisma/client";

const router = express.Router();

// All record routes require authentication
router.use(authMiddleware);

// Create record — Admin only
router.post(
  "/",
  authorize([Role.ADMIN]),
  validate(createRecordSchema),
  createRecordController
);

// Get all records with filters/pagination — Admin, Analyst
router.get(
  "/",
  authorize([Role.ADMIN, Role.ANALYST]),
  getRecordsController
);

// Get single record — Admin, Analyst
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.ANALYST]),
  getRecordByIdController
);

// Update record — Admin only
router.put(
  "/:id",
  authorize([Role.ADMIN]),
  validate(updateRecordSchema),
  updateRecordController
);

// Delete record (soft delete) — Admin only
router.delete(
  "/:id",
  authorize([Role.ADMIN]),
  deleteRecordController
);

export default router;