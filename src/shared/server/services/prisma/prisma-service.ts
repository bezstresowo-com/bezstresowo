import { PrismaClient } from '$shared/server/generated/prisma/client';

const createPrismaClient = () =>
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;

// Reuse a single client across dev/HMR reloads to avoid leaking connections.
const globalForPrisma = globalThis as unknown as { prisma?: AppPrismaClient };

export const prisma: AppPrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

if (typeof process !== 'undefined') {
	process.on('beforeExit', async () => {
		await prisma.$disconnect();
	});
}
