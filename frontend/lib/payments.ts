import { apiRequest } from "./api";

export async function createPaymentIntent(orderId: string) {
  return apiRequest<{ clientSecret: string }>("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}