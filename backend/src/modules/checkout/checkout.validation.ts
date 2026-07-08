import { z } from "zod";

export const checkoutSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .strict();
