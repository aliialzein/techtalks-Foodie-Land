import { createOrder, getOrders } from "@/modules/order/order.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getOrders();
}

export async function POST(req: Request) {
  return createOrder(req);
}
