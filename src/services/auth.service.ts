import { findUserByEmail, createUser } from "../repositories/auth.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { SignupInput } from "../validators/auth.validator";

// Strip sensitive fields from user object
const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const signupService = async (data: SignupInput) => {
  const existing = await findUserByEmail(data.email);

  if (existing) {
    throw AppError.conflict("User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return { user: sanitizeUser(user), token };
};

export const loginService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw AppError.forbidden(
      "Your account has been deactivated. Contact an administrator."
    );
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return { user: sanitizeUser(user), token };
};
