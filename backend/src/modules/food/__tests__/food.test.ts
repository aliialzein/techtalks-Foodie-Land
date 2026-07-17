import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFood,
  deleteFood,
  getFood,
  getFoods,
  updateFood,
} from "../food.controller";
import { FoodRepository } from "../food.repository";

vi.mock("../food.repository", () => ({
  FoodRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    restaurantById: vi.fn(),
    getWithOwner: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteById: vi.fn(),
    orderItemCount: vi.fn(),
    deleteCartItemsForFood: vi.fn(),
  },
}));

const restaurantId = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";
const ownerId = "cccccccc-3333-4333-8333-cccccccccccc";
const otherOwnerId = "99999999-9999-4999-8999-999999999999";
const foodId = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const foodWithOwner = {
  id: foodId,
  restaurantId,
  name: "Classic Burger",
  description: null,
  price: 10.5,
  imageUrl: null,
  isAvailable: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  restaurant: { id: restaurantId, ownerId },
};
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
    expect(await readJson(response)).toEqual({
      success: false,
      message: "Food not found",
    });
  });

  describe("createFood", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/foods", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    const validPayload = {
      ownerId,
      restaurantId,
      name: "New Dish",
      price: 12.5,
    };

    it("creates a food for a restaurant the owner owns", async () => {
      vi.mocked(FoodRepository.restaurantById).mockResolvedValue({
        id: restaurantId,
        ownerId,
      });
      vi.mocked(FoodRepository.create).mockResolvedValue(food);

      const response = await createFood(makeRequest(validPayload));

      expect(response.status).toBe(201);
      expect(FoodRepository.create).toHaveBeenCalledWith({
        restaurantId,
        name: "New Dish",
        price: 12.5,
      });
    });

    it("returns 403 when the restaurant belongs to another owner", async () => {
      vi.mocked(FoodRepository.restaurantById).mockResolvedValue({
        id: restaurantId,
        ownerId: otherOwnerId,
      });

      const response = await createFood(makeRequest(validPayload));

      expect(response.status).toBe(403);
      expect(FoodRepository.create).not.toHaveBeenCalled();
    });

    it("returns 404 when the restaurant does not exist", async () => {
      vi.mocked(FoodRepository.restaurantById).mockResolvedValue(null);

      const response = await createFood(makeRequest(validPayload));

      expect(response.status).toBe(404);
      expect(FoodRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a non-positive price", async () => {
      const response = await createFood(
        makeRequest({ ...validPayload, price: 0 }),
      );

      expect(response.status).toBe(400);
      expect(FoodRepository.restaurantById).not.toHaveBeenCalled();
    });
  });

  describe("updateFood", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/foods/" + foodId, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    }

    it("updates a food the owner owns", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue(foodWithOwner);
      vi.mocked(FoodRepository.update).mockResolvedValue(food);

      const response = await updateFood(
        makeRequest({ ownerId, price: 9.99, isAvailable: false }),
        foodId,
      );

      expect(response.status).toBe(200);
      expect(FoodRepository.update).toHaveBeenCalledWith(foodId, {
        price: 9.99,
        isAvailable: false,
      });
    });

    it("returns 403 when the owner does not own the dish", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue({
        ...foodWithOwner,
        restaurant: { id: restaurantId, ownerId: otherOwnerId },
      });

      const response = await updateFood(
        makeRequest({ ownerId, price: 9.99 }),
        foodId,
      );

      expect(response.status).toBe(403);
      expect(FoodRepository.update).not.toHaveBeenCalled();
    });

    it("returns 404 when the dish does not exist", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue(null);

      const response = await updateFood(
        makeRequest({ ownerId, price: 9.99 }),
        foodId,
      );

      expect(response.status).toBe(404);
    });
  });

  describe("deleteFood", () => {
    it("deletes a food with no order history", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue(foodWithOwner);
      vi.mocked(FoodRepository.orderItemCount).mockResolvedValue(0);

      const response = await deleteFood(foodId, ownerId);

      expect(response.status).toBe(200);
      expect(FoodRepository.deleteCartItemsForFood).toHaveBeenCalledWith(foodId);
      expect(FoodRepository.deleteById).toHaveBeenCalledWith(foodId);
    });

    it("returns 409 when the dish has past orders", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue(foodWithOwner);
      vi.mocked(FoodRepository.orderItemCount).mockResolvedValue(3);

      const response = await deleteFood(foodId, ownerId);

      expect(response.status).toBe(409);
      expect(FoodRepository.deleteById).not.toHaveBeenCalled();
    });

    it("returns 403 when the owner does not own the dish", async () => {
      vi.mocked(FoodRepository.getWithOwner).mockResolvedValue({
        ...foodWithOwner,
        restaurant: { id: restaurantId, ownerId: otherOwnerId },
      });

      const response = await deleteFood(foodId, ownerId);

      expect(response.status).toBe(403);
      expect(FoodRepository.deleteById).not.toHaveBeenCalled();
    });

    it("rejects a missing ownerId", async () => {
      const response = await deleteFood(foodId, null);

      expect(response.status).toBe(400);
      expect(FoodRepository.getWithOwner).not.toHaveBeenCalled();
    });
  });
});