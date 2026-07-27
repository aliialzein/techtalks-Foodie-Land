import { NextRequest, NextResponse } from "next/server";
import {
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "./password-reset.validation";
import * as passwordResetService from "./password-reset.service";
import { handleError } from "@/util/errors";

export async function forgotPasswordController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.parse(body);
    const result = await passwordResetService.forgotPassword(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function verifyOtpController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.parse(body);
    const result = await passwordResetService.verifyOtp(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function resetPasswordController(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.parse(body);
    const result = await passwordResetService.resetPassword(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return handleError(err);
  }
}