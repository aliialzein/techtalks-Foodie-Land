import { prisma } from "@/config";
import type { Prisma } from "@/generated/prisma";

const foodInclude = {
  restaurant: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.FoodInclude;

export class FoodRepository {
  static getAll(restaurantId?: string) {
    return prisma.food.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      include: foodInclude,
      orderBy: { name: "asc" },
    });
  }

  static getById(id: string) {
    return prisma.food.findUnique({
      where: { id },
      include: foodInclude,
    });
  }
}
