import { command, query } from '$app/server';
import { Locale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { PaginationParamsDto } from '$shared/global/types/http';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { buildArticleJsonLD } from '$shared/server/functions/json-ld';
import { cleanupMedia } from '$shared/server/functions/media-cleanup';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';

import {
	BlogArticleIdDto,
	UpdateBlogArticleDto,
	UpsertBlogArticleDto,
	type InternationalizedBlogArticleDto
} from './dto/blog';

const ARTICLE_INCLUDE = {
	internationalizedArticles: {
		orderBy: { lang: 'asc' as const }
	}
};

/** Every article with all of its language versions. */
export const getAdminBlogArticles = query(
	dtoSchema(PaginationParamsDto),
	async ({ page, size, sortBy, sortOrder }) => {
		requireAdmin();

		const [blogArticles, totalCount] = await Promise.all([
			prisma.blogArticle.findMany({
				include: ARTICLE_INCLUDE,
				orderBy: { [sortBy]: sortOrder },
				skip: (page - 1) * size,
				take: size
			}),
			prisma.blogArticle.count()
		]);

		return { data: blogArticles, page, size, totalCount };
	}
);

export const getAdminBlogArticle = query(dtoSchema(BlogArticleIdDto), async ({ id }) => {
	requireAdmin();

	const blogArticle = await prisma.blogArticle.findFirst({
		where: { id },
		include: ARTICLE_INCLUDE
	});

	if (isNil(blogArticle)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	return blogArticle;
});

export const createBlogArticle = command(
	dtoSchema(UpsertBlogArticleDto),
	async ({ translations }) => {
		requireAdmin();

		assertUniqueLanguages(translations);
		await assertFreeSlugs(translations);

		const now = new Date();

		return await prisma.blogArticle.create({
			data: {
				internationalizedArticles: {
					create: translations.map((translation) => toTranslationRow(translation, now, now))
				}
			},
			include: ARTICLE_INCLUDE
		});
	}
);

export const updateBlogArticle = command(
	dtoSchema(UpdateBlogArticleDto),
	async ({ id, translations }) => {
		requireAdmin();

		assertUniqueLanguages(translations);

		const existing = await prisma.blogArticle.findFirst({
			where: { id },
			include: ARTICLE_INCLUDE
		});

		if (isNil(existing)) {
			error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
		}

		await assertFreeSlugs(translations, id);

		const previousMediaIds = existing.internationalizedArticles.flatMap(
			(translation) => translation.mediaIds
		);

		// Language versions are fully replaced: dropping a translation from the
		// payload removes it (and, below, its media) from the article. Prisma
		// runs the nested `deleteMany` before the nested `create`.
		const updated = await prisma.blogArticle.update({
			where: { id },
			data: {
				internationalizedArticles: {
					deleteMany: {},
					create: translations.map((translation) => {
						const previous = existing.internationalizedArticles.find(
							(candidate) => candidate.lang === translation.lang
						);

						return toTranslationRow(translation, previous?.createdAt ?? new Date(), new Date());
					})
				}
			},
			include: ARTICLE_INCLUDE
		});

		// Runs after the write committed, so a bucket failure can never leave a
		// live row pointing at a deleted object. `cleanupMedia` re-checks the db,
		// so ids that are still referenced (shared media) are kept.
		await cleanupMedia(previousMediaIds);

		return updated;
	}
);

export const deleteBlogArticle = command(dtoSchema(BlogArticleIdDto), async ({ id }) => {
	requireAdmin();

	const existing = await prisma.blogArticle.findFirst({
		where: { id },
		include: ARTICLE_INCLUDE
	});

	if (isNil(existing)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	const mediaIds = existing.internationalizedArticles.flatMap(
		(translation) => translation.mediaIds
	);

	await prisma.blogArticle.delete({ where: { id } });
	await cleanupMedia(mediaIds);
});

function assertUniqueLanguages(translations: InternationalizedBlogArticleDto[]) {
	const languages = translations.map((translation) => translation.lang);

	if (new Set(languages).size !== languages.length) {
		error(HttpStatus.BAD_REQUEST, { message: 'api.errors.BAD_REQUEST' });
	}
}

async function assertFreeSlugs(
	translations: InternationalizedBlogArticleDto[],
	ignoreArticleId?: string
) {
	const slugs = translations.map((translation) => translation.slug);

	if (new Set(slugs).size !== slugs.length) {
		error(HttpStatus.CONFLICT, { message: 'api.errors.CONFLICT' });
	}

	const clashing = await prisma.internationalizedBlogArticle.findFirst({
		where: {
			slug: { in: slugs },
			...(isNil(ignoreArticleId) ? {} : { blogArticleId: { not: ignoreArticleId } })
		},
		select: { slug: true }
	});

	if (!isNil(clashing)) {
		error(HttpStatus.CONFLICT, { message: 'api.errors.CONFLICT' });
	}
}

function toTranslationRow(
	translation: InternationalizedBlogArticleDto,
	createdAt: Date,
	updatedAt: Date
) {
	const featuredImageId = translation.featuredImageId ?? null;

	return {
		lang: translation.lang,
		slug: translation.slug,
		title: translation.title,
		content: translation.content,
		metaTitle: translation.metaTitle,
		metaDescription: translation.metaDescription,
		featuredImageId,
		featuredImageAlt: translation.featuredImageAlt ?? null,
		mediaIds: translation.mediaIds,
		// JSON-LD is materialized on write only, never while rendering.
		metadataJsonLD: buildArticleJsonLD({
			locale: translation.lang as Locale,
			slug: translation.slug,
			title: translation.metaTitle,
			description: translation.metaDescription,
			imageUrl: isNil(featuredImageId) ? null : new S3Service().buildUrl(featuredImageId),
			datePublished: createdAt,
			dateModified: updatedAt
		}),
		createdAt,
		updatedAt
	};
}
