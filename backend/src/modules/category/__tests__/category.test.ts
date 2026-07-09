import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../category.controller";

import { CategoryRepository } from "../category.repository";

vi.mock("../category.repository", () => ({
  CategoryRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    restaurantExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const categoryId = "3f7a58b8-9e35-4d2a-958f-a079caec62d3";
const restaurantId = "b78d94a4-5e44-4e47-9c87-5860a9959145";

const category = {
  id: categoryId,
  restaurantId,
  name: "Pizza",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  restaurant: {
    id: restaurantId,
    name: "Foodie Land",
  },
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("category controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all categories", async () => {
    vi.mocked(CategoryRepository.getAll).mockResolvedValue([category]);

    const response = await getCategories();

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({
        id: categoryId,
      }),
    ]);
  });

  it("returns category by id", async () => {
    vi.mocked(CategoryRepository.getById).mockResolvedValue(category);

    const response = await getCategory(categoryId);

    expect(response.status).toBe(200);

    expect(await readJson(response)).toEqual(
      expect.objectContaining({
        id: categoryId,
      }),
    );
  });

  it("rejects invalid uuid", async () => {
    const response = await getCategory("not-a-uuid");

    expect(response.status).toBe(400);

    expect(CategoryRepository.getById).not.toHaveBeenCalled();
  });

  it("returns 404 when category not found", async () => {
    vi.mocked(CategoryRepository.getById).mockResolvedValue(null);

    const response = await getCategory(categoryId);

    expect(response.status).toBe(404);

    expect(await readJson(response)).toEqual({
      error: "Category not found",
    });
  });

  it("returns 500 when repository throws", async () => {
    vi.mocked(CategoryRepository.getAll).mockRejectedValue(
      new Error("database offline"),
    );

    const response = await getCategories();

    expect(response.status).toBe(500);

    expect(await readJson(response)).toEqual({
      error: "Internal server error",
    });
  });

  describe("createCategory", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/categories", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    it("creates a category", async () => {
      vi.mocked(CategoryRepository.restaurantExists).mockResolvedValue({
        id: restaurantId,
      });

      vi.mocked(CategoryRepository.create).mockResolvedValue(category);

      const request = makeRequest({
        restaurantId,
        name: "Pizza",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(201);

      expect(await readJson(response)).toEqual(
        expect.objectContaining({
          id: categoryId,
        }),
      );

      expect(CategoryRepository.create).toHaveBeenCalledWith({
        restaurantId,
        name: "Pizza",
      });
    });

    it("returns 404 when restaurant does not exist", async () => {
      vi.mocked(CategoryRepository.restaurantExists).mockResolvedValue(null);

      const request = makeRequest({
        restaurantId,
        name: "Pizza",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(404);

      expect(await readJson(response)).toEqual({
        error: "Restaurant not found",
      });

      expect(CategoryRepository.create).not.toHaveBeenCalled();
    });

    it("rejects missing restaurantId", async () => {
      const request = makeRequest({
        name: "Pizza",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);

      expect(CategoryRepository.create).not.toHaveBeenCalled();
    });

    it("rejects invalid restaurant uuid", async () => {
      const request = makeRequest({
        restaurantId: "bad-id",
        name: "Pizza",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);

      expect(CategoryRepository.create).not.toHaveBeenCalled();
    });

    it("rejects short name", async () => {
      const request = makeRequest({
        restaurantId,
        name: "A",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);
    });

    it("rejects long name", async () => {
      const request = makeRequest({
        restaurantId,
        name: "A".repeat(101),
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);
    });

    it("rejects unknown fields", async () => {
      const request = makeRequest({
        restaurantId,
        name: "Pizza",
        extra: true,
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);

      expect(CategoryRepository.create).not.toHaveBeenCalled();
    });

    it("rejects malformed json", async () => {
      const request = new Request("http://localhost/api/categories", {
        method: "POST",
        body: "{bad-json",
      });

      const response = await createCategory(request);

      expect(response.status).toBe(400);

      expect(CategoryRepository.create).not.toHaveBeenCalled();
    });
  });

  it("updates category", async () => {
    vi.mocked(CategoryRepository.getById).mockResolvedValue(category);

    vi.mocked(CategoryRepository.update).mockResolvedValue({
      ...category,
      name: "Drinks",
    });

    const request = new Request(
      "http://localhost/api/categories/" + categoryId,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: "Drinks",
        }),
      },
    );

    const response = await updateCategory(request, categoryId);

    expect(response.status).toBe(200);

    expect(CategoryRepository.update).toHaveBeenCalledWith(
      categoryId,
      {
        name: "Drinks",
      },
    );
  });

  it("rejects invalid update payload", async () => {
    const request = new Request(
      "http://localhost/api/categories/" + categoryId,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: "A",
        }),
      },
    );

    const response = await updateCategory(request, categoryId);

    expect(response.status).toBe(400);

    expect(CategoryRepository.update).not.toHaveBeenCalled();
  });

  it("deletes category", async () => {
    vi.mocked(CategoryRepository.getById).mockResolvedValue(category);

    vi.mocked(CategoryRepository.delete).mockResolvedValue(category);

    const response = await deleteCategory(categoryId);

    expect(response.status).toBe(200);

    expect(await readJson(response)).toEqual({
      message: "Deleted",
    });
  });

  it("returns 404 when deleting missing category", async () => {
    vi.mocked(CategoryRepository.getById).mockResolvedValue(null);

    const response = await deleteCategory(categoryId);

    expect(response.status).toBe(404);

    expect(CategoryRepository.delete).not.toHaveBeenCalled();
  });
});