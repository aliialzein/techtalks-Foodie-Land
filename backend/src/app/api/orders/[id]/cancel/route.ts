import { cancelOrder } from "@/modules/order/order.controller";

export const dynamic = "force-dynamic";

type OrderCancelRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_req: Request, ctx: OrderCancelRouteContext) {
  const { id } = await ctx.params;
  return cancelOrder(id);
}
