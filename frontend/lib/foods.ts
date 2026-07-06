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
