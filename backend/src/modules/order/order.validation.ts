import { z } from "zod";

export const orderIdSchema = z.string().uuid();

export const userIdSchema = z.string().uuid();

export const restaurantIdSchema = z.string().uuid();

export const orderStatusSchema = z.enum([
  "PENDING",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
]);

export const createOrderItemSchema = z
  .object({
    foodId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
  .strict();

export const createOrderSchema = z
  .object({
    userId: z.string().uuid(),
    restaurantId: z.string().uuid(),
    items: z.array(createOrderItemSchema).min(1),
  })
  .strict();

export const updateOrderStatusSchema = z
  .object({
    status: orderStatusSchema,
  })
  .strict();
