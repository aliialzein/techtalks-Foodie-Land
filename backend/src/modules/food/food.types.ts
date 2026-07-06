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
