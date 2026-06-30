import {prisma} from "@/config";
import type { CreateRestaurantInput, UpdateRestaurantInput } from "./restaurant.types";

export class RestaurantRepository {
  static getAll() {
    return prisma.restaurant.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static getById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  static ownerExists(ownerId: string) {
    return prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true },
    });
  }

  static create(data: CreateRestaurantInput) {
    return prisma.restaurant.create({
      data,
    });
  }

  static update(id: string, data: UpdateRestaurantInput) {
    return prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  static delete(id: string) {
    return prisma.restaurant.delete({
      where: { id },
    });
  }
}
