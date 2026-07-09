import {
  deleteFood,
  getFood,
  updateFood,
} from "@/modules/food/food.controller";

export const dynamic = "force-dynamic";

type FoodRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, ctx: FoodRouteContext) {
  const { id } = await ctx.params;
  return getFood(id);
}

export async function PATCH(req: Request, ctx: FoodRouteContext) {
  const { id } = await ctx.params;
  return updateFood(req, id);
}

export async function DELETE(req: Request, ctx: FoodRouteContext) {
  const { id } = await ctx.params;
  const ownerId = new URL(req.url).searchParams.get("ownerId");
  return deleteFood(id, ownerId);
}
