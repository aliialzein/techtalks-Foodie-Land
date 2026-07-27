import { describe, it, expect, beforeEach, vi } from "vitest";

import bcrypt from "bcryptjs";

import * as authRepository from "../auth.repository";
import * as googleService from "../google.service";
import { createAccessToken  } from "../token";

import {
  register,
  login,
  googleLogin,
} from "../auth.service";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../auth.repository", () => ({
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
  updateGoogleAccount: vi.fn(),
  findUserById: vi.fn(),
}));


vi.mock("../google.service", () => ({
  verifyGoogleToken: vi.fn(),
}));

vi.mock("../token", () => ({
  createAccessToken : vi.fn(),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("creates a new customer account", async () => {
      // Arrange
      vi.mocked(authRepository.findUserByEmail)
        .mockResolvedValue(null);
      vi.mocked(bcrypt.hash)
        .mockResolvedValue(
          "hashed-password" as never
        );
      vi.mocked(authRepository.createUser)
        .mockResolvedValue({
          id: "user-1",
          name: "Ali",
          email: "ali@test.com",
          role: "CUSTOMER",
        } as any);
      vi.mocked(createAccessToken )
        .mockReturnValue("jwt-token");

      // Act
      const result = await register({
        name: "Ali",
        email: "ali@test.com",
        password: "password",
        role: "CUSTOMER",
      });

      // Assert
      expect(authRepository.findUserByEmail).toHaveBeenCalledWith("ali@test.com");
      expect(authRepository.createUser).toHaveBeenCalled();
      expect(result.token).toBe("jwt-token");
      expect(result.user.email).toBe("ali@test.com");
    });

    it("fails if email already exists", async () => {
      // Arrange
      vi.mocked(authRepository.findUserByEmail)
        .mockResolvedValue({
          id: "existing-user",
          email: "ali@test.com",
        } as any);

      // Act + Assert
      await expect(
        register({
          name: "Ali",
          email: "ali@test.com",
          password: "password",
          role: "CUSTOMER",
        })
      )
      .rejects
      .toThrow();
    });
  });

  describe("login", () => {
    it("logs in successfully with password", async () => {
      // Arrange
      vi.mocked(authRepository.findUserByEmail)
        .mockResolvedValue({
          id: "user-1",
          name: "Ali",
          email: "ali@test.com",
          password: "hashed-password",
          role: "CUSTOMER",
        } as any);
      vi.mocked(bcrypt.compare)
        .mockResolvedValue(
          true as never
        );
      vi.mocked(createAccessToken )
        .mockReturnValue(
          "jwt-token"
        );

      // Act
      const result =
        await login({
          email: "ali@test.com",
          password: "password",
        });

      // Assert
      expect(bcrypt.compare)
      .toHaveBeenCalledWith(
        "password",
        "hashed-password"
      );
      expect(result.token).toBe("jwt-token");
    });

    it("rejects unknown user", async () => {
      // Arrange
      vi.mocked(authRepository.findUserByEmail)
        .mockResolvedValue(null);

      // Act + Assert
      await expect(
        login({
          email:"unknown@test.com",
          password:"password",
        })
      )
      .rejects
      .toThrow();
    });

    it("rejects Google accounts using password login", async () => {
      // Arrange
      vi.mocked(authRepository.findUserByEmail)
        .mockResolvedValue({
          id:"google-user",
          email:"google@test.com",
          password:null,
          provider:"GOOGLE",
          role:"CUSTOMER",
        } as any);

      // Act + Assert
      await expect(
        login({
          email:"google@test.com",
          password:"password",
        })
      )
      .rejects
      .toThrow();
    });
  });

  describe("googleLogin", () => {
    it("creates a new Google customer account", async () => {
      // Arrange
      vi.mocked(
        googleService.verifyGoogleToken
      )
      .mockResolvedValue({
        email: "google@test.com",
        name: "Google User",
        googleId: "google-id",
        picture: undefined,
        emailVerified: true,
    });
      vi.mocked(
        authRepository.findUserByEmail
      )
      .mockResolvedValue(null);
      vi.mocked(
        authRepository.createUser
      )
      .mockResolvedValue({
        id:"user-1",
        name:"Google User",
        email:"google@test.com",
        role:"CUSTOMER",
        provider:"GOOGLE",
      } as any);
      vi.mocked(createAccessToken )
        .mockReturnValue(
          "google-token"
        );

      // Act
      const result = await googleLogin("google-token");

      // Assert
      expect(googleService.verifyGoogleToken).toHaveBeenCalledWith("google-token");
      expect(authRepository.createUser)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          email:"google@test.com",
          provider:"GOOGLE",
        })
      );
      expect(result.token).toBe("google-token");
    });

    it("uses existing Google account", async () => {
      // Arrange
      vi.mocked(
        googleService.verifyGoogleToken
      )
      .mockResolvedValue({
        email: "google@test.com",
        name: "Google User",
        googleId: "google-id",
        picture: undefined,
        emailVerified: true,
        });
      vi.mocked(
        authRepository.findUserByEmail
      )
      .mockResolvedValue({
        id:"user-1",
        name:"Google User",
        email:"google@test.com",
        role:"CUSTOMER",
        provider:"GOOGLE",
        googleId:"google-id",
      } as any);
      vi.mocked(createAccessToken )
        .mockReturnValue(
          "jwt-token"
        );

      // Act
      const result = await googleLogin("google-token");

      // Assert
      expect(authRepository.createUser)
      .not
      .toHaveBeenCalled();
      expect(result.token).toBe("jwt-token");
    });

    it("links existing local account with Google", async () => {
      // Arrange
      vi.mocked(
        googleService.verifyGoogleToken
      )
      .mockResolvedValue({
        email: "google@test.com",
        name: "Google User",
        googleId: "google-id",
        picture: undefined,
        emailVerified: true,
    });
      vi.mocked(
        authRepository.findUserByEmail
      )
      .mockResolvedValue({
        id:"user-1",
        name:"Local User",
        email:"local@test.com",
        role:"CUSTOMER",
        provider:"LOCAL",
        googleId:null,
      } as any);
      vi.mocked(authRepository.updateGoogleAccount)
      .mockResolvedValue({
        id:"user-1",
        name:"Local User",
        email:"local@test.com",
        role:"CUSTOMER",
        provider:"GOOGLE",
      } as any);
      vi.mocked(createAccessToken ).mockReturnValue("jwt-token");

      // Act
      await googleLogin("google-token");

      // Assert
      expect(authRepository.updateGoogleAccount)
      .toHaveBeenCalledWith(
        "user-1",
        "google-id",
        "GOOGLE"
      );
    });

    it("rejects Google login for OWNER accounts", async () => {
      // Arrange
      vi.mocked(googleService.verifyGoogleToken)
      .mockResolvedValue({
        email: "google@test.com",
        name: "Google User",
        googleId: "google-id",
        picture: undefined,
        emailVerified: true,
        });

      vi.mocked(authRepository.findUserByEmail)
      .mockResolvedValue({
        id:"owner-id",
        email:"owner@test.com",
        role:"OWNER",
        provider:"GOOGLE",
      } as any);

      // Act + Assert
      await expect(googleLogin("google-token"))
      .rejects
      .toThrow();
    });
  });
});