import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
import { RestaurantStatus } from "@/generated/prisma";
import { createToken } from "../../auth/token";
import {
  approveRestaurant,
  createRestaurant,
  deleteRestaurant,
  getPendingRestaurants,
  getRestaurant,
  getRestaurants,
  rejectRestaurant,
  updateRestaurant,
} from "../restaurant.controller";
import { RestaurantRepository } from "../restaurant.repository";
import { RestaurantEmailService } from "@/modules/notifications/restaurant/restaurant-email.service";

vi.mock("../restaurant.repository", () => ({
  RestaurantRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getOwner: vi.fn(),
    getAdmins: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getPending: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  },
}));

vi.mock("@/modules/notifications/restaurant/restaurant-email.service", () => ({
  RestaurantEmailService: {
    sendRegistrationReceived: vi.fn().mockResolvedValue(undefined),
    sendNewRegistrationToAdmin: vi.fn().mockResolvedValue(undefined),
    sendApproved: vi.fn().mockResolvedValue(undefined),
    sendRejected: vi.fn().mockResolvedValue(undefined),
  },
}));

const restaurantId = "3f7a58b8-9e35-4d2a-958f-a079caec62d3";
const ownerId = "b78d94a4-5e44-4e47-9c87-5860a9959145";
const restaurant = {
  id: restaurantId,
  ownerId,
  name: "Foodie Land",
  description: "Fresh meals",
  status: RestaurantStatus.PENDING,
  approvedAt: null,
  approvedBy: null,
  rejectionReason: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  owner: {
    id: ownerId,
    name: "Owner Name",
    email: "owner@test.com"
  },
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}


describe("restaurant controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(await readJson(response)).toEqual({
    success: false,
    message: "Restaurant not found",
  });
  });

  it("returns 500 (without crashing) on an unexpected repository error", async () => {
    vi.mocked(RestaurantRepository.getAll).mockRejectedValue(
      new Error("database connection lost"),
    );

    const response = await getRestaurants();

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({
    success: false,
    message: "Internal server error",
  });
  });

  describe("createRestaurant", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/restaurants", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    it("creates a restaurant", async () => {
      vi.mocked(RestaurantRepository.getOwner).mockResolvedValue({
        id: ownerId,
        name: "Owner Name",
        email: "owner@test.com",
      });
      vi.mocked(RestaurantRepository.getAdmins).mockResolvedValue([
        {
          name: "Admin",
          email: "admin@test.com",
        },
      ]);
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
      expect(RestaurantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId,
          name: "Foodie Land",
          description: "Fresh meals",
          rejectionReason: null,
        }),
      );
    });

    it("creates a restaurant without optional fields", async () => {
      vi.mocked(RestaurantRepository.getOwner).mockResolvedValue({
        id: ownerId,
        name: "Owner Name",
        email: "owner@test.com",
      });
      vi.mocked(RestaurantRepository.getAdmins).mockResolvedValue([
        {
          name: "Admin",
          email: "admin@test.com",
        },
      ]);
      vi.mocked(RestaurantRepository.create).mockResolvedValue(restaurant);

      const request = makeRequest({ ownerId, name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(201);
      console.log(await readJson(response));
      expect(RestaurantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId,
          name: "Foodie Land",
        }),
      );
    });

    it("creates a restaurant in pending state and ignores client-controlled approval fields", async () => {
      vi.mocked(RestaurantRepository.getOwner).mockResolvedValue({
        id: ownerId,
        name: "Owner Name",
        email: "owner@test.com",
      });
      vi.mocked(RestaurantRepository.getAdmins).mockResolvedValue([
        {
          name: "Admin",
          email: "admin@test.com",
        },
      ]);
      vi.mocked(RestaurantRepository.create).mockResolvedValue(restaurant);

      const request = makeRequest({
        ownerId,
        name: "Foodie Land",
        description: "Fresh meals",
        status: "APPROVED",
        rejectionReason: "Do not use",
        isActive: false,
      });

      const response = await createRestaurant(request);

      expect(response.status).toBe(201);
      console.log(await readJson(response));
      expect(RestaurantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId,
          name: "Foodie Land",
          description: "Fresh meals",
          rejectionReason: null,
        }),
      );
    });

    it("returns 404 when the owner does not exist", async () => {
      vi.mocked(RestaurantRepository.getOwner).mockResolvedValue(null);

      const request = makeRequest({ ownerId, name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({
      success: false,
      message: "Owner not found",
    });
      expect(RestaurantRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a missing ownerId", async () => {
      const request = makeRequest({ name: "Foodie Land" });

      const response = await createRestaurant(request);

      expect(response.status).toBe(400);
      expect(RestaurantRepository.getOwner).not.toHaveBeenCalled();
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

  it("returns pending restaurants", async () => {
    vi.mocked(RestaurantRepository.getPending).mockResolvedValue([restaurant]);

    const token = createToken(ownerId, "owner@example.com", "ADMIN");
    const request = new Request("http://localhost/api/restaurants/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await getPendingRestaurants(request);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({ id: restaurantId }),
    ]);
  });

  it("requires admin auth to approve a restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);

    const request = new Request("http://localhost/api/restaurants/" + restaurantId, {
      method: "PATCH",
    });

    const response = await approveRestaurant(request, restaurantId);

    expect(response.status).toBe(401);
    expect(RestaurantRepository.approve).not.toHaveBeenCalled();
  });

  it("approves a restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);
    vi.mocked(RestaurantRepository.approve).mockResolvedValue({
      ...restaurant,
      status: "APPROVED",
    });

    const token = createToken(ownerId, "owner@example.com", "ADMIN");
    const request = new Request("http://localhost/api/restaurants/" + restaurantId, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await approveRestaurant(request, restaurantId);

    expect(response.status).toBe(200);
    expect(RestaurantRepository.approve).toHaveBeenCalledWith(restaurantId);
  });

  it("rejects a restaurant with a reason", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(restaurant);
    vi.mocked(RestaurantRepository.reject).mockResolvedValue({
      ...restaurant,
      status: "REJECTED",
      rejectionReason: "Incomplete details",
    });

    const token = createToken(ownerId, "owner@example.com", "ADMIN");
    const request = new Request("http://localhost/api/restaurants/" + restaurantId, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await rejectRestaurant(request, restaurantId, {
      rejectionReason: "Incomplete details",
    });

    expect(response.status).toBe(200);
    expect(RestaurantRepository.reject).toHaveBeenCalledWith(restaurantId, {
      rejectionReason: "Incomplete details",
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
    // Success path returns straight from the controller (`jsonResponse({ message: "Deleted" }, 200)`),
    // not through handleError, so there is no `success` field here.
    expect(await readJson(response)).toEqual({ message: "Deleted" });
  });

  it("returns 404 when deleting a missing restaurant", async () => {
    vi.mocked(RestaurantRepository.getById).mockResolvedValue(null);

    const response = await deleteRestaurant(restaurantId);

    expect(response.status).toBe(404);
    expect(RestaurantRepository.delete).not.toHaveBeenCalled();
  });
});