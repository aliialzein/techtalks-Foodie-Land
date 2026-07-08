import { beforeEach, describe, expect, it, vi } from "vitest";
import { placeOrder } from "../checkout.controller";
import { CartRepository } from "../../cart/cart.repository";
import { OrderService } from "../../order/order.service";

vi.mock("../../cart/cart.repository", () => ({
  CartRepository: {
    getByUserId: vi.fn(),
    clearItems: vi.fn(),
  },
}));

vi.mock("../../order/order.service", () => ({
  OrderService: {
    create: vi.fn(),
  },
}));

const userId = "cccccccc-3333-4333-8333-cccccccccccc";
const restaurantId = "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb";
const otherRestaurantId = "99999999-9999-4999-8999-999999999999";
const cartId = "dddddddd-4444-4444-8444-dddddddddddd";
const foodId1 = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const foodId2 = "ffffffff-6666-4666-8666-ffffffffffff";

function makeItem(id: string, foodId: string, restId: string, quantity: number) {
  return {
    id,
    cartId,
    foodId,
    quantity,
    unitPriceSnapshot: 10,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    food: {
      id: foodId,
      name: "Dish",
      price: 10,
      imageUrl: null,
      restaurantId: restId,
    },
  };
}

const cart = {
  id: cartId,
  userId,
  items: [
    makeItem("item-1", foodId1, restaurantId, 2),
    makeItem("item-2", foodId2, restaurantId, 1),
  ],
};

const order = {
  id: "0a0a0a0a-1111-4111-8111-0a0a0a0a0a0a",
  userId,
  restaurantId,
  status: "PENDING" as const,
  totalPrice: 30,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  items: [],
  user: { id: userId, name: "Demo", email: "demo@test.dev" },
  restaurant: { id: restaurantId, name: "Demo Diner" },
};

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("checkout controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("places an order from the cart then clears it", async () => {
    vi.mocked(CartRepository.getByUserId).mockResolvedValue(cart);
    vi.mocked(OrderService.create).mockResolvedValue(order);

    const response = await placeOrder(makeRequest({ userId }));

    expect(response.status).toBe(201);
    expect(OrderService.create).toHaveBeenCalledWith({
      userId,
      restaurantId,
      items: [
        { foodId: foodId1, quantity: 2 },
        { foodId: foodId2, quantity: 1 },
      ],
    });
    expect(CartRepository.clearItems).toHaveBeenCalledWith(cartId);
  });

  it("returns 400 when the cart is empty", async () => {
    vi.mocked(CartRepository.getByUserId).mockResolvedValue({
      id: cartId,
      userId,
      items: [],
    });

    const response = await placeOrder(makeRequest({ userId }));

    expect(response.status).toBe(400);
    expect(OrderService.create).not.toHaveBeenCalled();
  });

  it("returns 400 when the user has no cart", async () => {
    vi.mocked(CartRepository.getByUserId).mockResolvedValue(null);

    const response = await placeOrder(makeRequest({ userId }));

    expect(response.status).toBe(400);
  });

  it("returns 400 when the cart mixes restaurants", async () => {
    vi.mocked(CartRepository.getByUserId).mockResolvedValue({
      id: cartId,
      userId,
      items: [
        makeItem("item-1", foodId1, restaurantId, 1),
        makeItem("item-2", foodId2, otherRestaurantId, 1),
      ],
    });

    const response = await placeOrder(makeRequest({ userId }));

    expect(response.status).toBe(400);
    expect(OrderService.create).not.toHaveBeenCalled();
    expect(CartRepository.clearItems).not.toHaveBeenCalled();
  });

  it("rejects a missing userId", async () => {
    const response = await placeOrder(makeRequest({}));

    expect(response.status).toBe(400);
    expect(CartRepository.getByUserId).not.toHaveBeenCalled();
  });

  it("does not clear the cart when order creation fails", async () => {
    vi.mocked(CartRepository.getByUserId).mockResolvedValue(cart);
    vi.mocked(OrderService.create).mockRejectedValue(new Error("db down"));

    const response = await placeOrder(makeRequest({ userId }));

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({ error: "Internal server error" });
    expect(CartRepository.clearItems).not.toHaveBeenCalled();
  });
});
