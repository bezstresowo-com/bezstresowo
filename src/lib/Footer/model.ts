import { Locale } from '$i18n';
import {
	localizedLocation,
	phoneHref,
	type PublicSiteSettings
} from '$shared/global/config/site-settings';

export function contactElements(settings: PublicSiteSettings, locale: Locale) {
	return [
		{
			id: 'email',
			label: settings.email,
			icon: 'fa-regular fa-envelope',
			href: `mailto:${settings.email}`
		},
		{
			id: 'phone',
			label: settings.phone,
			icon: 'fa fa-phone',
			href: phoneHref(settings.phone)
		},
		{
			id: 'location',
			label: localizedLocation(settings, locale),
			icon: 'fa fa-location-dot',
			href: undefined
		}
	];
}

/** `name` indexes the `t.user.footer.fastLinks` dictionary section. */
export const FAST_LINKS = [
	{ id: 'materials', name: 'materials', path: '/materials' },
	{ id: 'statute', name: 'termsOfService', path: '/terms-of-service' },
	{ id: 'gdpr', name: 'gdpr', path: '/gdpr' },
	{ id: 'priceList', name: 'priceList', path: '/price-list' }
] as const;

export function followMeLinks(settings: PublicSiteSettings, locale: Locale) {
	return [
		{
			id: 'facebook',
			label: 'Facebook',
			icon: 'fa-brands fa-facebook-f',
			href: settings.facebookUrl
		},
		...(locale === Locale.plPL
			? [
					{
						id: 'instagram-pl',
						label: 'Instagram Bezstresowo po polsku',
						icon: 'fa-brands fa-instagram',
						href: settings.instagramPlUrl
					}
				]
			: [
					{
						id: 'instagram-uk',
						label: 'Instagram Bezstresowo українською',
						icon: 'fa-brands fa-instagram',
						href: settings.instagramUkUrl
					},
					{
						id: 'telegram-uk',
						label: 'Telegram Bezstresowo українською',
						icon: 'fa-brands fa-telegram',
						href: settings.telegramUkUrl
					}
				])
	];
}
