import type { Prisma, Reservation } from "@/generated/prisma";

export type ReservationWithRelations = Prisma.ReservationGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
      };
    };
    restaurant: {
      select: {
        name: true;
        owner: {
          select: {
            name: true;
            email: true;
          };
        };
      };
    };
  };
}>;

export type CreateReservationInput = {
  userId: string;
  restaurantId: string;
  dateTime: Date;
  peopleCount: number;
};

export type UpdateReservationInput = Partial<
  Pick<Reservation, "status" | "dateTime" | "peopleCount">
>;

export type ReservationWithEmailRelations =
  Prisma.ReservationGetPayload<{
    include: {
      user: {
        select: {
          name: true;
          email: true;
        };
      };
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>;