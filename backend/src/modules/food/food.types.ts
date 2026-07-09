import type { Prisma } from "@/generated/prisma";

export type FoodWithRestaurant = Prisma.FoodGetPayload<{
  include: {
    restaurant: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type CreateFoodInput = {
  restaurantId: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
};

export type UpdateFoodInput = {
  name?: string;
  price?: number;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
};
