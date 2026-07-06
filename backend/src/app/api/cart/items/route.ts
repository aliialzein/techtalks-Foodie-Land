import { addCartItem } from "@/modules/cart/cart.controller";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return addCartItem(req);
}
