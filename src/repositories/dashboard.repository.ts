import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";

export const getTotalByType = (userId: string, type: "INCOME" | "EXPENSE") => {
  return prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { userId, type, isDeleted: false },
  });
};

export const getCategoryWise = (userId: string) => {
  return prisma.financialRecord.groupBy({
    by: ["category", "type"],
    _sum: { amount: true },
    where: { userId, isDeleted: false },
    orderBy: { category: "asc" },
  });
};

export const getMonthlyTrends = async (userId: string) => {
  // Use raw SQL for proper monthly grouping with DATE_TRUNC
  const result = await prisma.$queryRaw<
    Array<{ month: string; type: string; total: number }>
  >(
    Prisma.sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "date"), 'YYYY-MM') as month,
        "type"::text as type,
        COALESCE(SUM("amount"), 0)::float as total
      FROM "fin_dash"."FinancialRecord"
      WHERE "userId" = ${userId}
        AND "isDeleted" = false
      GROUP BY DATE_TRUNC('month', "date"), "type"
      ORDER BY month ASC
    `
  );

  return result;
};

export const getRecentActivity = (userId: string, limit: number = 10) => {
  return prisma.financialRecord.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};
