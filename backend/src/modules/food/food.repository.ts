import { prisma } from "@/config";
import type { Prisma } from "@/generated/prisma";
import type { CreateFoodInput, UpdateFoodInput } from "./food.types";

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

  // Minimal ownership lookups used to authorize writes.
  static restaurantById(restaurantId: string) {
    return prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, ownerId: true },
    });
  }

  static getWithOwner(id: string) {
    return prisma.food.findUnique({
      where: { id },
      include: { restaurant: { select: { id: true, ownerId: true } } },
    });
  }

  static create(data: CreateFoodInput) {
    return prisma.food.create({ data, include: foodInclude });
  }

  static update(id: string, data: UpdateFoodInput) {
    return prisma.food.update({ where: { id }, data, include: foodInclude });
  }

  static deleteById(id: string) {
    return prisma.food.delete({ where: { id } });
  }

  static orderItemCount(foodId: string) {
    return prisma.orderItem.count({ where: { foodId } });
  }

  static deleteCartItemsForFood(foodId: string) {
    return prisma.cartItem.deleteMany({ where: { foodId } });
  }
}
