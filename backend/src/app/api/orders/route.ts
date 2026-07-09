import { createOrder, getOrders } from "@/modules/order/order.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  return getOrders(
    params.get("userId") ?? undefined,
    params.get("restaurantId") ?? undefined,
  );
}

export async function POST(req: Request) {
  return createOrder(req);
}
