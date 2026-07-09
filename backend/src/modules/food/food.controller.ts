import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { FoodService } from "./food.service";
import {
  createFoodSchema,
  foodIdSchema,
  ownerIdSchema,
  restaurantIdSchema,
  updateFoodSchema,
} from "./food.validation";

export async function getFoods(restaurantId?: string) {
  try {
    const filterRestaurantId = restaurantId
      ? restaurantIdSchema.parse(restaurantId)
      : undefined;
    const data = await FoodService.getAll(filterRestaurantId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getFood(id: string) {
  try {
    const parsedId = foodIdSchema.parse(id);
    const data = await FoodService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function createFood(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const { ownerId, ...input } = createFoodSchema.parse(body);
    const data = await FoodService.create(ownerId, input);
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateFood(req: NextRequest | Request, id: string) {
  try {
    const parsedId = foodIdSchema.parse(id);
    const body: unknown = await req.json();
    const { ownerId, ...updates } = updateFoodSchema.parse(body);
    const data = await FoodService.update(ownerId, parsedId, updates);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteFood(id: string, ownerId: string | null) {
  try {
    const parsedId = foodIdSchema.parse(id);
    const parsedOwnerId = ownerIdSchema.parse(ownerId);
    await FoodService.delete(parsedOwnerId, parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
