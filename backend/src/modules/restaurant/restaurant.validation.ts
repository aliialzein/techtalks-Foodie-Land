import { z } from "zod";

export const restaurantIdSchema = z.string().uuid();

export const updateRestaurantSchema = z
  .object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const createRestaurantSchema =
  z.object({
    ownerId: z.string().uuid(),
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();
