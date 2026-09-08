import { PrismaClient } from "@prisma/client";

// Patrón Singleton para el cliente de Prisma ORM
const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });
};

declare global {
  // Permite mantener una única instancia en recargas en caliente / desarrollo
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export async function conectarPrisma(): Promise<void> {
  await prisma.$connect();
}

export async function desconectarPrisma(): Promise<void> {
  await prisma.$disconnect();
}
