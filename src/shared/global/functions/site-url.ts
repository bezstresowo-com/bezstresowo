import { env } from '$env/dynamic/public';

/**
 * Canonical origin of the site, used for canonical links, hreflang, sitemaps
 * and `og:image` URLs. Falls back to production so a missing env var never
 * produces relative (and therefore invalid) social preview URLs.
 */
const configuredSiteUrl = (env.PUBLIC_SITE_URL || 'https://www.bezstresowo.org').replace(
	/\/+$/,
	''
);

/** Keep every production SEO URL on the final, redirect-free `www` origin. */
export const SITE_URL = configuredSiteUrl.replace(
	/^https:\/\/bezstresowo\.org$/,
	'https://www.bezstresowo.org'
);

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
