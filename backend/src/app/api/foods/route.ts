import { createFood, getFoods } from "@/modules/food/food.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const restaurantId = new URL(req.url).searchParams.get("restaurantId");
  return getFoods(restaurantId ?? undefined);
}

export async function POST(req: Request) {
  return createFood(req);
}
