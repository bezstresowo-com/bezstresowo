import { query } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import {
	blogMediaUrl,
	findPublishedBlogArticle,
	normalizeLegacyArticleText
} from '$shared/server/services/blog/blog-service';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error } from '@sveltejs/kit';

import {
	BlogArticleBySlugDto,
	BlogArticleListParamsDto,
	type BlogArticleDetails,
	type BlogArticleListItem
} from './dto/blog';

/** Articles available (and not disabled) in the requested language, newest first. */
export const getBlogArticles = query(
	dtoSchema(BlogArticleListParamsDto),
	async ({ lang, page, size }) => {
		const where = { lang, disabled: false };

		const [translations, totalCount] = await Promise.all([
			prisma.internationalizedBlogArticle.findMany({
				where,
				include: { blogArticle: { select: { slug: true } } },
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
					// Translations only ever attach to articles this app wrote, and
					// those always carry a slug - `?? ''` is for the type only.
					slug: translation.blogArticle.slug ?? '',
					title: normalizeLegacyArticleText(translation.title),
					metaDescription: normalizeLegacyArticleText(translation.metaDescription),
					featuredImageId: translation.featuredImageId,
					featuredImageUrl: blogMediaUrl(translation.featuredImageId),
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

/** A single article plus the languages of its other versions (hreflang). */
export const getBlogArticle = query(
	dtoSchema(BlogArticleBySlugDto),
	async ({ lang, slug }): Promise<BlogArticleDetails> => {
		const article = await findPublishedBlogArticle(lang, slug);

		if (!article) {
			error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
		}

		return article;
	}
);
