import { Locale, LOCALES_MAP } from '$i18n';

export const ITEMS: {
	value: Locale;
	label: string;
	disabled?: boolean;
}[] = Object.values(Locale).map((locale) => ({
	label: LOCALES_MAP[locale].label,
	value: locale
}));
