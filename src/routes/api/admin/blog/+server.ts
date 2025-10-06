import { HttpStatus } from '$shared/global/enums/http-status.js';
import { PaginationParamsDto } from '$shared/global/types/http.js';
import { validateRequest } from '$shared/server/functions/validate-body';

import { PrismaClient } from '@prisma/client';

import {
	type GetBlogArticlesPaginatedResponseDto,
	PostBlogArticleRequestDto,
	type PostBlogArticleResponseDto
} from './model.js';
import { buildErrorResponse, buildResponse } from '$shared/server/functions/build-response.js';

export async function GET({ url, request, route }) {
	const rawQueryParams = url.searchParams
		.entries()
		.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, string>);
	const validationResult = await validateRequest(rawQueryParams, PaginationParamsDto);
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

		return buildResponse<GetBlogArticlesPaginatedResponseDto>({ data: blogArticles, page, size });
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

export async function POST({ request, route }) {
	try {
		const validationResult = await validateRequest(await request.json(), PostBlogArticleRequestDto);
		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { dto } = validationResult;
		const prisma = new PrismaClient();
		const createdBlogArticle = await prisma.blogArticle.create({
			data: dto
		});

		return buildResponse<PostBlogArticleResponseDto>(createdBlogArticle);
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
