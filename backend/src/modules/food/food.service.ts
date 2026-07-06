import { NotFoundError } from "../../util/errors";
import { FoodRepository } from "./food.repository";
import type { FoodWithRestaurant } from "./food.types";

export class FoodService {
  static getAll(restaurantId?: string): Promise<FoodWithRestaurant[]> {
    return FoodRepository.getAll(restaurantId);
  }

  static async getById(id: string): Promise<FoodWithRestaurant> {
    const food = await FoodRepository.getById(id);

    if (!food) {
      throw new NotFoundError("Food", id);
    }

    return food;
  }
}
