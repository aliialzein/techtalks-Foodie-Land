import { z } from "zod";

export const foodIdSchema = z.string().uuid();

export const restaurantIdSchema = z.string().uuid();

export const ownerIdSchema = z.string().uuid();

export const createFoodSchema = z
  .object({
    ownerId: z.string().uuid(),
    restaurantId: z.string().uuid(),
    name: z.string().min(2).max(100),
    price: z.number().positive(),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().optional(),
  })
  .strict();

export const updateFoodSchema = z
  .object({
    ownerId: z.string().uuid(),
    name: z.string().min(2).max(100).optional(),
    price: z.number().positive().optional(),
    description: z.string().max(500).nullable().optional(),
    imageUrl: z.string().url().nullable().optional(),
    isAvailable: z.boolean().optional(),
  })
  .strict();
