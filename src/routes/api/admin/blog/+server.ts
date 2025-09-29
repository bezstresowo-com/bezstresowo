import { PrismaClient } from '@prisma/client';

export async function GET() {
	const prisma = new PrismaClient();

	prisma.blogArticle.findMany();
}

export async function POST() {}

export async function PATCH() {}

export async function PUT() {}

export async function DELETE() {}
