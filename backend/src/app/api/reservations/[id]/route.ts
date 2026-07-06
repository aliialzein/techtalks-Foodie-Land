import {
  deleteReservation,
  getReservation,
  updateReservation,
} from "@/modules/reservation/reservation.controller";

export const dynamic = "force-dynamic";

type ReservationRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  ctx: ReservationRouteContext,
) {
  const { id } = await ctx.params;
  return getReservation(id);
}

export async function PATCH(
  req: Request,
  ctx: ReservationRouteContext,
) {
  const { id } = await ctx.params;
  return updateReservation(req, id);
}

export async function DELETE(
  _req: Request,
  ctx: ReservationRouteContext,
) {
  const { id } = await ctx.params;
  return deleteReservation(id);
}