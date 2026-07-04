import {
  deleteOrder,
  getOrder,
  updateOrderStatus,
} from "@/modules/order/order.controller";

export const dynamic = "force-dynamic";

type OrderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, ctx: OrderRouteContext) {
  const { id } = await ctx.params;
  return getOrder(id);
}

export async function PATCH(req: Request, ctx: OrderRouteContext) {
  const { id } = await ctx.params;
  return updateOrderStatus(req, id);
}

export async function DELETE(_req: Request, ctx: OrderRouteContext) {
  const { id } = await ctx.params;
  return deleteOrder(id);
}
