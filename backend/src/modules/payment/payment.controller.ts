import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "@/util/errors";
import { authenticate } from "@/middleware/auth.middleware";
import { createIntentSchema } from "./payment.validation";
import { createPaymentIntent } from "./payment.service";

export async function createIntent(req: NextRequest | Request) {
  try {
    const user = authenticate(req);
    const body: unknown = await req.json();
    const { orderId } = createIntentSchema.parse(body);
    const data = await createPaymentIntent(orderId, user);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}