import { Request, Response } from "express";
import { signupService, loginService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await signupService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await loginService(req.body.email, req.body.password);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
);
