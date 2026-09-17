import { Locale } from '$i18n';

export type PublicSiteSettings = {
	phone: string;
	email: string;
	locationPl: string;
	locationUk: string;
	hoursWeek: string;
	hoursSaturday: string;
	facebookUrl: string;
	instagramPlUrl: string;
	instagramUkUrl: string;
	telegramUkUrl: string;
};

/** Safe public values used until the singleton is saved from the panel. */
export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
	phone: '+48 795 819 910',
	email: 'bezstresowo.org@gmail.com',
	locationPl: 'Łódź, Polska',
	locationUk: 'Лодзь, Польща',
	hoursWeek: '9:00 - 18:00',
	hoursSaturday: '10:00 - 14:00',
	facebookUrl: 'https://www.facebook.com/profile.php?id=100088923916892',
	instagramPlUrl: 'https://www.instagram.com/_bezstresowo_/',
	instagramUkUrl: 'https://www.instagram.com/_bezstresovo_psychology/',
	telegramUkUrl: 'https://t.me/zhinochi_spravy_psychologia'
};

export function localizedLocation(settings: PublicSiteSettings, locale: Locale): string {
	return locale === Locale.ukUA ? settings.locationUk : settings.locationPl;
}

export function phoneHref(phone: string): string {
	return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
