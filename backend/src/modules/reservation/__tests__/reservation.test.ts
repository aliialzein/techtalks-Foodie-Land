import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createReservation,
  deleteReservation,
  getReservation,
  getReservations,
  updateReservation,
} from "../reservation.controller";
import { ReservationRepository } from "../reservation.repository";

vi.mock("../reservation.repository", () => ({
  ReservationRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    userExists: vi.fn(),
    restaurantExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const reservationId = "76e8bb96-0d0e-4f8d-a33c-2d94d2a9d6d0";
const userId = "8dd5d94d-ff4d-4b4b-b19d-c6d82dcdbb74";
const restaurantId = "40db1d72-21b6-4b09-9b6b-06b2f6d17fd4";

const reservation = {
  id: reservationId,
  userId,
  restaurantId,
  dateTime: new Date("2026-07-20T18:00:00.000Z"),
  peopleCount: 4,
  status: "PENDING",
  createdAt: new Date("2026-07-01T00:00:00.000Z"),
  user: {
    id: userId,
    name: "John Doe",
  },
  restaurant: {
    id: restaurantId,
    name: "Foodie Land",
  },
};

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("reservation controller", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns all reservations", async () => {
    vi.mocked(ReservationRepository.getAll).mockResolvedValue([reservation]);

    const response = await getReservations();

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual([
      expect.objectContaining({
        id: reservationId,
      }),
    ]);
  });

  it("returns a reservation by id", async () => {
    vi.mocked(ReservationRepository.getById).mockResolvedValue(reservation);

    const response = await getReservation(reservationId);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual(
      expect.objectContaining({
        id: reservationId,
      }),
    );
  });

  it("rejects an invalid uuid", async () => {
    const response = await getReservation("not-a-uuid");

    expect(response.status).toBe(400);
    expect(ReservationRepository.getById).not.toHaveBeenCalled();
  });

  it("returns 404 when reservation is not found", async () => {
    vi.mocked(ReservationRepository.getById).mockResolvedValue(null);

    const response = await getReservation(reservationId);

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({
      error: "Reservation not found",
    });
  });

  it("returns 500 on unexpected repository error", async () => {
    vi.mocked(ReservationRepository.getAll).mockRejectedValue(
      new Error("Database failed"),
    );

    const response = await getReservations();

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({
      error: "Internal server error",
    });
  });

  describe("createReservation", () => {
    function makeRequest(body: unknown) {
      return new Request("http://localhost/api/reservations", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    it("creates a reservation", async () => {
      vi.mocked(ReservationRepository.userExists).mockResolvedValue({
        id: userId,
      });

      vi.mocked(ReservationRepository.restaurantExists).mockResolvedValue({
        id: restaurantId,
      });

      vi.mocked(ReservationRepository.create).mockResolvedValue(reservation);

      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(201);

      expect(await readJson(response)).toEqual(
        expect.objectContaining({
          id: reservationId,
        }),
      );

      expect(ReservationRepository.create).toHaveBeenCalledWith({
        userId,
        restaurantId,
        dateTime: new Date("2026-07-20T18:00:00.000Z"),
        peopleCount: 4,
      });
    });

    it("returns 404 when user does not exist", async () => {
      vi.mocked(ReservationRepository.userExists).mockResolvedValue(null);

      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({
        error: "User not found",
      });

      expect(ReservationRepository.create).not.toHaveBeenCalled();
    });

    it("returns 404 when restaurant does not exist", async () => {
      vi.mocked(ReservationRepository.userExists).mockResolvedValue({
        id: userId,
      });

      vi.mocked(ReservationRepository.restaurantExists).mockResolvedValue(null);

      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(404);
      expect(await readJson(response)).toEqual({
        error: "Restaurant not found",
      });

      expect(ReservationRepository.create).not.toHaveBeenCalled();
    });

    it("rejects invalid userId", async () => {
      const response = await createReservation(
        makeRequest({
          userId: "invalid",
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects invalid restaurantId", async () => {
      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId: "invalid",
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects invalid date", async () => {
      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "invalid-date",
          peopleCount: 4,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects peopleCount less than 1", async () => {
      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 0,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects peopleCount greater than 20", async () => {
      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 21,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects unknown fields", async () => {
      const response = await createReservation(
        makeRequest({
          userId,
          restaurantId,
          dateTime: "2026-07-20T18:00:00.000Z",
          peopleCount: 4,
          extraField: true,
        }),
      );

      expect(response.status).toBe(400);
    });

    it("rejects malformed json", async () => {
      const request = new Request("http://localhost/api/reservations", {
        method: "POST",
        body: "{bad-json",
      });

      const response = await createReservation(request);

      expect(response.status).toBe(400);
    });
  });

  it("updates a reservation", async () => {
    vi.mocked(ReservationRepository.getById).mockResolvedValue(reservation);

    vi.mocked(ReservationRepository.update).mockResolvedValue({
      ...reservation,
      status: "CONFIRMED",
    });

    const request = new Request(
      "http://localhost/api/reservations/" + reservationId,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "CONFIRMED",
        }),
      },
    );

    const response = await updateReservation(request, reservationId);

    expect(response.status).toBe(200);

    expect(ReservationRepository.update).toHaveBeenCalledWith(
      reservationId,
      {
        status: "CONFIRMED",
      },
    );
  });

  it("rejects invalid update payload", async () => {
    const request = new Request(
      "http://localhost/api/reservations/" + reservationId,
      {
        method: "PATCH",
        body: JSON.stringify({
          peopleCount: 0,
        }),
      },
    );

    const response = await updateReservation(request, reservationId);

    expect(response.status).toBe(400);
    expect(ReservationRepository.update).not.toHaveBeenCalled();
  });

  it("deletes a reservation", async () => {
    vi.mocked(ReservationRepository.getById).mockResolvedValue(reservation);

    vi.mocked(ReservationRepository.delete).mockResolvedValue(reservation);

    const response = await deleteReservation(reservationId);

    expect(response.status).toBe(200);

    expect(await readJson(response)).toEqual({
      message: "Deleted",
    });
  });

  it("returns 404 when deleting missing reservation", async () => {
    vi.mocked(ReservationRepository.getById).mockResolvedValue(null);

    const response = await deleteReservation(reservationId);

    expect(response.status).toBe(404);

    expect(ReservationRepository.delete).not.toHaveBeenCalled();
  });
});