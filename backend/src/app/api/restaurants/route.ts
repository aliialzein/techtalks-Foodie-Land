import { createRestaurant, getRestaurants } from "@/modules/restaurant/restaurant.controller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ownerId = new URL(req.url).searchParams.get("ownerId");
  return getRestaurants(ownerId ?? undefined);
}

export async function POST(req: Request) {
  return createRestaurant(req);
}
