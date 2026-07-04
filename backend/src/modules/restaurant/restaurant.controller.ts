import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { RestaurantService } from "./restaurant.service";
import {
  createRestaurantSchema,
  restaurantIdSchema,
  updateRestaurantSchema,
} from "./restaurant.validation";

export async function getRestaurants() {
  try {
    const data = await RestaurantService.getAll();
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    const data = await RestaurantService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function createRestaurant(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const payload = createRestaurantSchema.parse(body);
    const data = await RestaurantService.create(payload);
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateRestaurant(req: NextRequest | Request, id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    const body: unknown = await req.json();
    const payload = updateRestaurantSchema.parse(body);
    const data = await RestaurantService.update(parsedId, payload);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    await RestaurantService.delete(parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
