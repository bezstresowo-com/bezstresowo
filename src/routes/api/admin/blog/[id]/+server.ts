import { HttpStatus } from '$shared/global/enums/http-status.js';
import { validateRequest } from '$shared/server/functions/validate-body.js';
import { isNil } from 'lodash-es';

import { PrismaClient } from '@prisma/client';

import {
	PutBlogArticleRequestDto,
	type PutBlogArticleResponseDto,
	type GetBlogArticleResponseDto
} from './model.js';

import { S3Service } from '$shared/server/services/s3/s3-service.js';
import {
	buildErrorResponse,
	buildOkResponse,
	buildResponse
} from '$shared/server/functions/build-response.js';

export async function GET({ params, route, request }) {
	try {
		const prisma = new PrismaClient();
		const blogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(blogArticle)) {
			return buildErrorResponse(route, request, HttpStatus.NOT_FOUND, { id: params.id });
		}

		return buildResponse<GetBlogArticleResponseDto>(blogArticle);
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

export async function PUT({ params, request, route }) {
	try {
		const validationResult = await validateRequest(await request.json(), PutBlogArticleRequestDto);
		if (validationResult.type === 'error') {
			return validationResult.response;
		}
		const { dto } = validationResult;

		const prisma = new PrismaClient();
		const foundBlogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(foundBlogArticle)) {
			return buildErrorResponse(route, request, HttpStatus.NOT_FOUND, { id: params.id });
		}

		const updatedBlogArticle = await prisma.blogArticle.update({
			where: {
				id: params.id
			},
			data: dto
		});

		return buildResponse<PutBlogArticleResponseDto>(updatedBlogArticle);
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

export async function DELETE({ params, route, request }) {
	try {
		const prisma = new PrismaClient();
		const foundBlogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(foundBlogArticle)) {
			return buildErrorResponse(route, request, HttpStatus.NOT_FOUND, { id: params.id });
		}

		const s3 = new S3Service();
		await Promise.all(
			foundBlogArticle.relatedMediaIds.map(async (id) => {
				return await s3.deleteFile(id);
			})
		);

		await prisma.blogArticle.delete({ where: { id: params.id } });

		return buildOkResponse();
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR, {
			id: params.id
		});
	}
}
