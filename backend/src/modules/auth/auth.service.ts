import bcrypt from "bcryptjs";
import { RegistrationInput, LoginInput, AuthResult } from "./auth.types";
import { createToken } from "./token";
import * as authRepository from "./auth.repository";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function register(data: RegistrationInput): Promise<AuthResult> {
  const existing = await authRepository.findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await authRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  const token = createToken(user.id, user.email, user.role);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const user = await authRepository.findUserByEmail(data.email);
  if (!user) {
    throw new Error("Invalid email please try again");
  }

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    throw new Error("Wrong password");
  }

  const token = createToken(user.id, user.email, user.role);

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
    throw new Error("User not found");
  }
  return user;
}