import { NextRequest } from "next/server";
import { rejectRestaurant } from "@/modules/restaurant/restaurant.controller";

export const dynamic = "force-dynamic";

type RestaurantRejectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: NextRequest, ctx: RestaurantRejectRouteContext) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  return rejectRestaurant(req, id, body);
}
