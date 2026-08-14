import { query } from '$app/server';
import type { Locale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';

import {
	BlogArticleBySlugDto,
	BlogArticleListParamsDto,
	type BlogArticleDetails,
	type BlogArticleListItem
} from './dto/blog';

/** Articles available in the requested language, newest first. */
export const getBlogArticles = query(
	dtoSchema(BlogArticleListParamsDto),
	async ({ lang, page, size }) => {
		const where = { lang };

		const [translations, totalCount] = await Promise.all([
			prisma.internationalizedBlogArticle.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * size,
				take: size
			}),
			prisma.internationalizedBlogArticle.count({ where })
		]);

		return {
			data: translations.map(
				(translation): BlogArticleListItem => ({
					id: translation.blogArticleId,
					slug: translation.slug,
					title: translation.title,
					metaDescription: translation.metaDescription,
					featuredImageId: translation.featuredImageId,
					featuredImageUrl: mediaUrl(translation.featuredImageId),
					featuredImageAlt: translation.featuredImageAlt,
					createdAt: translation.createdAt,
					updatedAt: translation.updatedAt
				})
			),
			page,
			size,
			totalCount
		};
	}
);

/** A single article plus the slugs of its other language versions (hreflang). */
export const getBlogArticle = query(
	dtoSchema(BlogArticleBySlugDto),
	async ({ lang, slug }): Promise<BlogArticleDetails> => {
		const translation = await prisma.internationalizedBlogArticle.findFirst({
			where: { slug, lang },
			include: {
				blogArticle: {
					include: {
						internationalizedArticles: {
							select: { lang: true, slug: true }
						}
					}
				}
			}
		});

		if (isNil(translation)) {
			error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
		}

		return {
			id: translation.blogArticleId,
			slug: translation.slug,
			title: translation.title,
			content: translation.content,
			metaTitle: translation.metaTitle,
			metaDescription: translation.metaDescription,
			featuredImageId: translation.featuredImageId,
			featuredImageUrl: mediaUrl(translation.featuredImageId),
			featuredImageAlt: translation.featuredImageAlt,
			metadataJsonLD: translation.metadataJsonLD,
			createdAt: translation.createdAt,
			updatedAt: translation.updatedAt,
			alternates: translation.blogArticle.internationalizedArticles.map((alternate) => ({
				lang: alternate.lang as Locale,
				slug: alternate.slug
			}))
		};
	}
);

function mediaUrl(mediaId: string | null): string | null {
	return isNil(mediaId) ? null : new S3Service().buildUrl(mediaId);
}
