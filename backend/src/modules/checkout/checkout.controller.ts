import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { CheckoutService } from "./checkout.service";
import { checkoutSchema } from "./checkout.validation";

export async function placeOrder(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const { userId } = checkoutSchema.parse(body);
    const order = await CheckoutService.placeOrder(userId);
    return jsonResponse(order, 201);
  } catch (error) {
    return handleError(error);
  }
}
