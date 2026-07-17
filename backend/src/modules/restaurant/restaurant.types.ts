import { RestaurantStatus } from "@/generated/prisma";
import type { Prisma, Restaurant } from "@/generated/prisma";

export type RestaurantWithOwner = Prisma.RestaurantGetPayload<{
  include: {
    owner: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type UpdateRestaurantInput = Partial<
  Pick<Restaurant, "name" | "description">
>;

export type CreateRestaurantInput = {
  ownerId: string;
  name: string;
  description?: string;
};

export type RestaurantCreateData = CreateRestaurantInput & {
  status: RestaurantStatus;
  rejectionReason: string | null;
};

export type RejectRestaurantInput = {
  rejectionReason?: string | null;
};