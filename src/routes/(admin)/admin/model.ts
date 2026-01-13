import { resolve } from '$app/paths';

export const PATHS = [
	{
		href: resolve('/(admin)/admin/blog'),
		label: 'admin.blog.label',
		description: 'admin.blog.description'
	}
] as const;
