import type { OrderStatus } from "@/generated/prisma";
import { ConflictError, NotFoundError } from "../../util/errors";
import { OrderRepository } from "./order.repository";
import type {
  CreateOrderInput,
  OrderItemForTotal,
  OrderWithDetails,
} from "./order.types";

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export class OrderService {
  static getAll(): Promise<OrderWithDetails[]> {
    return OrderRepository.getAll();
  }

  static async getById(id: string): Promise<OrderWithDetails> {
    const order = await OrderRepository.getById(id);

    if (!order) {
      throw new NotFoundError("Order", id);
    }

    return order;
  }

  static async create(payload: CreateOrderInput): Promise<OrderWithDetails> {
    const user = await OrderRepository.userExists(payload.userId);

    if (!user) {
      throw new NotFoundError("User", payload.userId);
    }

    const restaurant = await OrderRepository.restaurantExists(
      payload.restaurantId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant", payload.restaurantId);
    }

    const foodIds = payload.items.map((item) => item.foodId);
    const foods = await OrderRepository.findFoodsByIds(foodIds);
    const foodsById = new Map(foods.map((food) => [food.id, food]));

    const items = payload.items.map((item) => {
      const food = foodsById.get(item.foodId);

      if (!food) {
        throw new NotFoundError("Food", item.foodId);
      }

      return {
        foodId: food.id,
        nameSnapshot: food.name,
        priceSnapshot: food.price,
        quantity: item.quantity,
      };
    });

    const totalPrice = OrderService.calculateTotal(items);

    return OrderRepository.create({
      userId: payload.userId,
      restaurantId: payload.restaurantId,
      totalPrice,
      items,
    });
  }

  static calculateTotal(items: OrderItemForTotal[]): number {
    const total = items.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    );

    return Math.round(total * 100) / 100;
  }

  static async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderWithDetails> {
    const order = await OrderService.getById(id);

    if (order.status === status) {
      return order;
    }

    if (!ORDER_STATUS_TRANSITIONS[order.status].includes(status)) {
      throw new ConflictError(
        `Cannot transition order status from ${order.status} to ${status}`,
      );
    }

    return OrderRepository.updateStatus(id, status);
  }

  static async cancel(id: string): Promise<OrderWithDetails> {
    const order = await OrderService.getById(id);

    if (order.status === "CANCELLED") {
      return order;
    }

    if (!ORDER_STATUS_TRANSITIONS[order.status].includes("CANCELLED")) {
      throw new ConflictError(
        `Order ${id} cannot be cancelled while in status ${order.status}`,
      );
    }

    return OrderRepository.updateStatus(id, "CANCELLED");
  }

  static async delete(id: string): Promise<void> {
    await OrderService.getById(id);
    await OrderRepository.delete(id);
  }
}
