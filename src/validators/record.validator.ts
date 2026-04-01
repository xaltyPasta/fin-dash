import { z } from "zod";

export const createRecordSchema = z.object({
  amount: z.number({ error: "Amount is required and must be a number" }).positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"], {
    error: "Type must be INCOME or EXPENSE",
  }),
  category: z.string({ error: "Category is required" }).min(1, "Category cannot be empty"),
  date: z
    .string({ error: "Date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO date string",
    }),
  notes: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().min(1, "Category cannot be empty").optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO date string",
    })
    .optional(),
  notes: z.string().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
