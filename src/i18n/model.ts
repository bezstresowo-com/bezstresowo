import enUK from './translations/en-US.json';
import plPL from './translations/pl-PL.json';
import ukUA from './translations/uk-UA.json';

export enum Locale {
	enUS = 'en-US',
	plPL = 'pl-PL',
	ukUA = 'uk-UA'
}

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
	[Locale.enUS]: {
		label: 'language.english.label',
		icon: {
			src: '/flags/us.svg',
			alt: 'language.english.alt'
		}
	},
	[Locale.plPL]: {
		label: 'language.polish.label',
		icon: {
			src: '/flags/pl.svg',
			alt: 'language.polish.alt'
		}
	},
	[Locale.ukUA]: {
		label: 'language.ukrainian.label',
		icon: {
			src: '/flags/ua.svg',
			alt: 'language.ukrainian.alt'
		}
	}
};

export const TRANSLATIONS = {
	[Locale.enUS]: enUK,
	[Locale.plPL]: plPL,
	[Locale.ukUA]: ukUA
};

export function getUserPreferredLocale(): Locale {
	const userPreferredLangs = navigator.languages || [navigator.language];
	const supportedLocales = Object.values(Locale);

	for (const lang of userPreferredLangs) {
		const baseLang = lang.slice(0, 2);
		const matchedLocale = supportedLocales.find((supported) => supported.startsWith(baseLang));

		if (matchedLocale) {
			return matchedLocale;
		}
	}

	return Locale.enUS;
}
