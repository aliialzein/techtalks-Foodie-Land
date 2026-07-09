import { prisma } from "@/config";
import logger from "@/util/logger";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export class CategoryRepository {
  static getAll() {
    logger.info("Repository: fetching all categories");

    return prisma.foodCategory.findMany({
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static getById(id: string) {
    logger.info("Repository: fetching category %s", id);

    return prisma.foodCategory.findUnique({
      where: {
        id,
      },
    });
  }

  static restaurantExists(restaurantId: string) {
    logger.info(
      "Repository: checking restaurant %s exists",
      restaurantId,
    );

    return prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      select: {
        id: true,
      },
    });
  }

  static create(data: CreateCategoryInput) {
    logger.info(
      "Repository: creating category '%s'",
      data.name,
    );

    return prisma.foodCategory.create({
      data,
    });
  }

  static update(
    id: string,
    data: UpdateCategoryInput,
  ) {
    logger.info("Repository: updating category %s", id);

    return prisma.foodCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  static delete(id: string) {
    logger.info("Repository: deleting category %s", id);

    return prisma.foodCategory.delete({
      where: {
        id,
      },
    });
  }
}