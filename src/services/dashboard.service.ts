import * as dashboardRepository from "../repositories/dashboard.repository";

export const getSummaryService = async (userId: string) => {
  const [income, expense] = await Promise.all([
    dashboardRepository.getTotalByType(userId, "INCOME"),
    dashboardRepository.getTotalByType(userId, "EXPENSE"),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpense = expense._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

export const getCategoryWiseService = async (userId: string) => {
  return dashboardRepository.getCategoryWise(userId);
};

export const getMonthlyTrendsService = async (userId: string) => {
  return dashboardRepository.getMonthlyTrends(userId);
};

export const getRecentActivityService = async (userId: string) => {
  return dashboardRepository.getRecentActivity(userId);
};
