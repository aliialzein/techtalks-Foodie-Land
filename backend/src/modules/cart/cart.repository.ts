import { prisma } from "@/config";
import type { Prisma } from "@/generated/prisma";

const cartInclude = {
  items: {
    include: {
      food: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.CartInclude;

export type CartItemCreateData = {
  cartId: string;
  foodId: string;
  quantity: number;
  unitPriceSnapshot: number;
};

export class CartRepository {
  static userExists(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  static getFood(foodId: string) {
    return prisma.food.findUnique({ where: { id: foodId } });
  }

  static getByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  static createCart(userId: string) {
    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  static createItem(data: CartItemCreateData) {
    return prisma.cartItem.create({ data });
  }

  static updateItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  static deleteItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  static clearItems(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
