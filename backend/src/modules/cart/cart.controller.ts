import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { CartService } from "./cart.service";
import {
  addCartItemSchema,
  cartItemIdSchema,
  updateCartItemSchema,
  userIdSchema,
} from "./cart.validation";

export async function getCart(userId: string | null) {
  try {
    const parsedUserId = userIdSchema.parse(userId);
    const data = await CartService.getCart(parsedUserId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function addCartItem(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const payload = addCartItemSchema.parse(body);
    const data = await CartService.addItem(
      payload.userId,
      payload.foodId,
      payload.quantity,
    );
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCartItem(req: NextRequest | Request, itemId: string) {
  try {
    const parsedItemId = cartItemIdSchema.parse(itemId);
    const body: unknown = await req.json();
    const payload = updateCartItemSchema.parse(body);
    const data = await CartService.updateItem(
      payload.userId,
      parsedItemId,
      payload.quantity,
    );
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function removeCartItem(itemId: string, userId: string | null) {
  try {
    const parsedItemId = cartItemIdSchema.parse(itemId);
    const parsedUserId = userIdSchema.parse(userId);
    const data = await CartService.removeItem(parsedUserId, parsedItemId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function clearCart(userId: string | null) {
  try {
    const parsedUserId = userIdSchema.parse(userId);
    const data = await CartService.clearCart(parsedUserId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}
