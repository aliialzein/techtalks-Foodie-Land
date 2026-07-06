import { NotFoundError } from "../../util/errors";
import { CartRepository } from "./cart.repository";
import type { CartWithItems } from "./cart.types";

export class CartService {
  private static async ensureCart(userId: string): Promise<CartWithItems> {
    const existing = await CartRepository.getByUserId(userId);
    if (existing) {
      return existing;
    }
    return CartRepository.createCart(userId);
  }

  static async getCart(userId: string): Promise<CartWithItems> {
    const user = await CartRepository.userExists(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }
    return CartService.ensureCart(userId);
  }

  static async addItem(
    userId: string,
    foodId: string,
    quantity: number,
  ): Promise<CartWithItems> {
    const user = await CartRepository.userExists(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }

    const food = await CartRepository.getFood(foodId);
    if (!food) {
      throw new NotFoundError("Food", foodId);
    }

    const cart = await CartService.ensureCart(userId);
    const existingItem = cart.items.find((item) => item.foodId === foodId);

    if (existingItem) {
      await CartRepository.updateItemQuantity(
        existingItem.id,
        existingItem.quantity + quantity,
      );
    } else {
      await CartRepository.createItem({
        cartId: cart.id,
        foodId,
        quantity,
        unitPriceSnapshot: food.price,
      });
    }

    return CartService.getCart(userId);
  }

  static async updateItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartWithItems> {
    const cart = await CartService.getCart(userId);
    const item = cart.items.find((current) => current.id === itemId);

    if (!item) {
      throw new NotFoundError("Cart item", itemId);
    }

    await CartRepository.updateItemQuantity(itemId, quantity);
    return CartService.getCart(userId);
  }

  static async removeItem(
    userId: string,
    itemId: string,
  ): Promise<CartWithItems> {
    const cart = await CartService.getCart(userId);
    const item = cart.items.find((current) => current.id === itemId);

    if (!item) {
      throw new NotFoundError("Cart item", itemId);
    }

    await CartRepository.deleteItem(itemId);
    return CartService.getCart(userId);
  }

  static async clearCart(userId: string): Promise<CartWithItems> {
    const cart = await CartService.getCart(userId);
    await CartRepository.clearItems(cart.id);
    return CartService.getCart(userId);
  }
}
