import type { Prisma, Restaurant } from "@prisma/client";

export type RestaurantWithOwner = Prisma.RestaurantGetPayload<{
  include: {
    owner: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type UpdateRestaurantInput = Partial<
  Pick<Restaurant, "name" | "description" | "isActive">
>;

export type CreateRestaurantInput = {
  ownerId: string;
  name: string;
  description?: string;
  isActive?: boolean;
};