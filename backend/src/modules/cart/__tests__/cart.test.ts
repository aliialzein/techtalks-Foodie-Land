import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../cart.controller";
import { CartRepository } from "../cart.repository";
import { success } from "zod";

vi.mock("../cart.repository", () => ({
  CartRepository: {
    userExists: vi.fn(),
    getFood: vi.fn(),
    getByUserId: vi.fn(),
    createCart: vi.fn(),
    createItem: vi.fn(),
    updateItemQuantity: vi.fn(),
    deleteItem: vi.fn(),
    clearItems: vi.fn(),
  },
}));

const userId = "cccccccc-3333-4333-8333-cccccccccccc";
const foodId = "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
const cartId = "dddddddd-4444-4444-8444-dddddddddddd";
const itemId = "eeeeeeee-5555-4555-8555-eeeeeeeeeeee";

const food = {
  id: foodId,
  restaurantId: "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb",
  name: "Classic Burger",
  description: null,
  price: 10.5,
  imageUrl: null,
  isAvailable: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const cartItem = {
  id: itemId,
  cartId,
  foodId,
  quantity: 2,
  unitPriceSnapshot: 10.5,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  food: {
    id: foodId,
    name: "Classic Burger",
    price: 10.5,
    imageUrl: null,
    restaurantId: "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb",
  },
};

const emptyCart = { id: cartId, userId, items: [] as (typeof cartItem)[] };
const cartWithItem = { id: cartId, userId, items: [cartItem] };

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("cart controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getCart", () => {
    it("returns the user's cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(cartWithItem);

      const response = await getCart(userId);

      expect(response.status).toBe(200);
      expect(await readJson(response)).toEqual(
        expect.objectContaining({ id: cartId }),
      );
    });

    it("creates a cart lazily when none exists", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(null);
      vi.mocked(CartRepository.createCart).mockResolvedValue(emptyCart);

      const response = await getCart(userId);

      expect(response.status).toBe(200);
      expect(CartRepository.createCart).toHaveBeenCalledWith(userId);
    });

    it("rejects a missing userId", async () => {
      const response = await getCart(null);

      expect(response.status).toBe(400);
      expect(CartRepository.getByUserId).not.toHaveBeenCalled();
    });

    it("returns 404 when the user does not exist", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue(null);

      const response = await getCart(userId);

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ 
        success: false,
        message: "User not found" });
    });
  });

  describe("addCartItem", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/cart/items", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    it("adds a new item with a price snapshot", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getFood).mockResolvedValue(food);
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(emptyCart);

      const response = await addCartItem(
        makeRequest({ userId, foodId, quantity: 3 }),
      );

      expect(response.status).toBe(201);
      expect(CartRepository.createItem).toHaveBeenCalledWith({
        cartId,
        foodId,
        quantity: 3,
        unitPriceSnapshot: 10.5,
      });
    });

    it("increments the quantity of an existing item", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getFood).mockResolvedValue(food);
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(cartWithItem);

      const response = await addCartItem(
        makeRequest({ userId, foodId, quantity: 3 }),
      );

      expect(response.status).toBe(201);
      expect(CartRepository.updateItemQuantity).toHaveBeenCalledWith(itemId, 5);
      expect(CartRepository.createItem).not.toHaveBeenCalled();
    });

    it("returns 404 when the food does not exist", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getFood).mockResolvedValue(null);

      const response = await addCartItem(
        makeRequest({ userId, foodId, quantity: 3 }),
      );

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ 
        success: false,
        message: "Food not found" });
      expect(CartRepository.createItem).not.toHaveBeenCalled();
    });

    it("rejects a non-positive quantity", async () => {
      const response = await addCartItem(
        makeRequest({ userId, foodId, quantity: 0 }),
      );

      expect(response.status).toBe(400);
      expect(CartRepository.createItem).not.toHaveBeenCalled();
    });

    it("rejects unknown fields due to strict schema", async () => {
      const response = await addCartItem(
        makeRequest({ userId, foodId, quantity: 1, extra: true }),
      );

      expect(response.status).toBe(400);
      expect(CartRepository.createItem).not.toHaveBeenCalled();
    });
  });

  describe("updateCartItem", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/cart/items/" + itemId, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    }

    it("updates the quantity of an item in the cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(cartWithItem);

      const response = await updateCartItem(
        makeRequest({ userId, quantity: 4 }),
        itemId,
      );

      expect(response.status).toBe(200);
      expect(CartRepository.updateItemQuantity).toHaveBeenCalledWith(itemId, 4);
    });

    it("returns 404 when the item is not in the cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(emptyCart);

      const response = await updateCartItem(
        makeRequest({ userId, quantity: 4 }),
        itemId,
      );

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({ 
        success: false,
        message: "Cart item not found" });
      expect(CartRepository.updateItemQuantity).not.toHaveBeenCalled();
    });
  });

  describe("removeCartItem", () => {
    it("removes an item from the cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(cartWithItem);

      const response = await removeCartItem(itemId, userId);

      expect(response.status).toBe(200);
      expect(CartRepository.deleteItem).toHaveBeenCalledWith(itemId);
    });

    it("returns 404 when removing an item not in the cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(emptyCart);

      const response = await removeCartItem(itemId, userId);

      expect(response.status).toBe(404);
      expect(CartRepository.deleteItem).not.toHaveBeenCalled();
    });
  });

  describe("clearCart", () => {
    it("clears all items from the cart", async () => {
      vi.mocked(CartRepository.userExists).mockResolvedValue({ id: userId });
      vi.mocked(CartRepository.getByUserId).mockResolvedValue(cartWithItem);

      const response = await clearCart(userId);

      expect(response.status).toBe(200);
      expect(CartRepository.clearItems).toHaveBeenCalledWith(cartId);
    });
  });
});
