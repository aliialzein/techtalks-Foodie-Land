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

  static getUser(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  static getRestaurant(id: string) {
    return prisma.restaurant.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      }
    });
  }

  static create(data: CreateReservationInput) {
    return prisma.reservation.create({
      data,
      include: {
        user: {
          select:{
            name:true,
            email:true,
          },
        },
        restaurant:{
          select:{
            name:true,
          },
        },
      },
    });
  }

  static update(id: string, data: UpdateReservationInput) {
    return prisma.reservation.update({
      where: { id },
      data,
    });
  }
  static cancel(id: string) {
    return prisma.reservation.update({
      where:{
        id,
      },
      data:{
        status:"CANCELLED",
      },
      include:{
        user:{
          select:{
            name:true,
            email:true,
          },
        },
        restaurant:{
          select:{
            name:true,
          },
        },
      },
    });
  }

  static confirm(id:string){
    return prisma.reservation.update({
      where:{
        id,
      },
      data:{
        status:"CONFIRMED",
      },
      include:{
        user:{
          select:{
            name:true,
            email:true,
          }
        },
        restaurant:{
          select:{
            name:true,
          }
        }
      }
    })

  }

  static delete(id: string) {
    return prisma.reservation.delete({
      where: { id },
    });
  }
}