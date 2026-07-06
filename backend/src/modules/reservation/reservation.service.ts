import type { Reservation } from "@/generated/prisma";
import { NotFoundError } from "../../util/errors";
import { ReservationRepository } from "./reservation.repository";
import type {
  CreateReservationInput,
  ReservationWithRelations,
  UpdateReservationInput,
} from "./reservation.types";

export class ReservationService {
  static getAll(): Promise<ReservationWithRelations[]> {
    return ReservationRepository.getAll();
  }

  static async getById(id: string): Promise<Reservation> {
    const reservation = await ReservationRepository.getById(id);

    if (!reservation) {
      throw new NotFoundError("Reservation", id);
    }

    return reservation;
  }

  static async create(
    payload: CreateReservationInput,
  ): Promise<Reservation> {
    const user = await ReservationRepository.userExists(payload.userId);

    if (!user) {
      throw new NotFoundError("User", payload.userId);
    }

    const restaurant = await ReservationRepository.restaurantExists(
      payload.restaurantId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant", payload.restaurantId);
    }

    return ReservationRepository.create(payload);
  }

  static async update(
    id: string,
    payload: UpdateReservationInput,
  ): Promise<Reservation> {
    await this.getById(id);

    return ReservationRepository.update(id, payload);
  }

  static async delete(id: string): Promise<Reservation> {
    await this.getById(id);

    return ReservationRepository.delete(id);
  }
}