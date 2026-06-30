import type { Restaurant } from "@prisma/client";
import { RestaurantRepository } from "./restaurant.repository";
import type {
  CreateRestaurantInput,
  RestaurantWithOwner,
  UpdateRestaurantInput,
} from "./restaurant.types";

export class RestaurantNotFoundError extends Error {
  constructor(id: string) {
    super(`Restaurant not found: ${id}`);
    this.name = "RestaurantNotFoundError";
  }
}

export class OwnerNotFoundError extends Error {
  constructor(id: string) {
    super(`Owner not found: ${id}`);
    this.name = "OwnerNotFoundError";
  }
}

export class RestaurantService {
  static getAll(): Promise<RestaurantWithOwner[]> {
    return RestaurantRepository.getAll();
  }

  static async getById(id: string): Promise<Restaurant> {
    const restaurant = await RestaurantRepository.getById(id);

    if (!restaurant) {
      throw new RestaurantNotFoundError(id);
    }

    return restaurant;
  }

  static async create(payload: CreateRestaurantInput): Promise<Restaurant> {
    const owner = await RestaurantRepository.ownerExists(payload.ownerId);

    if (!owner) {
      throw new OwnerNotFoundError(payload.ownerId);
    }

    return RestaurantRepository.create(payload);
  }

  static async update(
    id: string,
    payload: UpdateRestaurantInput,
  ): Promise<Restaurant> {
    await this.getById(id);
    return RestaurantRepository.update(id, payload);
  }

  static async delete(id: string): Promise<Restaurant> {
    await this.getById(id);
    return RestaurantRepository.delete(id);
  }
}
