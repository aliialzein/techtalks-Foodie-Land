import { prisma } from "@/config";
import type { OrderStatus, Prisma } from "@/generated/prisma";

const orderDetailsInclude = {
  items: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  restaurant: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.OrderInclude;

export type OrderItemCreateData = {
  foodId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
};

export class OrderRepository {
  static getAll() {
    return prisma.order.findMany({
      include: orderDetailsInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  static getById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: orderDetailsInclude,
    });
  }

  static userExists(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  static restaurantExists(restaurantId: string) {
    return prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true },
    });
  }

  static findFoodsByIds(foodIds: string[]) {
    return prisma.food.findMany({
      where: { id: { in: foodIds } },
    });
  }

  static create(data: {
    userId: string;
    restaurantId: string;
    totalPrice: number;
    items: OrderItemCreateData[];
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        restaurantId: data.restaurantId,
        totalPrice: data.totalPrice,
        items: {
          create: data.items,
        },
      },
      include: orderDetailsInclude,
    });
  }

  static updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: orderDetailsInclude,
    });
  }

  static delete(id: string) {
    return prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } }),
    ]);
  }
}
