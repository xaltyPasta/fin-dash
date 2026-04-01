import { Request, Response } from "express";
import {
  createRecordService,
  getRecordsService,
  getRecordByIdService,
  updateRecordService,
  deleteRecordService,
} from "../services/record.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const record = await createRecordService(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: record,
    });
  }
);

export const getRecordsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await getRecordsService(req.query, userId);

    res.json({
      success: true,
      data: result.records,
      pagination: result.pagination,
    });
  }
);

export const getRecordByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const record = await getRecordByIdService(id, userId);

    res.json({
      success: true,
      data: record,
    });
  }
);

export const updateRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const record = await updateRecordService(id, req.body, userId);

    res.json({
      success: true,
      message: "Record updated successfully",
      data: record,
    });
  }
);

export const deleteRecordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await deleteRecordService(id, userId);

    res.json({
      success: true,
      message: "Record deleted successfully",
    });
  }
);