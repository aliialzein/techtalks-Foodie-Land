import { NextRequest } from "next/server";
import { getPendingRestaurants } from "@/modules/restaurant/restaurant.controller";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return getPendingRestaurants(req);
}
