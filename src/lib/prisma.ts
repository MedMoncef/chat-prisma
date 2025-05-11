import { PrismaClient } from '@prisma/client';

// Add explicit typing to include the new models
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a fresh instance of PrismaClient
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

// Ensure client is reused in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;