import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFood, getFoods } from "../food.controller";
import { FoodRepository } from "../food.repository";

vi.mock("../food.repository", () => ({
  FoodRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

const restaurantId = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";
const foodId = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const food = {
  id: foodId,
  restaurantId,
  name: "Classic Burger",
  description: null,
  price: 10.5,
  imageUrl: null,
  isAvailable: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  restaurant: { id: restaurantId, name: "Demo Diner" },
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("food controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all foods", async () => {
    vi.mocked(FoodRepository.getAll).mockResolvedValue([food]);

    const response = await getFoods();

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({ id: foodId }),
    ]);
    expect(FoodRepository.getAll).toHaveBeenCalledWith(undefined);
  });

  it("filters by restaurantId when provided", async () => {
    vi.mocked(FoodRepository.getAll).mockResolvedValue([food]);

    const response = await getFoods(restaurantId);

    expect(response.status).toBe(200);
    expect(FoodRepository.getAll).toHaveBeenCalledWith(restaurantId);
  });

  it("rejects an invalid restaurantId filter", async () => {
    const response = await getFoods("not-a-uuid");

    expect(response.status).toBe(400);
    expect(FoodRepository.getAll).not.toHaveBeenCalled();
  });

  it("returns a food by id", async () => {
    vi.mocked(FoodRepository.getById).mockResolvedValue(food);

    const response = await getFood(foodId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual(
      expect.objectContaining({ id: foodId }),
    );
  });

  it("rejects an invalid uuid", async () => {
    const response = await getFood("not-a-uuid");

    expect(response.status).toBe(400);
    expect(FoodRepository.getById).not.toHaveBeenCalled();
  });

  it("returns 404 when a food is not found", async () => {
    vi.mocked(FoodRepository.getById).mockResolvedValue(null);

    const response = await getFood(foodId);

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Food not found" });
  });
});
