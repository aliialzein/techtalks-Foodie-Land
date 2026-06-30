import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { RegistrationInput, LoginInput } from "./auth_schema";
import { createToken } from "./token";

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function register(data: RegistrationInput) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  const token = createToken(user.id, user.email, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function logout() {
  return {
    message: "Logged out. Delete your token on the client.",
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}