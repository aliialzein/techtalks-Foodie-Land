import { getFood } from "@/modules/food/food.controller";

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
