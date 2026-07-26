import { handleStripeWebhook } from "@/modules/payment/webhook.controller";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleStripeWebhook(req);
}