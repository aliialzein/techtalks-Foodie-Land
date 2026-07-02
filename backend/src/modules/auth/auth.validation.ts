import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email("Enter a valid email"),
  password: z.string(),
  role: z.enum(["CUSTOMER", "OWNER", "ADMIN"]).optional().default("CUSTOMER"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string(),
});