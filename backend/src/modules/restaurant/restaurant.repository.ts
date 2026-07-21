import {prisma} from "@/config";
import { RestaurantStatus } from "@/generated/prisma";
import type { RejectRestaurantInput, RestaurantCreateData, UpdateRestaurantInput } from "./restaurant.types";

export class RestaurantRepository {
  static getAll(ownerId?: string) {
    return prisma.restaurant.findMany({
      where: ownerId ? { ownerId } : undefined,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static getById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  static getPending() {
    return prisma.restaurant.findMany({
      where: { status: RestaurantStatus.PENDING },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static getOwner(ownerId: string) {
    return prisma.user.findUnique({
      where: {
        id: ownerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  static create(data: RestaurantCreateData) {
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

  static approve(id: string) {
    return prisma.restaurant.update({
      where: { id },
      data: {
        status: RestaurantStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: null,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static reject(id: string, data: RejectRestaurantInput) {
    return prisma.restaurant.update({
      where: { id },
      data: {
        status: RestaurantStatus.REJECTED,
        approvedAt: null,
        approvedBy: null,
        rejectionReason: data.rejectionReason ?? null,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
  static getAdmins() {
    return prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        name: true,
        email: true,
      },
    });
  }
}
