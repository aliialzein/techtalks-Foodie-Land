import type { FoodCategory, Prisma } from "@/generated/prisma";

export type CategoryWithRestaurant = Prisma.FoodCategoryGetPayload<{
  include: {
    restaurant: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type UpdateCategoryInput = Partial<
  Pick<FoodCategory, "name">
>;

export type CreateCategoryInput = {
  restaurantId: string;
  name: string;
};