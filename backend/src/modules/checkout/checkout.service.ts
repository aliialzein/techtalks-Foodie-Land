import { BadRequestError } from "../../util/errors";
import { CartRepository } from "../cart/cart.repository";
import { OrderService } from "../order/order.service";
import type { OrderWithDetails } from "../order/order.types";

export class CheckoutService {
  // Turns the user's cart into an order. Pricing/validation is delegated to
  // OrderService.create (which re-reads food prices server-side), so the client
  // never dictates the total. The cart is cleared only after the order succeeds.
  static async placeOrder(userId: string): Promise<OrderWithDetails> {
    const cart = await CartRepository.getByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Your cart is empty");
    }

    const restaurantIds = [
      ...new Set(cart.items.map((item) => item.food.restaurantId)),
    ];

    if (restaurantIds.length > 1) {
      throw new BadRequestError(
        "Your cart contains items from multiple restaurants",
      );
    }

    const order = await OrderService.create({
      userId,
      restaurantId: restaurantIds[0],
      items: cart.items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
      })),
    });

    await CartRepository.clearItems(cart.id);

    return order;
  }
}
