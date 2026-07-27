import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../password-reset.service";
import * as authRepository from "../../auth/auth.repository";
import * as passwordResetRepository from "../password-reset.repository";
import { AuthEmailService } from "../../notifications/auth/auth-email.service";
import { createResetToken, readResetToken } from "../../auth/token";
import { UnauthorizedError, TooManyRequestsError } from "../../../util/errors";

vi.mock("../../auth/auth.repository");
vi.mock("../password-reset.repository");
vi.mock("../../notifications/auth/auth-email.service");
vi.mock("../../auth/token");

const mockUser = {
  id: "user-1",
  name: "Ali",
  email: "ali@example.com",
  password: "hashed-password",
  role: "CUSTOMER" as const,
  createdAt: new Date(),
};

describe("password-reset.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // ---------------------------------------------------------------------
  // forgotPassword
  // ---------------------------------------------------------------------
  describe("forgotPassword", () => {
    it("returns the generic message and sends an OTP email for an existing local user", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue(null);
      vi.mocked(passwordResetRepository.create).mockResolvedValue({} as any);

      const result = await forgotPassword({ email: mockUser.email });

      expect(result.message).toMatch(/if an account exists/i);
      expect(passwordResetRepository.deleteByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(passwordResetRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUser.id })
      );
      expect(AuthEmailService.sendPasswordResetOtp).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        expect.stringMatching(/^\d{6}$/)
      );
    });

    it("returns the generic message without sending an email when the user does not exist", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);

      const result = await forgotPassword({ email: "nobody@example.com" });

      expect(result.message).toMatch(/if an account exists/i);
      expect(AuthEmailService.sendPasswordResetOtp).not.toHaveBeenCalled();
      expect(passwordResetRepository.create).not.toHaveBeenCalled();
    });

    it("returns the generic message without sending an email for Google-only accounts", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
        ...mockUser,
        password: null,
      } as any);

      const result = await forgotPassword({ email: mockUser.email });

      expect(result.message).toMatch(/if an account exists/i);
      expect(AuthEmailService.sendPasswordResetOtp).not.toHaveBeenCalled();
    });

    it("throws TooManyRequestsError when a valid OTP was created less than 60s ago", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        userId: mockUser.id,
        otpHash: "hash",
        verified: false,
        createdAt: new Date(Date.now() - 10 * 1000), // 10s ago
        expiresAt: new Date(Date.now() + 9 * 60 * 1000), // still valid
      } as any);

      await expect(forgotPassword({ email: mockUser.email })).rejects.toThrow(
        TooManyRequestsError
      );
      expect(passwordResetRepository.create).not.toHaveBeenCalled();
    });

    it("allows a resend once the cooldown window has passed, even if the OTP is still valid", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        userId: mockUser.id,
        otpHash: "hash",
        verified: false,
        createdAt: new Date(Date.now() - 90 * 1000), // 90s ago, cooldown passed
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      } as any);
      vi.mocked(passwordResetRepository.create).mockResolvedValue({} as any);

      const result = await forgotPassword({ email: mockUser.email });

      expect(result.message).toMatch(/if an account exists/i);
      expect(passwordResetRepository.create).toHaveBeenCalled();
    });

    it("allows a resend once the previous OTP has expired, regardless of cooldown", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        userId: mockUser.id,
        otpHash: "hash",
        verified: false,
        createdAt: new Date(Date.now() - 5 * 1000), // just created
        expiresAt: new Date(Date.now() - 1000), // already expired
      } as any);
      vi.mocked(passwordResetRepository.create).mockResolvedValue({} as any);

      const result = await forgotPassword({ email: mockUser.email });

      expect(result.message).toMatch(/if an account exists/i);
      expect(passwordResetRepository.create).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------
  // verifyOtp
  // ---------------------------------------------------------------------
  describe("verifyOtp", () => {
    it("verifies a correct OTP and returns a reset token", async () => {
      const otp = "123456";
      const otpHash = await bcrypt.hash(otp, 10);

      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        userId: mockUser.id,
        otpHash,
        verified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      } as any);
      vi.mocked(passwordResetRepository.markVerified).mockResolvedValue({} as any);
      vi.mocked(createResetToken).mockReturnValue("mock-reset-token");

      const result = await verifyOtp({ email: mockUser.email, otp });

      expect(passwordResetRepository.markVerified).toHaveBeenCalledWith("reset-1");
      expect(createResetToken).toHaveBeenCalledWith(mockUser.id);
      expect(result.resetToken).toBe("mock-reset-token");
    });

    it("rejects when the user does not exist", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);

      await expect(
        verifyOtp({ email: "nobody@example.com", otp: "123456" })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("rejects when there is no outstanding reset row", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue(null);

      await expect(
        verifyOtp({ email: mockUser.email, otp: "123456" })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("rejects when the reset row was already verified", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: true,
        otpHash: "hash",
        expiresAt: new Date(Date.now() + 60 * 1000),
      } as any);

      await expect(
        verifyOtp({ email: mockUser.email, otp: "123456" })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("rejects and deletes the row when the OTP has expired", async () => {
      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: false,
        otpHash: "hash",
        expiresAt: new Date(Date.now() - 1000),
      } as any);

      await expect(
        verifyOtp({ email: mockUser.email, otp: "123456" })
      ).rejects.toThrow(UnauthorizedError);
      expect(passwordResetRepository.deleteReset).toHaveBeenCalledWith("reset-1");
    });

    it("rejects when the OTP does not match the stored hash", async () => {
      const otpHash = await bcrypt.hash("999999", 10);

      vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: false,
        otpHash,
        expiresAt: new Date(Date.now() + 60 * 1000),
      } as any);

      await expect(
        verifyOtp({ email: mockUser.email, otp: "123456" })
      ).rejects.toThrow(UnauthorizedError);
      expect(passwordResetRepository.markVerified).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------
  // resetPassword
  // ---------------------------------------------------------------------
  describe("resetPassword", () => {
    it("updates the password, clears reset rows, and sends the confirmation email", async () => {
      vi.mocked(readResetToken).mockReturnValue({
        id: mockUser.id,
        type: "PASSWORD_RESET",
      } as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: true,
        expiresAt: new Date(Date.now() + 60 * 1000),
      } as any);
      vi.mocked(authRepository.updatePassword).mockResolvedValue({} as any);
      vi.mocked(authRepository.findUserById).mockResolvedValue(mockUser as any);

      const result = await resetPassword({
        token: "valid-token",
        password: "NewPassword123",
      });

      expect(authRepository.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String)
      );
      expect(passwordResetRepository.deleteByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(AuthEmailService.sendPasswordChanged).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name
      );
      expect(result.message).toMatch(/reset successfully/i);
    });

    it("rejects an invalid or malformed token", async () => {
      vi.mocked(readResetToken).mockImplementation(() => {
        throw new Error("invalid token");
      });

      await expect(
        resetPassword({ token: "garbage", password: "NewPassword123" })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("rejects when the OTP was never verified", async () => {
      vi.mocked(readResetToken).mockReturnValue({
        id: mockUser.id,
        type: "PASSWORD_RESET",
      } as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: false,
        expiresAt: new Date(Date.now() + 60 * 1000),
      } as any);

      await expect(
        resetPassword({ token: "valid-token", password: "NewPassword123" })
      ).rejects.toThrow(UnauthorizedError);
      expect(authRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("rejects and cleans up when the reset session has expired", async () => {
      vi.mocked(readResetToken).mockReturnValue({
        id: mockUser.id,
        type: "PASSWORD_RESET",
      } as any);
      vi.mocked(passwordResetRepository.findLatestByUserId).mockResolvedValue({
        id: "reset-1",
        verified: true,
        expiresAt: new Date(Date.now() - 1000),
      } as any);

      await expect(
        resetPassword({ token: "valid-token", password: "NewPassword123" })
      ).rejects.toThrow(UnauthorizedError);
      expect(passwordResetRepository.deleteReset).toHaveBeenCalledWith("reset-1");
      expect(authRepository.updatePassword).not.toHaveBeenCalled();
    });
  });
});