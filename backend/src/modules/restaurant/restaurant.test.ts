import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "./restaurant.controller";
import { RestaurantRepository } from "./restaurant.repository";

vi.mock("./restaurant.repository", () => ({
  RestaurantRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    ownerExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const restaurantId = "3f7a58b8-9e35-4d2a-958f-a079caec62d3";
const ownerId = "b78d94a4-5e44-4e47-9c87-5860a9959145";
const restaurant = {
  id: restaurantId,
  ownerId,
  name: "Foodie Land",
  description: "Fresh meals",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  owner: {
    id: ownerId,
    name: "Owner Name",
  },
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("restaurant controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all restaurants", async () => {
    vi.mocked(RestaurantRepository.getAll).mockResolvedValue([restaurant]);

    const response = await getRestaurants();

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({ id: restaurantId }),
    ]);
  });

  it("returns a restaurant by id", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);

    const response = await getRestaurant(restaurantId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual(
      expect.objectContaining({ id: restaurantId }),
    );
  });

  it("rejects an invalid uuid", async () => {
    const response = await getRestaurant("not-a-uuid");

    expect(response.status).toBe(400);
    expect(RestaurantRepository.getById).not.toHaveBeenCalled();
  });

  it("returns 404 when a restaurant is not found", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(null);

    const response = await getRestaurant(restaurantId);

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Restaurant not found" });
  });

  describe("createRestaurant", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/restaurants", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    it("creates a restaurant", async () => {
      vi.mocked(RestaurantRepository.ownerExists).mockResolvedValue({ id: ownerId });
      vi.mocked(RestaurantRepository.create).mockResolvedValue(restaurant);

      const request = makeRequest({
        ownerId,
        name: "Foodie Land",
        description: "Fresh meals",
        isActive: true,
      });

      const response = await createRestaurant(request);

      expect(response.status).toBe(201);
      expect(await readJson(response)).toEqual(
        expect.objectContaining({ id: restaurantId }),
      );
      expect(RestaurantRepository.create).toHaveBeenCalledWith({
        ownerId,
        name: "Foodie Land",
        description: "Fresh meals",
        isActive: true,
      });
    });

    it("creates a restaurant without optional fields", async () => {
      vi.mocked(RestaurantRepository.ownerExists).mockResolvedValue({ id: ownerId });
      vi.mocked(RestaurantRepository.create).mockResolvedValue(restaurant);

      const request = makeRequest({ ownerId, name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(201);
      expect(RestaurantRepository.create).toHaveBeenCalledWith({
        ownerId,
        name: "Foodie Land",
      });
    });

    it("returns 404 when the owner does not exist", async () => {
      vi.mocked(RestaurantRepository.ownerExists).mockResolvedValue(null);

      const request = makeRequest({ ownerId, name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: "Owner not found" });
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a missing ownerId", async () => {
      const request = makeRequest({ name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.ownerExists).not.toHaveBeenCalled();
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects an invalid ownerId uuid", async () => {
      const request = makeRequest({ ownerId: "not-a-uuid", name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a name that is too short", async () => {
      const request = makeRequest({ ownerId, name: "A" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a name that is too long", async () => {
      const request = makeRequest({ ownerId, name: "A".repeat(101) });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a description that is too long", async () => {
      const request = makeRequest({
        ownerId,
        name: "Foodie Land",
        description: "A".repeat(501),
      });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects unknown fields due to strict schema", async () => {
      const request = makeRequest({
        ownerId,
        name: "Foodie Land",
        extraField: "not allowed",
      });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects malformed JSON bodies", async () => {
      const request = new Request("http://localhost/api/restaurants", {
        method: "POST",
        body: "{not-json",
      });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });
  });

  it("updates a restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);
    vi.mocked(RestaurantRepository.update).mockResolvedValue({
      ...restaurant,
      name: "New Name",
    });
    const request = new Request("http://localhost/api/restaurants/" + restaurantId, {
      method: "PATCH",
      body: JSON.stringify({ name: "New Name" }),
    });

    const response = await updateRestaurant(request, restaurantId);

    expect(response.status).toBe(200);
    expect(RestaurantRepository.update).toHaveBeenCalledWith(restaurantId, {
      name: "New Name",
    });
  });

  it("rejects invalid update payloads", async () => {
    const request = new Request("http://localhost/api/restaurants/" + restaurantId, {
      method: "PATCH",
      body: JSON.stringify({ name: "A" }),
    });

    const response = await updateRestaurant(request, restaurantId);

    expect(response.status).toBe(400);
    expect(RestaurantRepository.update).not.toHaveBeenCalled();
  });

  it("deletes a restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);
    vi.mocked(RestaurantRepository.delete).mockResolvedValue(restaurant);

    const response = await deleteRestaurant(restaurantId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ message: "Deleted" });
  });

  it("returns 404 when deleting a missing restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(null);

    const response = await deleteRestaurant(restaurantId);

    expect(response.status).toBe(404);
    expect(RestaurantRepository.delete).not.toHaveBeenCalled();
  });
});