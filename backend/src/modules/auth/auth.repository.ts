import { prisma } from "../../lib/prisma";
//import { AuthProvider, UserRole } from "@prisma/client";
import { AuthProvider, UserRole } from "../../generated/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function findUserByGoogleId(googleId: string) {
  return prisma.user.findUnique({
    where: { googleId },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export function createUser(data: {
  name: string;
  email: string;
  password?: string | null;
  provider?: AuthProvider;
  googleId?: string | null;
  role?: UserRole;
}) {
  return prisma.user.create({
    data,
  });
}

export function updateGoogleAccount(
  id: string,
  googleId: string,
  provider: AuthProvider
) {
  return prisma.user.update({
    where: { id },
    data: {
      googleId,
      provider,
    },
  });
}