import { clearCart, getCart } from "@/modules/cart/cart.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  return getCart(userId);
}

export async function DELETE(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  return clearCart(userId);
}
