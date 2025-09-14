import { isNil } from 'lodash-es';
import { derived, writable } from 'svelte/store';

import { Locale, TRANSLATIONS } from './model';

export const DEFAULT_LOCALE = Locale.enUK;
export const currentLocale = writable(DEFAULT_LOCALE);

export const translate = derived(currentLocale, ($currentLocale) => (key: string, vars = {}) => {
	return parseTranslation($currentLocale, key, vars);
});

function parseTranslation(locale: Locale, key: string, vars?: Record<string, string>) {
	const translationFile = TRANSLATIONS[locale];

	if (isNil(translationFile)) {
		return key;
	}

	const keys = key.split('.');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let text = translationFile as any;
	for (const k of keys) {
		try {
			// this will throw an error if the key doesn't exist
			text = text[k];
		} catch {
			return key;
		}
	}

	if (isNil(text) || typeof text !== 'string') {
		return key;
	}

	if (!isNil(vars)) {
		Object.keys(vars).map((k) => {
			const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
			text = text.replace(regex, vars[k]);
		});
	}

	return text;
}
