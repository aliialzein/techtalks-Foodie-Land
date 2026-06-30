import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  OwnerNotFoundError,
  RestaurantNotFoundError,
  RestaurantService,
} from "./restaurant.service";
import {
  createRestaurantSchema,
  restaurantIdSchema,
  updateRestaurantSchema,
} from "./restaurant.validation";

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

function errorResponse(error: unknown) {
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return jsonResponse(
      {
        error: "Validation failed",
        issues: error instanceof ZodError ? error.issues : undefined,
      },
      400,
    );
  }

  if (error instanceof RestaurantNotFoundError) {
    return jsonResponse({ error: "Restaurant not found" }, 404);
  }

  if (error instanceof OwnerNotFoundError) {
    return jsonResponse({ error: "Owner not found" }, 404);
  }

  return jsonResponse({ error: "Internal server error" }, 500);
}

export async function getRestaurants() {
  try {
    const data = await RestaurantService.getAll();
    return jsonResponse(data, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function getRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    const data = await RestaurantService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function createRestaurant(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const payload = createRestaurantSchema.parse(body);
    const data = await RestaurantService.create(payload);
    return jsonResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function updateRestaurant(req: NextRequest | Request, id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    const body: unknown = await req.json();
    const payload = updateRestaurantSchema.parse(body);
    const data = await RestaurantService.update(parsedId, payload);
    return jsonResponse(data, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function deleteRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    await RestaurantService.delete(parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
