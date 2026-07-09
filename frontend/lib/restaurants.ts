import { apiRequest } from "./api";

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  owner?: { id: string; name: string };
}

export function getMyRestaurants(ownerId: string): Promise<Restaurant[]> {
  return apiRequest<Restaurant[]>(
    `/api/restaurants?ownerId=${encodeURIComponent(ownerId)}`,
  );
}

export function createRestaurant(input: {
  ownerId: string;
  name: string;
  description?: string;
}): Promise<Restaurant> {
  return apiRequest<Restaurant>("/api/restaurants", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateRestaurant(
  id: string,
  updates: { name?: string; description?: string; isActive?: boolean },
): Promise<Restaurant> {
  return apiRequest<Restaurant>(`/api/restaurants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
