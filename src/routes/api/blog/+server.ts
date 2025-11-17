import type { GetBlogArticlesPaginatedResponseDto } from '$api/admin/blog/model';
import { HttpStatus } from '$shared/global/enums/http-status';
import { PaginationParamsDto } from '$shared/global/types/http';
import { buildErrorResponse, buildResponse } from '$shared/server/functions/build-response';
import { validateRequest } from '$shared/server/functions/validate-body';
import { PrismaClient } from '@prisma/client';

export async function GET({ url, request, route }) {
	const rawQueryParams = url.searchParams
		.entries()
		.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, string>);
	const validationResult = await validateRequest(rawQueryParams, PaginationParamsDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	try {
		const { page, size, sortBy, sortOrder } = validationResult.dto;
		const prisma = new PrismaClient();
		const blogArticles = await prisma.blogArticle.findMany({
			orderBy: {
				[sortBy as string]: sortOrder
			},
			skip: (page - 1) * size,
			take: size
		});

		return buildResponse<GetBlogArticlesPaginatedResponseDto>({ data: blogArticles, page, size });
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
