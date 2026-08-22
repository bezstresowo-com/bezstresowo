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

/** `name` indexes the `language` dictionary section: `t.language[name].label`. */
export const LOCALES_MAP = {
	[Locale.plPL]: {
		name: 'polish',
		iconSrc: asset('/flags/pl.svg')
	},
	[Locale.ukUA]: {
		name: 'ukrainian',
		iconSrc: asset('/flags/ua.svg')
	}
} as const satisfies Record<Locale, { name: keyof typeof plPL.language; iconSrc: string }>;

/**
 * The polish dictionary defines the shape every other dictionary has to match
 * - with the literal values widened, so translations only share the keys, not
 * the texts.
 */
type WidenLeaves<T> = { [K in keyof T]: T[K] extends string ? string : WidenLeaves<T[K]> };
export type Translation = WidenLeaves<typeof plPL>;

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
		const matched = Object.values(Locale).find((locale) =>
			locale.toLowerCase().startsWith(baseLang)
		);

		if (matched) {
			return matched;
		}
	}

	return null;
}
