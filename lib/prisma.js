import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across hot-reloads in development.
// Without this, Next.js' dev server would spawn a new client on every reload
// and exhaust the database connection pool.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
