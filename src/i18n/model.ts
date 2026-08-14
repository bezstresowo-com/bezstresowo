import { asset } from '$app/paths';

import plPL from './translations/pl-PL';
import ukUA from './translations/uk-UA';

export enum Locale {
	plPL = 'pl-PL',
	ukUA = 'uk-UA'
}

/** Polish is the default language of the whole site. */
export const DEFAULT_LOCALE = Locale.plPL;

/** The `[lang]` route segment every user facing page is prefixed with. */
export const LOCALE_PREFIXES = {
	[Locale.plPL]: 'pl',
	[Locale.ukUA]: 'uk'
} as const satisfies Record<Locale, string>;

export type LocalePrefix = (typeof LOCALE_PREFIXES)[Locale];

export const LOCALE_PREFIX_LIST = Object.values(LOCALE_PREFIXES) as LocalePrefix[];

export const PREFIX_TO_LOCALE = Object.fromEntries(
	Object.entries(LOCALE_PREFIXES).map(([locale, prefix]) => [prefix, locale as Locale])
) as Record<LocalePrefix, Locale>;

export const DEFAULT_LOCALE_PREFIX = LOCALE_PREFIXES[DEFAULT_LOCALE];

/** BCP 47 tag used in `<html lang>` and `hreflang`. */
export const LOCALE_HTML_LANG = {
	[Locale.plPL]: 'pl',
	[Locale.ukUA]: 'uk'
} as const satisfies Record<Locale, string>;

export const LOCALES_MAP: Record<
	Locale,
	{
		label: string;
		icon: {
			src: string;
			alt: string;
		};
	}
> = {
	[Locale.plPL]: {
		label: 'language.polish.label',
		icon: {
			src: asset('/flags/pl.svg'),
			alt: 'language.polish.alt'
		}
	},
	[Locale.ukUA]: {
		label: 'language.ukrainian.label',
		icon: {
			src: asset('/flags/ua.svg'),
			alt: 'language.ukrainian.alt'
		}
	}
};

/** The polish dictionary defines the shape every other dictionary has to match. */
export type Translation = typeof plPL;

export const TRANSLATIONS: Record<Locale, Translation> = {
	[Locale.plPL]: plPL,
	[Locale.ukUA]: ukUA
};

export function isLocalePrefix(value: string | undefined | null): value is LocalePrefix {
	return !!value && (LOCALE_PREFIX_LIST as string[]).includes(value);
}

export function toLocale(prefix: string | undefined | null): Locale {
	return isLocalePrefix(prefix) ? PREFIX_TO_LOCALE[prefix] : DEFAULT_LOCALE;
}

/**
 * Best effort match of the visitor's `Accept-Language` / `navigator.languages`
 * against the supported locales. Only used to pick the initial redirect target.
 */
export function matchPreferredLocale(preferred: readonly string[]): Locale | null {
	for (const lang of preferred) {
		const baseLang = lang.slice(0, 2).toLowerCase();
		const matched = Object.values(Locale).find((locale) => locale.toLowerCase().startsWith(baseLang));

		if (matched) {
			return matched;
		}
	}

	return null;
}
