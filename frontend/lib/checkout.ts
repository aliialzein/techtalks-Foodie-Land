import { apiRequest } from "./api";
import type { Order } from "./orders";

// Turns the signed-in user's cart into an order. The server recomputes pricing
// and clears the cart; we just receive the created order back.
export function placeOrder(userId: string): Promise<Order> {
  return apiRequest<Order>("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
