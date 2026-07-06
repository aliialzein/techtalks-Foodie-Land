import {
  removeCartItem,
  updateCartItem,
} from "@/modules/cart/cart.controller";

export const dynamic = "force-dynamic";

type CartItemRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, ctx: CartItemRouteContext) {
  const { id } = await ctx.params;
  return updateCartItem(req, id);
}

export async function DELETE(req: Request, ctx: CartItemRouteContext) {
  const { id } = await ctx.params;
  const userId = new URL(req.url).searchParams.get("userId");
  return removeCartItem(id, userId);
}
