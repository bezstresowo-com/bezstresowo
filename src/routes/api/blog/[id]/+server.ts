import { HttpStatus } from '$shared/global/enums/http-status';
import { buildErrorResponse, buildResponse } from '$shared/server/functions/build-response';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import type { BlogArticle } from '@prisma/client';
import { isNil } from 'lodash-es';

export async function GET({ params, route, request }) {
	try {
		const blogArticle = await prisma.blogArticle.findFirst({
			where: { id: params.id }
		});

		if (isNil(blogArticle)) {
			return buildErrorResponse(route, request, HttpStatus.NOT_FOUND, { id: params.id });
		}

		return buildResponse<BlogArticle>(blogArticle);
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
