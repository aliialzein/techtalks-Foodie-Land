import { NextRequest } from "next/server";
import { approveRestaurant } from "@/modules/restaurant/restaurant.controller";

export const dynamic = "force-dynamic";

type RestaurantApproveRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: NextRequest, ctx: RestaurantApproveRouteContext) {
  const { id } = await ctx.params;
  return approveRestaurant(req, id);
}
