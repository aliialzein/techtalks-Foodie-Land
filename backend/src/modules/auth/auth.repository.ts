import { prisma } from "../../lib/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "OWNER" | "ADMIN";
}) {
  return prisma.user.create({ data });
}