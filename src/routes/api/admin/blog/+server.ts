import { HttpStatus } from '$shared/global/enums/http-status.js';
import { PaginationParamsDto, type HttpErrorResponse } from '$shared/global/types/http.js';
import { validateRequestData } from '$shared/server/functions/validate-body';
import { PrismaClient } from '@prisma/client';

import { json } from '@sveltejs/kit';
import type { GetBlogArticlesPaginatedResponseDto } from './model.js';

export async function GET({ url }) {
	const rawQueryParams = url.searchParams
		.entries()
		.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, string>);
	const validationResult = await validateRequestData(rawQueryParams, PaginationParamsDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	try {
		const { page, size } = validationResult.dto;
		const prisma = new PrismaClient();
		const blogArticles = await prisma.blogArticle.findMany({
			skip: page * size,
			take: size
		});

		return json(
			{
				data: blogArticles,
				page,
				size
			} satisfies GetBlogArticlesPaginatedResponseDto,
			{ status: HttpStatus.OK }
		);
	} catch {
		// TODO
		return json(
			{
				message: ''
			} satisfies HttpErrorResponse,
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
