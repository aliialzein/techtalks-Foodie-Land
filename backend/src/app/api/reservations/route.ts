import {createReservation, getReservations} from "@/modules/reservation/reservation.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getReservations();
}

export async function POST(req: Request) {
  return createReservation(req);
}