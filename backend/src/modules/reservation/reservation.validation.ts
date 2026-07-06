import { z } from "zod";

export const reservationIdSchema = z.string().uuid();

export const createReservationSchema = z
  .object({
    userId: z.string().uuid(),
    restaurantId: z.string().uuid(),
    dateTime: z.coerce.date(),
    peopleCount: z.number().int().min(1).max(20),
  })
  .strict();

export const updateReservationSchema = z
  .object({
    dateTime: z.coerce.date().optional(),
    peopleCount: z.number().int().min(1).max(20).optional(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  })
  .strict();