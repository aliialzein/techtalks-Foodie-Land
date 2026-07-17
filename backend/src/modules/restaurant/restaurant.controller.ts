import type { NextRequest } from "next/server";
import { ForbiddenError, handleError, jsonResponse, UnauthorizedError } from "../../util/errors";
import { readToken } from "../auth/token";
import { RestaurantService } from "./restaurant.service";
import {
  createRestaurantSchema,
  ownerIdSchema,
  restaurantIdSchema,
  updateRestaurantSchema,
} from "./restaurant.validation";

function getAuthenticatedUser(req?: NextRequest | Request) {
  if (!req || typeof req !== "object" || !("headers" in req)) {
    return null;
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return readToken(token);
  } catch {
    return null;
  }
}

function requireAdminUser(req?: NextRequest | Request) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    throw new UnauthorizedError("Please log in");
  }

  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Only admins can perform this action");
  }

  return user;
}

export async function getRestaurants(ownerId?: string) {
  try {
    const filterOwnerId = ownerId ? ownerIdSchema.parse(ownerId) : undefined;
    const data = await RestaurantService.getAll(filterOwnerId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getPendingRestaurants(req?: NextRequest | Request) {
  try {
    requireAdminUser(req);

    const data = await RestaurantService.getPending();
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    const data = await RestaurantService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function createRestaurant(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const bodyRecord =
      body && typeof body === "object"
        ? body as Record<string, unknown>
        : {};
    const sanitizedBody = Object.fromEntries(
      Object.entries(bodyRecord).filter(
        ([key]) =>
          ![
            "status",
            "rejectionReason",
            "isActive",
          ].includes(key)
      )
    );
    const payload = createRestaurantSchema.parse(sanitizedBody);
    const data = await RestaurantService.create(payload);
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
  }
}

export async function deleteRestaurant(id: string) {
  try {
    const parsedId = restaurantIdSchema.parse(id);
    await RestaurantService.delete(parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function approveRestaurant(
  reqOrId: string | NextRequest | Request,
  maybeId?: string,
) {
  try {
    const id = typeof reqOrId === "string" ? reqOrId : maybeId;
    const parsedId = restaurantIdSchema.parse(id);
    const req = typeof reqOrId === "string" ? undefined : reqOrId;
    requireAdminUser(req);

    const data = await RestaurantService.approve(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function rejectRestaurant(
  reqOrId: string | NextRequest | Request,
  maybeIdOrBody?: string | unknown,
  body?: unknown,
) {
  try {
    const id = typeof reqOrId === "string" ? reqOrId : (typeof maybeIdOrBody === "string" ? maybeIdOrBody : undefined);
    const parsedId = restaurantIdSchema.parse(id);
    const req = typeof reqOrId === "string" ? undefined : reqOrId;
    requireAdminUser(req);
    const payload = body ?? (typeof maybeIdOrBody === "object" && maybeIdOrBody !== null ? { rejectionReason: (maybeIdOrBody as { rejectionReason?: string }).rejectionReason } : {});

    const data = await RestaurantService.reject(parsedId, payload);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}
