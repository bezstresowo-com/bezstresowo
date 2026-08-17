import { DEFAULT_LOCALE, LOCALE_HTML_LANG, LOCALE_PREFIXES, Locale } from '$i18n';
import { absoluteUrl } from '$shared/global/functions/site-url';

export type SeoAlternate = {
	locale: Locale;
	/** Path without the language prefix, e.g. `/blog/my-article`. */
	path: string;
};

export type SeoProps = {
	/** Already resolved text for `<title>` (`t.meta...` or a db value). */
	title: string;
	/** Already resolved text for the meta description. */
	description?: string;
	/** Keep the page out of the index (regulations, privacy policy, ...). */
	noindex?: boolean;
	/**
	 * Language versions of this page. Defaults to the current path in every
	 * supported language, which is correct for everything except blog articles,
	 * whose slug differs per language.
	 */
	alternates?: SeoAlternate[];
	/** Absolute URL of the social preview image. Defaults to the generated one. */
	image?: string;
	imageAlt?: string;
	ogType?: 'website' | 'article';
	/** Structured data rendered as `application/ld+json`. */
	jsonLd?: unknown;
};

export const TITLE_MAX_LENGTH = 60;
export const DESCRIPTION_MAX_LENGTH = 155;

/** Strips the language prefix: `/pl/blog/x` -> `/blog/x`. */
export function stripLocalePrefix(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);

	if ((Object.values(LOCALE_PREFIXES) as string[]).includes(segments[0])) {
		segments.shift();
	}

	return `/${segments.join('/')}`;
}

export function defaultAlternates(pathWithoutPrefix: string): SeoAlternate[] {
	return Object.values(Locale).map((locale) => ({ locale, path: pathWithoutPrefix }));
}

export function alternateUrl(alternate: SeoAlternate): string {
	return absoluteUrl(`/${LOCALE_PREFIXES[alternate.locale]}${alternate.path}`);
}

export function hreflang(locale: Locale): string {
	return LOCALE_HTML_LANG[locale];
}

/** `x-default` points at the polish version, the default language of the site. */
export function xDefaultUrl(alternates: SeoAlternate[]): string {
	const fallback =
		alternates.find((alternate) => alternate.locale === DEFAULT_LOCALE) ?? alternates[0];

	return fallback ? alternateUrl(fallback) : absoluteUrl('/pl/home');
}

/**
 * Wraps the stored per-product `metadataJsonLD` rows into a single `ItemList`,
 * ready for `<Seo jsonLd={...} />` on `/shop` and `/price-list`. The entities
 * are materialized on write - the list pages only assemble them.
 */
export function productListJsonLd(items: readonly unknown[]): unknown | undefined {
	if (items.length === 0) {
		return undefined;
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: stripJsonLdContext(item)
		}))
	};
}

/** Nested entities must not repeat `@context` - the top level object carries it. */
function stripJsonLdContext(item: unknown): unknown {
	if (typeof item !== 'object' || item === null) {
		return item;
	}

	const { '@context': _context, ...rest } = item as Record<string, unknown>;

	return rest;
}

/** URL of the automatically generated social preview image. */
export function ogImageUrl(locale: Locale, title: string, subtitle?: string): string {
	const params = new URLSearchParams({ title });

	if (subtitle) {
		params.set('subtitle', subtitle);
	}

	return absoluteUrl(`/og/${LOCALE_PREFIXES[locale]}.png?${params.toString()}`);
}
