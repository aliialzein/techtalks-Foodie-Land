import type { NextRequest } from "next/server";
import { handleError, jsonResponse } from "../../util/errors";
import { ReservationService } from "./reservation.service";
import {
  createReservationSchema,
  reservationIdSchema,
  updateReservationSchema,
} from "./reservation.validation";

export async function getReservations() {
  try {
    const data = await ReservationService.getAll();
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function getReservation(id: string) {
  try {
    const parsedId = reservationIdSchema.parse(id);
    const data = await ReservationService.getById(parsedId);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function createReservation(req: NextRequest | Request) {
  try {
    const body: unknown = await req.json();
    const payload = createReservationSchema.parse(body);
    const data = await ReservationService.create(payload);
    return jsonResponse(data, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateReservation(
  req: NextRequest | Request,
  id: string,
) {
  try {
    const parsedId = reservationIdSchema.parse(id);
    const body: unknown = await req.json();
    const payload = updateReservationSchema.parse(body);
    const data = await ReservationService.update(parsedId, payload);
    return jsonResponse(data, 200);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteReservation(id: string) {
  try {
    const parsedId = reservationIdSchema.parse(id);
    await ReservationService.delete(parsedId);
    return jsonResponse({ message: "Deleted" }, 200);
  } catch (error) {
    return handleError(error);
  }
}