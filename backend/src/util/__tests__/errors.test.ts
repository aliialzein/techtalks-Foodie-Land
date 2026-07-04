import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  handleError,
  jsonResponse,
} from "../errors";

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

describe("error classes", () => {
  it("NotFoundError exposes a clean public message but keeps the id internally", () => {
    const error = new NotFoundError("Order", "abc-123");

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(404);
    expect(error.publicMessage).toBe("Order not found");
    expect(error.message).toBe("Order not found: abc-123");
    expect(error.name).toBe("NotFoundError");
  });

  it("NotFoundError works without an id", () => {
    const error = new NotFoundError("User");

    expect(error.publicMessage).toBe("User not found");
    expect(error.message).toBe("User not found");
  });

  it("maps each semantic error to its status code", () => {
    expect(new BadRequestError("bad").statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ConflictError("nope").statusCode).toBe(409);
  });
});

describe("handleError", () => {
  it("maps a ZodError to 400 with issues", async () => {
    const result = z.string().uuid().safeParse("not-a-uuid");
    const response = handleError(result.success ? null : result.error);

    expect(response.status).toBe(400);
    const body = (await readJson(response)) as {
      error: string;
      issues: unknown[];
    };
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.issues)).toBe(true);
  });

  it("maps a SyntaxError (malformed JSON) to 400", async () => {
    const response = handleError(new SyntaxError("Unexpected token"));

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({ error: "Validation failed" });
  });

  it("maps an AppError to its status code and public message", async () => {
    const response = handleError(new NotFoundError("Order", "abc-123"));

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Order not found" });
  });

  it("maps a ConflictError to 409 with its detailed message", async () => {
    const response = handleError(
      new ConflictError("Cannot transition from A to B"),
    );

    expect(response.status).toBe(409);
    expect(await readJson(response)).toEqual({
      error: "Cannot transition from A to B",
    });
  });

  it("masks an unexpected Error behind a generic 500", async () => {
    const response = handleError(new Error("database connection lost"));

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({ error: "Internal server error" });
  });

  it("does not crash on a non-Error thrown value", async () => {
    const response = handleError("a plain string was thrown");

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({ error: "Internal server error" });
  });

  it("does not crash on null/undefined thrown values", async () => {
    expect(handleError(null).status).toBe(500);
    expect(handleError(undefined).status).toBe(500);
  });
});

describe("jsonResponse", () => {
  it("serializes the body with the given status", async () => {
    const response = jsonResponse({ ok: true }, 201);

    expect(response.status).toBe(201);
    expect(await readJson(response)).toEqual({ ok: true });
  });
});
