import { createRestaurant, getRestaurants } from "@/modules/restaurant/restaurant.controller";

export async function GET() {
  return getRestaurants();
}

export async function POST(req: Request) {
  return createRestaurant(req);
}
