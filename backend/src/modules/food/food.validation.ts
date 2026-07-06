import { z } from "zod";

export const foodIdSchema = z.string().uuid();

export const restaurantIdSchema = z.string().uuid();
