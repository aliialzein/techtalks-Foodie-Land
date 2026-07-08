import type { Prisma } from "@/generated/prisma";

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        food: {
          select: {
            id: true;
            name: true;
            price: true;
            imageUrl: true;
            restaurantId: true;
          };
        };
      };
    };
  };
}>;
