import { deleteRestaurant, getRestaurant, updateRestaurant} from "@/modules/restaurant/restaurant.controller";

type RestaurantRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, ctx: RestaurantRouteContext) {
  const { id } = await ctx.params;
  return getRestaurant(id);
}

export async function PATCH(req: Request, ctx: RestaurantRouteContext) {
  const { id } = await ctx.params;
  return updateRestaurant(req, id);
}

export async function DELETE(_req: Request, ctx: RestaurantRouteContext) {
  const { id } = await ctx.params;
  return deleteRestaurant(id);
}
