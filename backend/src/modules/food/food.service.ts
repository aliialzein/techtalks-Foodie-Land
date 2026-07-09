import { ConflictError, ForbiddenError, NotFoundError } from "../../util/errors";
import { FoodRepository } from "./food.repository";
import type {
  CreateFoodInput,
  FoodWithRestaurant,
  UpdateFoodInput,
} from "./food.types";

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

  static async create(
    ownerId: string,
    input: CreateFoodInput,
  ): Promise<FoodWithRestaurant> {
    const restaurant = await FoodRepository.restaurantById(input.restaurantId);

    if (!restaurant) {
      throw new NotFoundError("Restaurant", input.restaurantId);
    }

    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenError("You do not own this restaurant");
    }

    return FoodRepository.create(input);
  }

  static async update(
    ownerId: string,
    foodId: string,
    updates: UpdateFoodInput,
  ): Promise<FoodWithRestaurant> {
    await FoodService.assertOwnership(ownerId, foodId);
    return FoodRepository.update(foodId, updates);
  }

  static async delete(ownerId: string, foodId: string): Promise<void> {
    await FoodService.assertOwnership(ownerId, foodId);

    // A dish that appears on past orders must stay for order history — owners
    // should mark it unavailable rather than delete it.
    const orderCount = await FoodRepository.orderItemCount(foodId);
    if (orderCount > 0) {
      throw new ConflictError(
        "This dish has past orders and can't be deleted — mark it unavailable instead",
      );
    }

    await FoodRepository.deleteCartItemsForFood(foodId);
    await FoodRepository.deleteById(foodId);
  }

  private static async assertOwnership(ownerId: string, foodId: string) {
    const food = await FoodRepository.getWithOwner(foodId);

    if (!food) {
      throw new NotFoundError("Food", foodId);
    }

    if (food.restaurant.ownerId !== ownerId) {
      throw new ForbiddenError("You do not own this dish");
    }
  }
}
