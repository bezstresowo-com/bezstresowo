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

/** A single article plus the languages of its other versions (hreflang). */
export const getBlogArticle = query(
	dtoSchema(BlogArticleBySlugDto),
	async ({ lang, slug }): Promise<BlogArticleDetails> => {
		const translation = await prisma.internationalizedBlogArticle.findFirst({
			where: { lang, disabled: false, blogArticle: { slug } },
			include: {
				blogArticle: {
					include: {
						internationalizedArticles: {
							where: { disabled: false },
							select: { lang: true }
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
			// The where clause matched the parent's slug against this exact value.
			slug,
			title: normalizeLegacyArticleText(translation.title),
			content: normalizeLegacyArticleText(translation.content),
			metaTitle: normalizeLegacyArticleText(translation.metaTitle),
			metaDescription: normalizeLegacyArticleText(translation.metaDescription),
			featuredImageId: translation.featuredImageId,
			featuredImageUrl: mediaUrl(translation.featuredImageId),
			featuredImageAlt: translation.featuredImageAlt,
			metadataJsonLD: normalizeLegacyArticleValue(translation.metadataJsonLD),
			createdAt: translation.createdAt,
			updatedAt: translation.updatedAt,
			alternates: translation.blogArticle.internationalizedArticles.map(
				(alternate) => alternate.lang as Locale
			)
		};
	}
);

function mediaUrl(mediaId: string | null): string | null {
	return isNil(mediaId) ? null : new S3Service().buildUrl(mediaId);
}

/**
 * Compatibility cleanup for the first imported articles. The database content
 * remains editable in the panel; once it is saved there, these replacements
 * simply become no-ops.
 */
const LEGACY_ARTICLE_REPLACEMENTS = [
	['15 sygnałów, które nie warto ignorować', '15 sygnałów, których nie warto ignorować'],
	['Gaslighting - to forma', 'Gaslighting to forma'],
	[
		'/pl/blog/jak-rozpoznac-toksyczny-zwiazek-15-sygnalow-ktore-nie-warto-ignorowac',
		'/pl/blog/how-to-recognize-a-toxic-relationship'
	],
	[
		'/uk/blog/iak-rozpiznaty-toksychni-stosunky-15-syhnaliv-iaki-ne-varto-ihnoruvaty',
		'/uk/blog/how-to-recognize-a-toxic-relationship'
	],
	[
		'/pl/blog/dlaczego-tak-trudno-odejsc-z-toksycznego-zwiazku-nawet-kiedy-wiesz-ze-cie-niszcz',
		'/pl/blog/why-it-is-so-hard-to-leave-a-toxic-relationship'
	],
	[
		'/uk/blog/chomu-tak-vazhko-pity-z-toksychnykh-stosunkiv-navit-koly-znaiesh-shcho-vony-tebe',
		'/uk/blog/why-it-is-so-hard-to-leave-a-toxic-relationship'
	]
] as const;

function normalizeLegacyArticleText(value: string): string {
	return LEGACY_ARTICLE_REPLACEMENTS.reduce(
		(result, [legacyValue, currentValue]) => result.replaceAll(legacyValue, currentValue),
		value
	);
}

function normalizeLegacyArticleValue(value: unknown): unknown {
	if (typeof value === 'string') {
		return normalizeLegacyArticleText(value);
	}

	if (Array.isArray(value)) {
		return value.map(normalizeLegacyArticleValue);
	}

	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, nestedValue]) => [
				key,
				normalizeLegacyArticleValue(nestedValue)
			])
		);
	}

	return value;
}
