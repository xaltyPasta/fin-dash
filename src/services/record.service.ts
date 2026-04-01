import * as recordRepository from "../repositories/record.repository";
import { CreateRecordInput, UpdateRecordInput } from "../validators/record.validator";
import { AppError } from "../utils/AppError";
import { Prisma } from "@prisma/client";

export const createRecordService = async (
  data: CreateRecordInput,
  userId: string
) => {
  return recordRepository.createRecord({
    ...data,
    date: new Date(data.date),
    userId,
  });
};

export const getRecordsService = async (query: any, userId: string) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  const where: Prisma.FinancialRecordWhereInput = {
    userId,
    isDeleted: false,
  };

  // Filter by type
  if (query.type && ["INCOME", "EXPENSE"].includes(query.type)) {
    where.type = query.type;
  }

  // Filter by category
  if (query.category) {
    where.category = query.category;
  }

  // Filter by date range
  if (query.startDate || query.endDate) {
    where.date = {};
    if (query.startDate) {
      const start = new Date(query.startDate);
      if (!isNaN(start.getTime())) {
        where.date.gte = start;
      }
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      if (!isNaN(end.getTime())) {
        where.date.lte = end;
      }
    }
  }

  // Search in notes (case-insensitive)
  if (query.search) {
    where.notes = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  const [records, total] = await Promise.all([
    recordRepository.getRecords({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: "desc" },
    }),
    recordRepository.countRecords(where),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordByIdService = async (id: string, userId: string) => {
  const record = await recordRepository.getRecordById(id);

  if (!record || record.isDeleted) {
    throw AppError.notFound("Record not found");
  }

  if (record.userId !== userId) {
    throw AppError.forbidden("You do not have access to this record");
  }

  return record;
};

export const updateRecordService = async (
  id: string,
  data: UpdateRecordInput,
  userId: string
) => {
  // Verify record exists and belongs to user
  await getRecordByIdService(id, userId);

  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = new Date(data.date);
  }

  return recordRepository.updateRecord(id, updateData);
};

export const deleteRecordService = async (id: string, userId: string) => {
  // Verify record exists and belongs to user
  await getRecordByIdService(id, userId);

  return recordRepository.softDeleteRecord(id);
};