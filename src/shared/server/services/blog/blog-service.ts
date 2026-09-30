import type { Locale } from '$i18n';
import type { BlogArticleDetails } from '$remote/dto/blog';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';

/** A published article prepared for both the page server load and remote API. */
export async function findPublishedBlogArticle(
	lang: Locale,
	slug: string
): Promise<BlogArticleDetails | null> {
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

	if (!translation) {
		return null;
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
		featuredImageUrl: blogMediaUrl(translation.featuredImageId),
		featuredImageAlt: translation.featuredImageAlt,
		metadataJsonLD: normalizeLegacyArticleValue(translation.metadataJsonLD),
		createdAt: translation.createdAt,
		updatedAt: translation.updatedAt,
		alternates: translation.blogArticle.internationalizedArticles.map(
			(alternate) => alternate.lang as Locale
		)
	};
}

export function blogMediaUrl(mediaId: string | null): string | null {
	return mediaId === null ? null : new S3Service().buildUrl(mediaId);
}

/**
 * Compatibility cleanup for the first imported articles. The database content
 * remains editable in the panel; once it is saved there, these replacements
 * simply become no-ops.
 */
const LEGACY_ARTICLE_REPLACEMENTS = [
	['https://bezstresowo.org', 'https://www.bezstresowo.org'],
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

export function normalizeLegacyArticleText(value: string): string {
	return LEGACY_ARTICLE_REPLACEMENTS.reduce(
		(result, [legacyValue, currentValue]) => result.replaceAll(legacyValue, currentValue),
		value
	);
}

export function normalizeLegacyArticleValue(value: unknown): unknown {
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
