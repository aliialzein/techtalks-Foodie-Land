import { apiRequest } from "./api";

export interface Food {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  restaurant: { id: string; name: string };
}

export function getFoods(restaurantId?: string): Promise<Food[]> {
  const query = restaurantId
    ? `?restaurantId=${encodeURIComponent(restaurantId)}`
    : "";
  return apiRequest<Food[]>(`/api/foods${query}`);
}

// Owner-only writes (the backend enforces that ownerId owns the restaurant).
export function createFood(input: {
  ownerId: string;
  restaurantId: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}): Promise<Food> {
  return apiRequest<Food>("/api/foods", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateFood(
  id: string,
  updates: {
    ownerId: string;
    name?: string;
    price?: number;
    description?: string | null;
    imageUrl?: string | null;
    isAvailable?: boolean;
  },
): Promise<Food> {
  return apiRequest<Food>(`/api/foods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteFood(
  id: string,
  ownerId: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/api/foods/${id}?ownerId=${encodeURIComponent(ownerId)}`,
    { method: "DELETE" },
  );
}
