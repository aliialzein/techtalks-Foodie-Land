import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  UnauthorizedError,
  TooManyRequestsError,
} from "../../util/errors";
import {
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
  ForgotPasswordResult,
  VerifyOtpResult,
  ResetPasswordResult,
} from "./password-reset.types";
import { createResetToken, readResetToken } from "../auth/token";
import * as authRepository from "../auth/auth.repository";
import * as passwordResetRepository from "./password-reset.repository";
import { AuthEmailService } from "../notifications/auth/auth-email.service";

const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

function generateOtp(): string {
  // 6-digit numeric OTP, cryptographically random
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function forgotPassword(
  data: ForgotPasswordInput
): Promise<ForgotPasswordResult> {
  const user = await authRepository.findUserByEmail(data.email);

  const GENERIC_MESSAGE = {
    message: "If an account exists for this email, an OTP has been sent.",
  };

  if (!user || !user.password) {
    return GENERIC_MESSAGE;
  }

  const existingReset = await passwordResetRepository.findLatestByUserId(
    user.id
  );

  if (existingReset) {
    const secondsSinceCreated =
      (Date.now() - existingReset.createdAt.getTime()) / 1000;

    // Still within the active TTL window AND created too recently — block resend.
    if (
      existingReset.expiresAt > new Date() &&
      secondsSinceCreated < RESEND_COOLDOWN_SECONDS
    ) {
      throw new TooManyRequestsError(
        `Please wait ${Math.ceil(
          RESEND_COOLDOWN_SECONDS - secondsSinceCreated
        )}s before requesting another OTP`
      );
    }
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await passwordResetRepository.deleteByUserId(user.id);

  await passwordResetRepository.create({
    userId: user.id,
    otpHash,
    expiresAt,
  });

  await AuthEmailService.sendPasswordResetOtp(user.email, user.name, otp);

  return GENERIC_MESSAGE;
}

export async function verifyOtp(
  data: VerifyOtpInput
): Promise<VerifyOtpResult> {
  const user = await authRepository.findUserByEmail(data.email);
  if (!user) {
    throw new UnauthorizedError("Invalid or expired OTP");
  }

  const reset = await passwordResetRepository.findLatestByUserId(user.id);
  if (!reset || reset.verified) {
    throw new UnauthorizedError("Invalid or expired OTP");
  }

  if (reset.expiresAt < new Date()) {
    await passwordResetRepository.deleteReset(reset.id);
    throw new UnauthorizedError("OTP has expired, please request a new one");
  }

  const match = await bcrypt.compare(data.otp, reset.otpHash);
  if (!match) {
    throw new UnauthorizedError("Invalid or expired OTP");
  }
  await passwordResetRepository.markVerified(reset.id);
  const resetToken = createResetToken(user.id);
  return { resetToken };
}

export async function resetPassword(
  data: ResetPasswordInput
): Promise<ResetPasswordResult> {
  let payload;
  try {
    payload = readResetToken(data.token);
  } catch {
    throw new UnauthorizedError("Invalid or expired reset token");
  }
  const reset = await passwordResetRepository.findLatestByUserId(payload.id);
  if (!reset || !reset.verified) {
    throw new UnauthorizedError("OTP verification required before reset");
  }
  if (reset.expiresAt < new Date()) {
    await passwordResetRepository.deleteReset(reset.id);
    throw new UnauthorizedError("Reset session expired, please start again");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await authRepository.updatePassword(payload.id, hashedPassword);
  await passwordResetRepository.deleteByUserId(payload.id);
  const user = await authRepository.findUserById(payload.id);
  if (user) {
    await AuthEmailService.sendPasswordChanged(user.email, user.name);
  }
  return { message: "Password has been reset successfully" };
}