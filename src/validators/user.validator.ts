import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"], {
    error: "Role must be one of: VIEWER, ANALYST, ADMIN",
  }),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({
    error: "isActive must be a boolean",
  }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
