import type { Reservation } from "@/generated/prisma";
import { NotFoundError } from "../../util/errors";
import { ReservationRepository } from "./reservation.repository";
import type { CreateReservationInput, ReservationWithRelations, ReservationWithEmailRelations, UpdateReservationInput} from "./reservation.types";
import { ReservationEmailService } from "@/modules/notifications/reservation/reservation-email.service";

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

  static async create(payload: CreateReservationInput): Promise<ReservationWithEmailRelations> {
    
    const user = await ReservationRepository.getUser(payload.userId);
    if (!user) {
      throw new NotFoundError(
        "User",
        payload.userId,
      );
    }

    const restaurant = await ReservationRepository.getRestaurant(payload.restaurantId);
    if (!restaurant) {
      throw new NotFoundError("Restaurant", payload.restaurantId);
    }

    const reservation = await ReservationRepository.create(payload);

    await ReservationEmailService.sendSubmitted(
        reservation.user.email,
        reservation.user.name,
        reservation.restaurant.name,
        reservation.dateTime,
        reservation.peopleCount,
    );

    await ReservationEmailService.sendNewRequest(
        reservation.restaurant.owner.email,
        reservation.restaurant.name,
        reservation.user.name,
        reservation.user.email,
        reservation.dateTime,
        reservation.peopleCount,
    );

    return reservation;
  }

  static async update(
    id: string,
    payload: UpdateReservationInput,
  ): Promise<Reservation> {
    await this.getById(id);

    return ReservationRepository.update(id, payload);
  }

  static async cancel(
    id:string,
  ): Promise<ReservationWithEmailRelations>{

    const reservation =
      await ReservationRepository.cancel(id);


    await ReservationEmailService.sendCancelled(
      reservation.user.email,
      reservation.user.name,
      reservation.restaurant.name,
    );


    return reservation;
  }

  static async confirm(id:string ):Promise<ReservationWithEmailRelations>{
    const reservation = await ReservationRepository.confirm(id);

    await ReservationEmailService.sendConfirmed(
        reservation.user.email,
        reservation.user.name,
        reservation.restaurant.name,
        reservation.dateTime,
        reservation.peopleCount,
    );
    return reservation;
  }

  static async delete(id: string): Promise<Reservation> {
    await this.getById(id);

    return ReservationRepository.delete(id);
  }
}