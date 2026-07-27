import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const verifyOtpSchema = z.object({
  email: z.email(),

  otp: z
    .string()
    .length(6)
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),

  password: z
    .string()
    .min(8)
    .max(64),
});

