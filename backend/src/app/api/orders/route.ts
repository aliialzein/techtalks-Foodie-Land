import { createOrder, getOrders } from "@/modules/order/order.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  return getOrders(userId ?? undefined);
}

export async function POST(req: Request) {
  return createOrder(req);
}
