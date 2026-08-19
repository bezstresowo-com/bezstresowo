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

/**
 * Only documents this app wrote carry a slug; the filter hides the legacy
 * (pre-i18n) documents that share the production collection.
 */
const MANAGED_ARTICLES = { slug: { isSet: true } };

/** Every article with all of its language versions (disabled ones included). */
export const getAdminBlogArticles = query(
	dtoSchema(PaginationParamsDto),
	async ({ page, size, sortBy, sortOrder }) => {
		requireAdmin();

		const [blogArticles, totalCount] = await Promise.all([
			prisma.blogArticle.findMany({
				where: MANAGED_ARTICLES,
				include: ARTICLE_INCLUDE,
				orderBy: { [sortBy]: sortOrder },
				skip: (page - 1) * size,
				take: size
			}),
			prisma.blogArticle.count({ where: MANAGED_ARTICLES })
		]);

		return { data: blogArticles, page, size, totalCount };
	}
);

export const getAdminBlogArticle = query(dtoSchema(BlogArticleIdDto), async ({ id }) => {
	requireAdmin();

	const blogArticle = await prisma.blogArticle.findFirst({
		where: { id, ...MANAGED_ARTICLES },
		include: ARTICLE_INCLUDE
	});

	if (isNil(blogArticle)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	return blogArticle;
});

export const createBlogArticle = command(
	dtoSchema(UpsertBlogArticleDto),
	async ({ slug, translations }) => {
		requireAdmin();

		assertUniqueLanguages(translations);
		await assertFreeSlug(slug);

		const now = new Date();

		return await prisma.blogArticle.create({
			data: {
				slug,
				internationalizedArticles: {
					create: translations.map((translation) => toTranslationRow(translation, slug, now, now))
				}
			},
			include: ARTICLE_INCLUDE
		});
	}
);

export const updateBlogArticle = command(
	dtoSchema(UpdateBlogArticleDto),
	async ({ id, slug, translations }) => {
		requireAdmin();

		assertUniqueLanguages(translations);

		const existing = await prisma.blogArticle.findFirst({
			where: { id, ...MANAGED_ARTICLES },
			include: ARTICLE_INCLUDE
		});

		if (isNil(existing)) {
			error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
		}

		await assertFreeSlug(slug, id);

		const previousMediaIds = existing.internationalizedArticles.flatMap(
			(translation) => translation.mediaIds
		);
		const submittedLanguages = translations.map((translation) => translation.lang);

		// Submitted language versions are fully replaced; versions missing from
		// the payload are only marked `disabled` - their content, media and SEO
		// fields stay in the database and come back when re-enabled. Prisma runs
		// the nested `deleteMany` before the nested `create`, and the `updateMany`
		// filter never matches a created row (disjoint `lang` sets).
		const updated = await prisma.blogArticle.update({
			where: { id },
			data: {
				slug,
				internationalizedArticles: {
					deleteMany: { lang: { in: submittedLanguages } },
					updateMany: {
						where: { lang: { notIn: submittedLanguages } },
						data: { disabled: true }
					},
					create: translations.map((translation) => {
						const previous = existing.internationalizedArticles.find(
							(candidate) => candidate.lang === translation.lang
						);

						return toTranslationRow(
							translation,
							slug,
							previous?.createdAt ?? new Date(),
							new Date()
						);
					})
				}
			},
			include: ARTICLE_INCLUDE
		});

		// Runs after the write committed, so a bucket failure can never leave a
		// live row pointing at a deleted object. `cleanupMedia` re-checks the db,
		// so ids still referenced (shared media, disabled versions) are kept.
		await cleanupMedia(previousMediaIds);

		return updated;
	}
);

// Deliberately scoped to managed articles: deleting a legacy document would
// drop the only reference to the old articles' bucket files (see the sweep).
export const deleteBlogArticle = command(dtoSchema(BlogArticleIdDto), async ({ id }) => {
	requireAdmin();

	const existing = await prisma.blogArticle.findFirst({
		where: { id, ...MANAGED_ARTICLES },
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

async function assertFreeSlug(slug: string, ignoreArticleId?: string) {
	const clashing = await prisma.blogArticle.findFirst({
		where: { slug, ...(isNil(ignoreArticleId) ? {} : { id: { not: ignoreArticleId } }) },
		select: { id: true }
	});

	if (!isNil(clashing)) {
		error(HttpStatus.CONFLICT, { message: 'api.errors.CONFLICT' });
	}
}

function toTranslationRow(
	translation: InternationalizedBlogArticleDto,
	slug: string,
	createdAt: Date,
	updatedAt: Date
) {
	const featuredImageId = translation.featuredImageId ?? null;

	return {
		lang: translation.lang,
		disabled: false,
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
			slug,
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
