import { LOCALE_HTML_LANG, LOCALE_PREFIXES, Locale, DEFAULT_LOCALE } from '$i18n';
import { absoluteUrl } from '$shared/global/functions/site-url';

export type SeoAlternate = {
	locale: Locale;
	/** Path without the language prefix, e.g. `/blog/my-article`. */
	path: string;
};

export type SeoProps = {
	/** Translation key or ready made string for `<title>`. */
	title: string;
	/** Translation key or ready made string for the meta description. */
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

/** URL of the automatically generated social preview image. */
export function ogImageUrl(locale: Locale, title: string, subtitle?: string): string {
	const params = new URLSearchParams({ title });

	if (subtitle) {
		params.set('subtitle', subtitle);
	}

	return absoluteUrl(`/og/${LOCALE_PREFIXES[locale]}.png?${params.toString()}`);
}
