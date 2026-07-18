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
import { RestaurantEmailService } from "@/modules/notifications/restaurant/restaurant-email.service";
import logger from "@/util/logger";

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
    const owner = await RestaurantRepository.getOwner(payload.ownerId);

    if (!owner) {
      throw new NotFoundError("Owner", payload.ownerId);
    }

    const restaurant = await RestaurantRepository.create({
      ownerId: payload.ownerId,
      name: payload.name,
      description: payload.description,
      status: RestaurantStatus.PENDING,
      rejectionReason: null,
    });
    const admins = await RestaurantRepository.getAdmins();

    const results = await Promise.allSettled([
      RestaurantEmailService.sendRegistrationReceived(
        owner.email,
        owner.name,
        restaurant.name,
      ),
      ...admins.map((admin) =>
        RestaurantEmailService.sendNewRegistrationToAdmin(
          admin.email,
          admin.name,
          restaurant.name,
          owner.name,
          owner.email,
        ),
      ),
    ]);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        logger.error(`Email task ${index} failed`, {
          error: result.reason,
        });
      }
    });

    return restaurant;
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
    const restaurant = await RestaurantRepository.approve(id);
    await RestaurantEmailService.sendApproved(
      restaurant.owner.email,
      restaurant.owner.name,
      restaurant.name,
    );
    return restaurant;
  }

  static async reject(id: string, payload: RejectRestaurantInput): Promise<Restaurant> {
    const restaurant = await RestaurantRepository.reject(id, payload);
    await RestaurantEmailService.sendRejected(
      restaurant.owner.email,
      restaurant.owner.name,
      restaurant.name,
      restaurant.rejectionReason,
    );
    return restaurant;
  }

}
