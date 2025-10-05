import { HttpStatus } from '$shared/global/enums/http-status.js';
import { validateRequest } from '$shared/server/functions/validate-body.js';
import { isNil } from 'lodash-es';

import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

import { PutBlogArticleRequestDto, PutBlogArticleResponseDto } from './model.js';

import type { HttpErrorResponse, HttpStatusResponse } from '$shared/global/types/http.js';
import { S3Service } from '$shared/server/services/s3/s3-service.js';

export async function GET({ params }) {
	const ERROR_PREFIX = 'api.admin.blog.[id].GET.errors';

	try {
		const prisma = new PrismaClient();
		const blogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(blogArticle)) {
			return json(
				{
					message: ''
				} satisfies HttpErrorResponse,
				{ status: HttpStatus.NOT_FOUND }
			);
		}
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR@${JSON.stringify({ id: params.id })}`
			} satisfies HttpErrorResponse,
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR
			}
		);
	}
}

export async function PUT({ params, request }) {
	const ERROR_PREFIX = 'api.admin.blog.[id].PUT.errors';

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
			return json(
				{
					message: `${ERROR_PREFIX}.NOT_FOUND@${JSON.stringify({ id: params.id })}`
				} satisfies HttpErrorResponse,
				{
					status: HttpStatus.NOT_FOUND
				}
			);
		}

		const updatedBlogArticle = await prisma.blogArticle.update({
			where: {
				id: params.id
			},
			data: dto
		});
		return json({
			id: updatedBlogArticle.id
		} satisfies PutBlogArticleResponseDto);
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR@${JSON.stringify({ id: params.id })}`
			} satisfies HttpErrorResponse,
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR
			}
		);
	}
}

export async function DELETE({ params }) {
	const ERROR_PREFIX = 'api.admin.blog.[id].DELETE.errors';

	try {
		const prisma = new PrismaClient();
		const foundBlogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(foundBlogArticle)) {
			return json(
				{
					message: `${ERROR_PREFIX}.NOT_FOUND@${JSON.stringify({ id: params.id })}`
				} satisfies HttpErrorResponse,
				{
					status: HttpStatus.NOT_FOUND
				}
			);
		}

		const s3 = new S3Service();
		await Promise.all(
			foundBlogArticle.relatedMediaIds.map(async (id) => {
				return await s3.deleteFile(id);
			})
		);

		await prisma.blogArticle.delete({ where: { id: params.id } });
		return json({ status: 'ok' } satisfies HttpStatusResponse, { status: HttpStatus.OK });
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR@${JSON.stringify({ id: params.id })}`
			} satisfies HttpErrorResponse,
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR
			}
		);
	}
}
