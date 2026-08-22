import { page } from '$app/state';
import { isNil } from 'lodash-es';

import {
	DEFAULT_LOCALE,
	Locale,
	LOCALE_PREFIXES,
	toLocale,
	TRANSLATIONS,
	type LocalePrefix
} from './model';
import plPL from './translations/pl-PL';

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

/* ------------------------- object based translations ------------------------ */

type Trim<S extends string> = S extends ` ${infer Rest}`
	? Trim<Rest>
	: S extends `${infer Rest} `
		? Trim<Rest>
		: S;

type VarNames<S extends string> = S extends `${string}{{${infer Variable}}}${infer Rest}`
	? Trim<Variable> | VarNames<Rest>
	: never;

/** `'jeszcze {{ count }} znaków'` -> `{ count: string | number }`. */
type TranslationVars<S extends string> = { [K in VarNames<S>]: string | number };

type TranslatedLeaf<S extends string> = [VarNames<S>] extends [never]
	? string
	: (vars: TranslationVars<S>) => string;

type TranslationTree<T> = {
	readonly [K in keyof T]: T[K] extends string ? TranslatedLeaf<T[K]> : TranslationTree<T[K]>;
};

/**
 * The dictionary resolved for one locale, addressed with plain property
 * access: static entries are strings, entries with `{{ placeholders }}` are
 * functions requiring exactly those variables. The polish dictionary is the
 * source of the shape (including which entries are parameterized).
 */
export type Translations = TranslationTree<typeof plPL>;

const HAS_VARS = /{{\s*\w+\s*}}/;
const VAR_PATTERN = /{{\s*(\w+)\s*}}/g;

function interpolate(text: string, vars: Record<string, unknown>): string {
	// Function replacement - `$&` / `$$` in user provided values must stay literal.
	return text.replace(VAR_PATTERN, (match, name: string) =>
		name in vars ? `${vars[name]}` : match
	);
}

/**
 * Static leaves stay strings, parameterized ones become interpolating
 * functions. Whether a leaf is parameterized is decided by the *polish*
 * dictionary - the same source `Translations` is derived from - so a
 * translation that forgot a placeholder still matches the declared type.
 */
function resolveTree(reference: unknown, dictionary: unknown): unknown {
	if (typeof reference === 'string') {
		const text = dictionary as string;

		return HAS_VARS.test(reference)
			? (vars: Record<string, unknown>) => interpolate(text, vars)
			: text;
	}

	if (Array.isArray(reference)) {
		const items = dictionary as unknown[];

		return reference.map((item, index) => resolveTree(item, items[index]));
	}

	const referenceRecord = reference as Record<string, unknown>;
	const dictionaryRecord = dictionary as Record<string, unknown>;

	return Object.fromEntries(
		Object.keys(referenceRecord).map((key) => [
			key,
			resolveTree(referenceRecord[key], dictionaryRecord[key])
		])
	);
}

const RESOLVED = Object.fromEntries(
	Object.entries(TRANSLATIONS).map(([locale, dictionary]) => [
		locale,
		resolveTree(plPL, dictionary)
	])
) as Record<Locale, Translations>;

/** The whole dictionary of an explicit locale (emails, og image, error pages). */
export function translationsFor(locale: Locale): Translations {
	return RESOLVED[locale];
}

/**
 * Translations of the current page's locale: `t.user.footer.copyright`,
 * `t.admin.seoFields.charactersLeft({ count: 3 })`.
 *
 * Only the root is a proxy - every access re-reads the locale from the URL,
 * so template expressions stay reactive to language switches. Read it inside
 * templates / `$derived`, never capture leaves at module level.
 */
export const t: Translations = new Proxy({} as Translations, {
	get: (_, property) => (translationsFor(getLocale()) as Record<PropertyKey, unknown>)[property]
});

/* --------------------- key based lookups (runtime keys) --------------------- */

/**
 * Resolves a translation from a *runtime* string key - `'a.b.c'`, optionally
 * carrying inline variables (`'a.b.c@{"count":3}'`). Returns the input
 * unchanged when it does not point at a string.
 *
 * Only for keys that arrive as data: validation issues and `App.Error`
 * messages sent by the server, yup schema messages surfaced through form
 * state. Everything known at build time goes through the `t` object instead.
 */
export function translateKey(key: string, vars?: Record<string, unknown>): string {
	return translateKeyWith(getLocale(), key, vars);
}

/** `translateKey` for an explicit locale (server side code). */
export function translateKeyWith(
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

	return interpolate(text, vars);
}

/* --------------------------------- routing --------------------------------- */

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
