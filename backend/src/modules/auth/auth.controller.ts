import { NextRequest, NextResponse } from "next/server";
import { loginSchema, registerSchema } from "./auth.validation";
import * as authService from "./auth.service";
import { readToken } from "./token";

export async function registerController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const result = await authService.register(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }
}

export async function loginController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const result = await authService.login(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
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
      return NextResponse.json({ message: "Please log in" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = readToken(token);
    const user = await authService.getMe(decoded.id);
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}