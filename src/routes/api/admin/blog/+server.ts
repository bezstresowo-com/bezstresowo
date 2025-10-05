import { HttpStatus } from '$shared/global/enums/http-status.js';
import { type HttpErrorResponse, PaginationParamsDto } from '$shared/global/types/http.js';
import { validateRequest } from '$shared/server/functions/validate-body';

import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

import {
	GetBlogArticlesPaginatedResponseDto,
	PostBlogArticleRequestDto,
	PostBlogArticleResponseDto
} from './model.js';

export async function GET({ url }) {
	const ERROR_PREFIX = 'api.admin.blog.GET.errors';

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

		return json(
			{
				data: blogArticles,
				page,
				size
			} satisfies GetBlogArticlesPaginatedResponseDto,
			{ status: HttpStatus.OK }
		);
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR`
			} satisfies HttpErrorResponse,
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}

export async function POST({ request }) {
	const ERROR_PREFIX = 'api.admin.blog.POST.errors';

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

		return json({ id: createdBlogArticle.id } satisfies PostBlogArticleResponseDto, {
			status: HttpStatus.OK
		});
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR`
			} satisfies HttpErrorResponse,
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR
			}
		);
	}
}
