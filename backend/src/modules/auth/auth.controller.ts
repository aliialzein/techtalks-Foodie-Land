import { NextRequest, NextResponse } from "next/server";
import { loginSchema, registerSchema } from "./auth.validation";
import * as authService from "./auth.service";
import { readAccessToken } from "./token";
import { handleError, UnauthorizedError, BadRequestError  } from "@/util/errors";

export async function registerController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);
    const result = await authService.register(parsed);
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function loginController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);
    const result = await authService.login(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function logoutController() {
  const result = await authService.logout();
  return NextResponse.json(result, { status: 200 });
}

export async function meController(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Please log in");
    }
    const token = authHeader.split(" ")[1];
    const decoded = readAccessToken(token);
    const user = await authService.getMe(decoded.id);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error ) {
      // jwt.verify throws plain errors (TokenExpiredError, JsonWebTokenError),
      // not AppError — normalize them to a 401 instead of letting handleError 500 them.
      return handleError(new UnauthorizedError("Invalid or expired token"));
    }
    return handleError(err);
  }
}

export async function googleController(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.credential) {
      throw new BadRequestError("Google credential is required");
    }

    const result = await authService.googleLogin(body.credential);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}