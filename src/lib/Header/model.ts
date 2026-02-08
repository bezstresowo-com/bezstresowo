import { resolve } from '$app/paths';

export const HEADER_PATHS = [
	{
		label: 'user.header.items.home',
		href: resolve('/(user)/home')
	},
	{
		label: 'user.header.items.blog',
		href: resolve('/(user)/blog')
	},
	{
		label: 'user.header.items.shop',
		href: resolve('/(user)/shop')
	},
	{
		label: 'user.header.items.registrations',
		href: resolve('/(user)/registrations')
	}
];
