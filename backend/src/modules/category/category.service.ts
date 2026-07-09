import type { FoodCategory } from "@/generated/prisma";

import logger from "@/util/logger";
import { NotFoundError } from "@/util/errors";

import { CategoryRepository } from "./category.repository";

import type {
  CategoryWithRestaurant,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export class CategoryService {
  static getAll(): Promise<CategoryWithRestaurant[]> {
    logger.info("Service: retrieving all categories");

    return CategoryRepository.getAll();
  }

  static async getById(id: string): Promise<FoodCategory> {
    logger.info("Service: retrieving category %s", id);

    const category = await CategoryRepository.getById(id);

    if (!category) {
      logger.warn("Category %s not found", id);
      throw new NotFoundError("Category", id);
    }

    return category;
  }

  static async create(
    payload: CreateCategoryInput,
  ): Promise<FoodCategory> {
    logger.info(
      "Service: creating category '%s'",
      payload.name,
    );

    const restaurant = await CategoryRepository.restaurantExists(
      payload.restaurantId,
    );

    if (!restaurant) {
      logger.warn(
        "Restaurant %s not found while creating category",
        payload.restaurantId,
      );

      throw new NotFoundError(
        "Restaurant",
        payload.restaurantId,
      );
    }

    return CategoryRepository.create(payload);
  }

  static async update(
    id: string,
    payload: UpdateCategoryInput,
  ): Promise<FoodCategory> {
    logger.info("Service: updating category %s", id);

    await this.getById(id);

    return CategoryRepository.update(id, payload);
  }

  static async delete(id: string): Promise<FoodCategory> {
    logger.info("Service: deleting category %s", id);

    await this.getById(id);

    return CategoryRepository.delete(id);
  }
}