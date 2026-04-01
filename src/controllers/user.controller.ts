import { Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  updateRoleService,
  updateStatusService,
} from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getAllUsersService();

    res.json({
      success: true,
      data: users,
    });
  }
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await getUserByIdService(id);

    res.json({
      success: true,
      data: user,
    });
  }
);

export const updateRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await updateRoleService(id, req.body.role);

    res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  }
);

export const updateStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await updateStatusService(id, req.body.isActive);

    res.json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  }
);
