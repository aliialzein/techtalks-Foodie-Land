import { handleError, jsonResponse } from "../../util/errors";
import { FoodService } from "./food.service";
import { foodIdSchema, restaurantIdSchema } from "./food.validation";

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
