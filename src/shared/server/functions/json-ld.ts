import { LOCALE_HTML_LANG, LOCALE_PREFIXES, type Locale } from '$i18n';
import { absoluteUrl } from '$shared/global/functions/site-url';

const AUTHOR = {
	'@type': 'Person',
	name: 'Olesya Haiduk',
	url: absoluteUrl('/pl/home')
} as const;

const PUBLISHER = {
	'@type': 'Organization',
	name: 'Bezstresowo',
	url: absoluteUrl('/pl/home'),
	logo: {
		'@type': 'ImageObject',
		url: absoluteUrl('/assets/header-logo.svg')
	}
} as const;

/**
 * Article structured data. Generated once, when an article is created or
 * updated, and stored on the row - never recomputed while rendering.
 */
export function buildArticleJsonLD(args: {
	locale: Locale;
	slug: string;
	title: string;
	description: string;
	imageUrl: string | null;
	datePublished: Date;
	dateModified: Date;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: args.title,
		description: args.description,
		inLanguage: LOCALE_HTML_LANG[args.locale],
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': absoluteUrl(`/${LOCALE_PREFIXES[args.locale]}/blog/${args.slug}`)
		},
		url: absoluteUrl(`/${LOCALE_PREFIXES[args.locale]}/blog/${args.slug}`),
		datePublished: args.datePublished.toISOString(),
		dateModified: args.dateModified.toISOString(),
		author: AUTHOR,
		publisher: PUBLISHER,
		...(args.imageUrl ? { image: [args.imageUrl] } : {})
	};
}

export function buildProductJsonLD(args: {
	locale: Locale;
	slug: string;
	name: string;
	description: string;
	priceInMinorUnits: number;
	currency: string;
	imageUrl: string | null;
	available: boolean;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: args.name,
		description: args.description,
		inLanguage: LOCALE_HTML_LANG[args.locale],
		url: absoluteUrl(`/${LOCALE_PREFIXES[args.locale]}/shop`),
		brand: { '@type': 'Brand', name: 'Bezstresowo' },
		...(args.imageUrl ? { image: [args.imageUrl] } : {}),
		offers: {
			'@type': 'Offer',
			priceCurrency: args.currency,
			price: (args.priceInMinorUnits / 100).toFixed(2),
			availability: args.available
				? 'https://schema.org/InStock'
				: 'https://schema.org/OutOfStock'
		}
	};
}
