import * as userRepository from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { Role } from "@prisma/client";

export const getAllUsersService = async () => {
  return userRepository.getAllUsers();
};

export const getUserByIdService = async (id: string) => {
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  return user;
};

export const updateRoleService = async (id: string, role: Role) => {
  // Check user exists
  await getUserByIdService(id);

  return userRepository.updateUserRole(id, role);
};

export const updateStatusService = async (id: string, isActive: boolean) => {
  // Check user exists
  await getUserByIdService(id);

  return userRepository.updateUserStatus(id, isActive);
};
