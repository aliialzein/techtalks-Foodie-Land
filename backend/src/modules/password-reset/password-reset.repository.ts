import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export function create(data: Prisma.PasswordResetUncheckedCreateInput) {
  return prisma.passwordReset.create({
    data,
  });
}

export function findLatestByUserId(userId: string) {
  return prisma.passwordReset.findFirst({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function deleteByUserId(userId: string) {
  return prisma.passwordReset.deleteMany({
    where: {
      userId,
    },
  });
}

export function markVerified(id: string) {
  return prisma.passwordReset.update({
    where: { id },
    data: {
      verified: true,
    },
  });
}

export function deleteReset(id: string) {
  return prisma.passwordReset.delete({
    where: { id },
  });
}

export function deleteExpired() {
  return prisma.passwordReset.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}