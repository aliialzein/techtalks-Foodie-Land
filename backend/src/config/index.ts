import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to initialize Prisma Client");
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
