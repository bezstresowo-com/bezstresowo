import { resolve } from '$app/paths';

export const PATHS = [
	{
		href: resolve('/(admin)/admin/blog'),
		label: 'admin.blog.label',
		description: 'admin.blog.description'
	},
	{
		href: resolve('/(admin)/admin/shop'),
		label: 'admin.shop.label',
		description: 'admin.shop.description'
	}
] as const;
