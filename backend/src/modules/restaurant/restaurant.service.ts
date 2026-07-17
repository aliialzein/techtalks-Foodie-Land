import { RestaurantStatus } from "@/generated/prisma";
import type { Restaurant } from "@/generated/prisma";
import { NotFoundError } from "../../util/errors";
import { RestaurantRepository } from "./restaurant.repository";
import type {
  CreateRestaurantInput,
  RejectRestaurantInput,
  RestaurantWithOwner,
  UpdateRestaurantInput,
} from "./restaurant.types";

export class RestaurantService {
  static getAll(ownerId?: string): Promise<RestaurantWithOwner[]> {
    return RestaurantRepository.getAll(ownerId);
  }

  static async getById(id: string): Promise<Restaurant> {
    const restaurant = await RestaurantRepository.getById(id);

    if (!restaurant) {
      throw new NotFoundError("Restaurant", id);
    }

    return restaurant;
  }

  static async create(payload: CreateRestaurantInput): Promise<Restaurant> {
    const owner = await RestaurantRepository.ownerExists(payload.ownerId);

    if (!owner) {
      throw new NotFoundError("Owner", payload.ownerId);
    }

    return RestaurantRepository.create({
      ownerId: payload.ownerId,
      name: payload.name,
      description: payload.description,
      status: RestaurantStatus.PENDING,
      rejectionReason: null,
    });
  }

  static getPending(): Promise<RestaurantWithOwner[]> {
    return RestaurantRepository.getPending();
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

  static async approve(id: string): Promise<Restaurant> {
    await this.getById(id);
    return RestaurantRepository.approve(id);
  }

  static async reject(id: string, payload: RejectRestaurantInput): Promise<Restaurant> {
    await this.getById(id);
    return RestaurantRepository.reject(id, payload);
  }
}
