import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (payload: { id: string; role: string }) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET);
};
