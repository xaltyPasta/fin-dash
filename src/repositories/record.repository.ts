import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";

export const createRecord = (data: any) => {
  return prisma.financialRecord.create({ data });
};

export const getRecords = (options: Prisma.FinancialRecordFindManyArgs) => {
  return prisma.financialRecord.findMany(options);
};

export const countRecords = (where: Prisma.FinancialRecordWhereInput) => {
  return prisma.financialRecord.count({ where });
};

export const getRecordById = (id: string) => {
  return prisma.financialRecord.findUnique({ where: { id } });
};

export const updateRecord = (id: string, data: any) => {
  return prisma.financialRecord.update({
    where: { id },
    data,
  });
};

export const softDeleteRecord = (id: string) => {
  return prisma.financialRecord.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
