import { z } from "zod";

export const userIdSchema = z.string().uuid();

export const cartItemIdSchema = z.string().uuid();

export const addCartItemSchema = z
  .object({
    userId: z.string().uuid(),
    foodId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    userId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
  .strict();
