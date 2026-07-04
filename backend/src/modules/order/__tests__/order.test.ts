import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../order.controller";
import { OrderRepository } from "../order.repository";
import { OrderService } from "../order.service";

vi.mock("../order.repository", () => ({
  OrderRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    userExists: vi.fn(),
    restaurantExists: vi.fn(),
    findFoodsByIds: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

const orderId = "3f7a58b8-9e35-4d2a-958f-a079caec62d3";
const userId = "b78d94a4-5e44-4e47-9c87-5860a9959145";
const restaurantId = "c1a2b3c4-5e44-4e47-9c87-5860a9959146";
const foodId1 = "11111111-1111-1111-a111-111111111111";
const foodId2 = "22222222-2222-2222-a222-222222222222";

const order = {
  id: orderId,
  userId,
  restaurantId,
  status: "PENDING" as const,
  totalPrice: 26.25,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  user: { id: userId, name: "Jane Doe", email: "jane@example.com" },
  restaurant: { id: restaurantId, name: "Foodie Land" },
  items: [
    {
      id: "aaaaaaaa-1111-1111-1111-111111111111",
      orderId,
      foodId: foodId1,
      nameSnapshot: "Burger",
      priceSnapshot: 10.5,
      quantity: 2,
    },
    {
      id: "bbbbbbbb-2222-2222-2222-222222222222",
      orderId,
      foodId: foodId2,
      nameSnapshot: "Fries",
      priceSnapshot: 5.25,
      quantity: 1,
    },
  ],
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

function makeFood(id: string, name: string, price: number) {
  return {
    id,
    name,
    price,
    restaurantId,
    description: null,
    imageUrl: null,
    isAvailable: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

describe("order controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all orders", async () => {
    vi.mocked(OrderRepository.getAll).mockResolvedValue([order]);

    const response = await getOrders();

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({ id: orderId }),
    ]);
  });

  it("returns an order by id", async () => {
    vi.mocked(OrderRepository.getById).mockResolvedValue(order);

    const response = await getOrder(orderId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual(
      expect.objectContaining({ id: orderId }),
    );
  });

  it("rejects an invalid uuid", async () => {
    const response = await getOrder("not-a-uuid");

    expect(response.status).toBe(400);
    expect(OrderRepository.getById).not.toHaveBeenCalled();
  });

  it("returns 404 when an order is not found", async () => {
    vi.mocked(OrderRepository.getById).mockResolvedValue(null);

    const response = await getOrder(orderId);

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Order not found" });
  });

  it("returns 500 (without crashing) on an unexpected repository error", async () => {
    vi.mocked(OrderRepository.getAll).mockRejectedValue(
      new Error("database connection lost"),
    );

    const response = await getOrders();

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({ error: "Internal server error" });
  });

  describe("createOrder", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    const validPayload = {
      userId,
      restaurantId,
      items: [
        { foodId: foodId1, quantity: 2 },
        { foodId: foodId2, quantity: 1 },
      ],
    };

    it("creates an order and computes the total from food prices", async () => {
      vi.mocked(OrderRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(OrderRepository.restaurantExists).mockResolvedValue({
        id: restaurantId,
      });
      vi.mocked(OrderRepository.findFoodsByIds).mockResolvedValue([
        makeFood(foodId1, "Burger", 10.5),
        makeFood(foodId2, "Fries", 5.25),
      ]);
      vi.mocked(OrderRepository.create).mockResolvedValue(order);

      const response = await createOrder(makeRequest(validPayload));

      expect(response.status).toBe(201);
      expect(await readJson(response)).toEqual(
        expect.objectContaining({ id: orderId, totalPrice: 26.25 }),
      );
      expect(OrderRepository.create).toHaveBeenCalledWith({
        userId,
        restaurantId,
        totalPrice: 26.25,
        items: [
          {
            foodId: foodId1,
            nameSnapshot: "Burger",
            priceSnapshot: 10.5,
            quantity: 2,
          },
          {
            foodId: foodId2,
            nameSnapshot: "Fries",
            priceSnapshot: 5.25,
            quantity: 1,
          },
        ],
      });
    });

    it("returns 404 when the user does not exist", async () => {
      vi.mocked(OrderRepository.userExists).mockResolvedValue(null);

      const response = await createOrder(makeRequest(validPayload));

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: "User not found" });
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("returns 404 when the restaurant does not exist", async () => {
      vi.mocked(OrderRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(OrderRepository.restaurantExists).mockResolvedValue(null);

      const response = await createOrder(makeRequest(validPayload));

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({
        error: "Restaurant not found",
      });
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("returns 404 when a food item does not exist", async () => {
      vi.mocked(OrderRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(OrderRepository.restaurantExists).mockResolvedValue({
        id: restaurantId,
      });
      vi.mocked(OrderRepository.findFoodsByIds).mockResolvedValue([
        makeFood(foodId1, "Burger", 10.5),
      ]);

      const response = await createOrder(makeRequest(validPayload));

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ error: "Food not found" });
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("rejects an empty items array", async () => {
      const response = await createOrder(
        makeRequest({ userId, restaurantId, items: [] }),
      );

      expect(response.status).toBe(400);
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("rejects a non-positive quantity", async () => {
      const response = await createOrder(
        makeRequest({
          userId,
          restaurantId,
          items: [{ foodId: foodId1, quantity: 0 }],
        }),
      );

      expect(response.status).toBe(400);
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("rejects unknown fields due to strict schema", async () => {
      const response = await createOrder(
        makeRequest({ ...validPayload, extraField: "not allowed" }),
      );

      expect(response.status).toBe(400);
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });

    it("rejects malformed JSON bodies", async () => {
      const request = new Request("http://localhost/api/orders", {
        method: "POST",
        body: "{not-json",
      });

      const response = await createOrder(request);

      expect(response.status).toBe(400);
      expect(OrderRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateOrderStatus", () => {
    function makeRequest(status: unknown) {
      return new Request("http://localhost/api/orders/" + orderId, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }

    it("allows a valid transition", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue(order);
      vi.mocked(OrderRepository.updateStatus).mockResolvedValue({
        ...order,
        status: "PREPARING" as const,
      });

      const response = await updateOrderStatus(
        makeRequest("PREPARING"),
        orderId,
      );

      expect(response.status).toBe(200);
      expect(OrderRepository.updateStatus).toHaveBeenCalledWith(
        orderId,
        "PREPARING",
      );
    });

    it("rejects an invalid transition (skipping a step)", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue(order);

      const response = await updateOrderStatus(
        makeRequest("DELIVERED"),
        orderId,
      );

      expect(response.status).toBe(409);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });

    it("rejects a transition out of a terminal state", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue({
        ...order,
        status: "DELIVERED" as const,
      });

      const response = await updateOrderStatus(
        makeRequest("PREPARING"),
        orderId,
      );

      expect(response.status).toBe(409);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });

    it("rejects an invalid status value", async () => {
      const response = await updateOrderStatus(
        makeRequest("NOT_A_STATUS"),
        orderId,
      );

      expect(response.status).toBe(400);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });

    it("returns 404 when the order does not exist", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue(null);

      const response = await updateOrderStatus(
        makeRequest("PREPARING"),
        orderId,
      );

      expect(response.status).toBe(404);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe("cancelOrder", () => {
    it("cancels a pending order", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue(order);
      vi.mocked(OrderRepository.updateStatus).mockResolvedValue({
        ...order,
        status: "CANCELLED" as const,
      });

      const response = await cancelOrder(orderId);

      expect(response.status).toBe(200);
      expect(OrderRepository.updateStatus).toHaveBeenCalledWith(
        orderId,
        "CANCELLED",
      );
    });

    it("rejects cancelling a delivered order", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue({
        ...order,
        status: "DELIVERED" as const,
      });

      const response = await cancelOrder(orderId);

      expect(response.status).toBe(409);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });

    it("rejects cancelling a ready (shipped) order", async () => {
      vi.mocked(OrderRepository.getById).mockResolvedValue({
        ...order,
        status: "READY" as const,
      });

      const response = await cancelOrder(orderId);

      expect(response.status).toBe(409);
      expect(OrderRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  it("deletes an order", async () => {
    vi.mocked(OrderRepository.getById).mockResolvedValue(order);
    vi.mocked(OrderRepository.delete).mockResolvedValue([{}, order] as never);

    const response = await deleteOrder(orderId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ message: "Deleted" });
  });

  it("returns 404 when deleting a missing order", async () => {
    vi.mocked(OrderRepository.getById).mockResolvedValue(null);

    const response = await deleteOrder(orderId);

    expect(response.status).toBe(404);
    expect(OrderRepository.delete).not.toHaveBeenCalled();
  });
});

describe("OrderService.calculateTotal", () => {
  it("sums price times quantity across items", () => {
    const total = OrderService.calculateTotal([
      { priceSnapshot: 10.5, quantity: 2 },
      { priceSnapshot: 5.25, quantity: 1 },
    ]);

    expect(total).toBe(26.25);
  });

  it("rounds to two decimal places", () => {
    const total = OrderService.calculateTotal([
      { priceSnapshot: 0.1, quantity: 3 },
    ]);

    expect(total).toBe(0.3);
  });
});
