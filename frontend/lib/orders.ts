// Client-side types + API access for the Orders feature.
//
// The types mirror the backend `OrderWithDetails` shape
// (backend/src/modules/order); requests go through the shared apiRequest helper.

import { apiRequest } from "./api";

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  foodId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
  user: { id: string; name: string; email: string };
  restaurant: { id: string; name: string };
}

export function getOrders(userId?: string): Promise<Order[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiRequest<Order[]>(`/api/orders${query}`);
}

// Owner view: all orders placed at a restaurant.
export function getRestaurantOrders(restaurantId: string): Promise<Order[]> {
  return apiRequest<Order[]>(
    `/api/orders?restaurantId=${encodeURIComponent(restaurantId)}`,
  );
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}`);
}

export function cancelOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}/cancel`, { method: "POST" });
}

// Mirrors the backend transition rules: an order can only be cancelled while it
// is still PENDING or PREPARING (never once it is READY / DELIVERED / CANCELLED).
export function isCancellable(status: OrderStatus): boolean {
  return status === "PENDING" || status === "PREPARING";
}
