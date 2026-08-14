import { page } from '$app/state';
import { isNil } from 'lodash-es';

import {
	DEFAULT_LOCALE,
	LOCALE_PREFIXES,
	Locale,
	TRANSLATIONS,
	toLocale,
	type LocalePrefix
} from './model';

/**
 * The active locale, derived from the `[lang]` route segment.
 *
 * Reading it off the URL (instead of a module level store) keeps it correct
 * during SSR, where module state is shared between concurrent requests.
 */
export function getLocale(): Locale {
	return toLocale(page.params?.lang);
}

export function getLocalePrefix(): LocalePrefix {
	return LOCALE_PREFIXES[getLocale()];
}

/** Translate `key` in the locale of the current page. */
export function t(key: string, vars?: Record<string, unknown>): string {
	return translateWith(getLocale(), key, vars);
}

/** Translate `key` in an explicit locale (server side code, emails, meta tags). */
export function translateWith(
	locale: Locale,
	translationString: string,
	vars: Record<string, unknown> = {}
): string {
	const translationFile = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE];

	const [keysString, inlineVarsString] = translationString.split('@') as [
		string,
		string | undefined
	];

	if (!isNil(inlineVarsString)) {
		try {
			vars = { ...vars, ...JSON.parse(inlineVarsString) };
		} catch {
			// an unparseable suffix means the string is not a translation key
		}
	}

	let text: unknown = translationFile;
	for (const key of keysString.split('.')) {
		if (isNil(text) || typeof text !== 'object') {
			return translationString;
		}

		text = (text as Record<string, unknown>)[key];
	}

	if (typeof text !== 'string') {
		return translationString;
	}

	return Object.entries(vars).reduce(
		(acc, [key, value]) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), `${value}`),
		text
	);
}

/**
 * Build a locale prefixed path: `localizedPath('/home', Locale.ukUA)` -> `/uk/home`.
 * Paths are always absolute and always carry a language prefix.
 */
export function localizedPath(path: string, locale: Locale = DEFAULT_LOCALE): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;

	return `/${LOCALE_PREFIXES[locale]}${normalized === '/' ? '' : normalized}`;
}

/** `localizedPath` bound to the locale of the current page. */
export function path(target: string): string {
	return localizedPath(target, getLocale());
}
