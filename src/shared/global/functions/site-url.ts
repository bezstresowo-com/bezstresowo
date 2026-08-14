import { env } from '$env/dynamic/public';

/**
 * Canonical origin of the site, used for canonical links, hreflang, sitemaps
 * and `og:image` URLs. Falls back to production so a missing env var never
 * produces relative (and therefore invalid) social preview URLs.
 */
export const SITE_URL = (env.PUBLIC_SITE_URL || 'https://bezstresowo.org').replace(/\/+$/, '');

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
