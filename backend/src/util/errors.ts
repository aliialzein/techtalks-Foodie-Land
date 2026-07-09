import { ZodError } from "zod";

/**
 * Base class for every expected/operational error in the application.
 *
 * It carries the HTTP `statusCode` to respond with and a client-safe
 * `publicMessage`, so the central {@link handleError} mapper can turn any
 * thrown `AppError` into a structured HTTP response instead of letting the
 * exception bubble up and crash the request.
 *
 * `message` (the standard `Error.message`) keeps the detailed/internal text
 * for logging, while `publicMessage` is what is exposed to the client.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly publicMessage: string;

  constructor(params: {
    statusCode: number;
    message: string;
    publicMessage?: string;
  }) {
    super(params.message);
    this.name = new.target.name;
    this.statusCode = params.statusCode;
    this.publicMessage = params.publicMessage ?? params.message;
    // Keep the prototype chain intact so `instanceof` stays reliable
    // regardless of the compilation target.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super({ statusCode: 400, message });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({ statusCode: 401, message });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super({ statusCode: 403, message });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super({
      statusCode: 404,
      message: id ? `${resource} not found: ${id}` : `${resource} not found`,
      publicMessage: `${resource} not found`,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({ statusCode: 409, message });
  }
}

export function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

/**
 * Central error → HTTP `Response` mapper.
 *
 * Every controller funnels its `catch` block through this function, which is
 * what guarantees a route always returns a structured response instead of
 * throwing an unhandled exception (the thing that would otherwise crash the
 * request). Unknown errors are deliberately masked behind a generic 500 so
 * internal details are never leaked to the client.
 */
export function handleError(error: unknown): Response {
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return jsonResponse(
      {
        error: "Validation failed",
        issues: error instanceof ZodError ? error.issues : undefined,
      },
      400,
    );
  }

  if (error instanceof AppError) {
    return jsonResponse({ error: error.publicMessage }, error.statusCode);
  }

  return jsonResponse({ error: "Internal server error" }, 500);
}
