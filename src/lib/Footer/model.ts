import { asset } from '$app/paths';

export const CONTACT_ELEMENTS = [
	{
		id: 'email',
		label: 'beztresowo@gmail.com',
		icon: 'fa-regular fa-envelope',
		href: 'mailto:beztresowo@gmail.com'
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

// TODO: make right
export const FAST_LINKS = [
	{
		id: 'statute',
		label: 'user.footer.fastLinks.termsOfService',
		href: '/terms-of-service'
	},
	{
		id: 'gdpr',
		label: 'user.footer.fastLinks.gdpr',
		href: '/gdpr'
	},
	{
		id: 'price-list',
		label: 'user.footer.fastLinks.priceList',
		href: asset('/documents/Cennik - Centrum Psychoterapii Bezstresowo - Olesya Haiduk.pdf'),
		download: true
	}
];

// TODO: make right
export const FOLLOW_ME_LINKS = [
	{
		id: 'facebook',
		label: 'facebook',
		icon: 'fa-brands fa-facebook-f',
		href: 'facebook.com'
	},
	{
		id: 'instagram',
		label: 'instagram',
		icon: 'fa-brands fa-instagram',
		href: 'instagram.com'
	},
	{
		id: 'linkedin',
		label: 'linkedin',
		icon: 'fa-brands fa-telegram',
		href: 'linkedin.com'
	}
];
