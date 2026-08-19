/**
 * Paths are language agnostic - `path()` prefixes them with the active locale.
 * `name` indexes the `t.user.header.items` dictionary section.
 */
export const HEADER_PATHS = [
	{ name: 'home', path: '/home' },
	{ name: 'blog', path: '/blog' },
	{ name: 'shop', path: '/shop' },
	{ name: 'registrations', path: '/registrations' }
] as const;
