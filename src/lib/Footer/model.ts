import { Locale } from '$i18n';

export const CONTACT_ELEMENTS = [
	{
		id: 'email',
		label: 'bezstresowo.org@gmail.com',
		icon: 'fa-regular fa-envelope',
		href: 'mailto:bezstresowo.org@gmail.com'
	},
	{
		id: 'phone',
		label: '+48 795 819 910',
		icon: 'fa fa-phone',
		href: 'tel:+48795819910'
	},
	{
		id: 'location',
		label: 'Łódź, Polska',
		icon: 'fa fa-location-dot'
	}
];

/** `name` indexes the `t.user.footer.fastLinks` dictionary section. */
export const FAST_LINKS = [
	{ id: 'statute', name: 'termsOfService', path: '/terms-of-service' },
	{ id: 'gdpr', name: 'gdpr', path: '/gdpr' },
	{ id: 'priceList', name: 'priceList', path: '/price-list' }
] as const;

export const FOLLOW_ME_LINKS = [
	{
		id: 'facebook',
		label: 'facebook',
		icon: 'fa-brands fa-facebook-f',
		href: 'https://www.facebook.com/profile.php?id=100088923916892',
		locales: [Locale.plPL, Locale.ukUA]
	},
	{
		id: 'instagram-pl',
		label: 'Instagram Bezstresowo po polsku',
		icon: 'fa-brands fa-instagram',
		href: 'https://www.instagram.com/_bezstresowo_/',
		locales: [Locale.plPL]
	},
	{
		id: 'instagram-uk',
		label: 'Instagram Bezstresowo українською',
		icon: 'fa-brands fa-instagram',
		href: 'https://www.instagram.com/_bezstresovo_psychology/',
		locales: [Locale.ukUA]
	},
	{
		id: 'telegram-uk',
		label: 'Telegram Bezstresowo українською',
		icon: 'fa-brands fa-telegram',
		href: 'https://t.me/about_you_therapy',
		locales: [Locale.ukUA]
	}
] as const;
