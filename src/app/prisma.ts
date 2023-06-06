import { PrismaClient } from "@prisma/client";

declare module globalThis {
  let prisma: PrismaClient;
}

function connectOnceToDatabase() {
  if (!globalThis.prisma) globalThis.prisma = new PrismaClient();
  return globalThis.prisma;
}

const prisma = connectOnceToDatabase();

export default prisma;
