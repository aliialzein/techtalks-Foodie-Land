import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { OrderService } from "./order.service";
import {
  createOrderSchema,
  orderIdSchema,
  restaurantIdSchema,
  updateOrderStatusSchema,
  userIdSchema,
} from "./order.validation";

export async function getOrders(userId?: string, restaurantId?: string) {
  try {
    const filterUserId = userId ? userIdSchema.parse(userId) : undefined;
    const filterRestaurantId = restaurantId
      ? restaurantIdSchema.parse(restaurantId)
      : undefined;
    const data = await OrderService.getAll({
      userId: filterUserId,
      restaurantId: filterRestaurantId,
    });
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getOrder(id: string) {
  try {
    const parsedId = orderIdSchema.parse(id);
    const data = await OrderService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function createOrder(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const payload = createOrderSchema.parse(body);
    const data = await OrderService.create(payload);
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateOrderStatus(req: NextRequest | Request, id: string) {
  try {
    const parsedId = orderIdSchema.parse(id);
    const body: unknown = await req.json();
    const payload = updateOrderStatusSchema.parse(body);
    const data = await OrderService.updateStatus(parsedId, payload.status);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function cancelOrder(id: string) {
  try {
    const parsedId = orderIdSchema.parse(id);
    const data = await OrderService.cancel(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteOrder(id: string) {
  try {
    const parsedId = orderIdSchema.parse(id);
    await OrderService.delete(parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
