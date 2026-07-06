import { prisma } from "@/config";
import type {
  CreateReservationInput,
  UpdateReservationInput,
} from "./reservation.types";

export class ReservationRepository {
  static getAll() {
    return prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static getById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
    });
  }

  static userExists(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  static restaurantExists(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  static create(data: CreateReservationInput) {
    return prisma.reservation.create({
      data,
    });
  }

  static update(id: string, data: UpdateReservationInput) {
    return prisma.reservation.update({
      where: { id },
      data,
    });
  }

  static delete(id: string) {
    return prisma.reservation.delete({
      where: { id },
    });
  }
}