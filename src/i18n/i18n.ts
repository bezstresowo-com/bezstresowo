import { isNil } from 'lodash-es';
import { derived, writable } from 'svelte/store';

import { Locale, TRANSLATIONS } from './model';

export const DEFAULT_LOCALE = Locale.enUS;
export const currentLocale = writable(DEFAULT_LOCALE);

export const translate = derived(
	currentLocale,
	($currentLocale) =>
		(translationString: string, vars = {}) => {
			return parseTranslation($currentLocale, translationString, vars);
		}
);

function parseTranslation(locale: Locale, translationString: string, vars?: Record<string, any>) {
	const translationFile = TRANSLATIONS[locale];

	if (isNil(translationFile)) {
		return translationString;
	}

	const [keysString, inlineVarsString] = translationString.split('@') as [
		string,
		string | undefined
	];

	vars = !isNil(inlineVarsString) ? JSON.parse(inlineVarsString) : null;

	const keys = keysString.split('.');
	let text = translationFile as any;
	for (const k of keys) {
		try {
			// this will throw an error if the key doesn't exist
			text = text[k];
		} catch {
			return translationString;
		}
	}

	if (isNil(text) || typeof text !== 'string') {
		return translationString;
	}

	if (!isNil(vars)) {
		Object.keys(vars).map((k) => {
			const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
			text = text.replace(regex, `${vars[k]}`);
		});
	}

	return text;
}
