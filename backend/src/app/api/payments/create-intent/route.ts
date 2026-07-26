import { createIntent } from "@/modules/payment/payment.controller";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return createIntent(req);
}