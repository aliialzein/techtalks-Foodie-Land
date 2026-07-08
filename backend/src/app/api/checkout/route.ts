import { placeOrder } from "@/modules/checkout/checkout.controller";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return placeOrder(req);
}
