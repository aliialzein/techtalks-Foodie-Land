import { z } from "zod";

export const categoryIdSchema = z.string().uuid();

export const createCategorySchema = z
  .object({
    restaurantId: z.string().uuid(),
    name: z.string().min(2).max(100),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
  })
  .strict();