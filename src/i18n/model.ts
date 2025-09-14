import enUK from './translations/en-UK.json';
import plPL from './translations/pl-PL.json';
import ukUA from './translations/uk-UA.json';

export enum Locale {
	enUK = 'en-UK',
	plPL = 'pl-PL',
	ukUA = 'uk-UA'
}

export const LOCALES_MAP: Record<Locale, { label: string; icon: string }> = {
	[Locale.enUK]: { label: 'language.english', icon: '/flags/uk.svg' },
	[Locale.plPL]: { label: 'language.polish', icon: '/flags/pl.svg' },
	[Locale.ukUA]: { label: 'language.ukrainian', icon: '/flags/ua.svg' }
};

export const TRANSLATIONS = {
	[Locale.enUK]: enUK,
	[Locale.plPL]: plPL,
	[Locale.ukUA]: ukUA
};
