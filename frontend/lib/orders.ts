// Client-side types + API access for the Orders feature.
//
// The types mirror the backend `OrderWithDetails` shape
// (backend/src/modules/order), and every request funnels through a single
// `request()` helper so error handling lives in exactly one place on the client
// — the same "one funnel" idea as the backend's `handleError`.

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

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    // The backend surfaces errors as `{ error: string }` (see handleError).
    const message =
      (data as { error?: string } | null)?.error ??
      "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export function getOrders(userId?: string): Promise<Order[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request<Order[]>(`/api/orders${query}`);
}

export function getOrder(id: string): Promise<Order> {
  return request<Order>(`/api/orders/${id}`);
}

export function cancelOrder(id: string): Promise<Order> {
  return request<Order>(`/api/orders/${id}/cancel`, { method: "POST" });
}

// Mirrors the backend transition rules: an order can only be cancelled while it
// is still PENDING or PREPARING (never once it is READY / DELIVERED / CANCELLED).
export function isCancellable(status: OrderStatus): boolean {
  return status === "PENDING" || status === "PREPARING";
}
