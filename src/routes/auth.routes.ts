import express from "express";
import { signupController, loginController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "../validators/auth.validator";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);

export default router;
