import { apiRequest } from "./api";

export interface CartItemFood {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  foodId: string;
  quantity: number;
  unitPriceSnapshot: number;
  food: CartItemFood;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export function getCart(userId: string): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart?userId=${encodeURIComponent(userId)}`);
}

export function addToCart(
  userId: string,
  foodId: string,
  quantity = 1,
): Promise<Cart> {
  return apiRequest<Cart>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ userId, foodId, quantity }),
  });
}

export function updateCartItem(
  userId: string,
  itemId: string,
  quantity: number,
): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ userId, quantity }),
  });
}

export function removeCartItem(userId: string, itemId: string): Promise<Cart> {
  return apiRequest<Cart>(
    `/api/cart/items/${itemId}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );
}

export function clearCart(userId: string): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export function cartCount(cart: Cart | null): number {
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function cartSubtotal(cart: Cart | null): number {
  const total =
    cart?.items.reduce(
      (sum, item) => sum + item.unitPriceSnapshot * item.quantity,
      0,
    ) ?? 0;
  return Math.round(total * 100) / 100;
}
