import { prisma } from "../prisma/client";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = (data: any) => {
  return prisma.user.create({ data });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};
