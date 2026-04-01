import { Request, Response } from "express";
import {
  getSummaryService,
  getCategoryWiseService,
  getMonthlyTrendsService,
  getRecentActivityService,
} from "../services/dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getSummaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await getSummaryService(userId);

    res.json({
      success: true,
      data,
    });
  }
);

export const getCategoryWiseController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await getCategoryWiseService(userId);

    res.json({
      success: true,
      data,
    });
  }
);

export const getMonthlyTrendsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await getMonthlyTrendsService(userId);

    res.json({
      success: true,
      data,
    });
  }
);

export const getRecentActivityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = await getRecentActivityService(userId);

    res.json({
      success: true,
      data,
    });
  }
);
