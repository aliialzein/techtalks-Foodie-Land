import bcrypt from "bcryptjs";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../util/errors";
import { RegistrationInput, LoginInput, AuthResult } from "./auth.types";
import { createAccessToken  } from "./token";
import * as authRepository from "./auth.repository";
import * as googleService from "./google.service";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function googleLogin(token: string): Promise<AuthResult> {
  const googleUser = await googleService.verifyGoogleToken(token);
  let user = await authRepository.findUserByEmail(googleUser.email);
  if (!user) {
    user = await authRepository.createUser({
      name: googleUser.name,
      email: googleUser.email,
      password: null,
      provider: "GOOGLE",
      googleId: googleUser.googleId,
      role: "CUSTOMER",
    });
  }
  if (user.role !== "CUSTOMER") {
    throw new UnauthorizedError(
      "Google authentication is only available for customers."
    );
  }
  
  if (
    user.provider === "LOCAL" &&
    !user.googleId
  ) {
    user = await authRepository.updateGoogleAccount(
      user.id,
      googleUser.googleId,
      "GOOGLE"
    );
  }

  const jwt = createAccessToken (user.id, user.email, user.role);

  return {
    token: jwt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register(data: RegistrationInput): Promise<AuthResult> {
  const existing = await authRepository.findUserByEmail(data.email);
  if (existing) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await authRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  const token = createAccessToken (user.id, user.email, user.role);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const user = await authRepository.findUserByEmail(data.email);
  if (!user) {
    throw new UnauthorizedError("Invalid email please try again");
  }
  
  if (!user.password) {
    throw new UnauthorizedError(
      "This account uses Google Sign-In. Please continue with Google."
    );
  }

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    throw new UnauthorizedError("Wrong password");
  }

  const token = createAccessToken (user.id, user.email, user.role);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function logout() {
  return { message: "Logged out. Delete your token on the client." };
}

export async function getMe(userId: string) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
}