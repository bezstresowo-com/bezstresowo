import { PrismaClient } from '@prisma/client';

class PrismaService extends PrismaClient {
	private static instance: PrismaService | null = null;

	private constructor() {
		super({
			log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
		});
	}

	public static getInstance(): PrismaService {
		if (!PrismaService.instance) {
			PrismaService.instance = new PrismaService();

			if (typeof process !== 'undefined') {
				process.on('beforeExit', async () => {
					await PrismaService.instance?.$disconnect();
				});
			}
		}

		return PrismaService.instance;
	}
}

export const prisma = PrismaService.getInstance();
export { PrismaService };
