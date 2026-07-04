import type { Prisma } from "@/generated/prisma";

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: true;
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    restaurant: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type CreateOrderItemInput = {
  foodId: string;
  quantity: number;
};

export type CreateOrderInput = {
  userId: string;
  restaurantId: string;
  items: CreateOrderItemInput[];
};

export type OrderItemForTotal = {
  priceSnapshot: number;
  quantity: number;
};
