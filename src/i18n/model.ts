import enUK from './translations/en-US.json';
import plPL from './translations/pl-PL.json';
import ukUA from './translations/uk-UA.json';

export enum Locale {
	enUS = 'en-US',
	plPL = 'pl-PL',
	ukUA = 'uk-UA'
}

export const LOCALES_MAP: Record<Locale, { label: string; icon: string }> = {
	[Locale.enUS]: { label: 'language.english', icon: '/flags/us.svg' },
	[Locale.plPL]: { label: 'language.polish', icon: '/flags/pl.svg' },
	[Locale.ukUA]: { label: 'language.ukrainian', icon: '/flags/ua.svg' }
};

export const TRANSLATIONS = {
	[Locale.enUS]: enUK,
	[Locale.plPL]: plPL,
	[Locale.ukUA]: ukUA
};
