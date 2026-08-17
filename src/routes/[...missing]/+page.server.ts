import { DEFAULT_LOCALE_PREFIX, isLocalePrefix } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

/** Pages that used to live at the site root, before the `/pl/` `/uk/` prefixes. */
const LEGACY_PAGES = [
	'home',
	'blog',
	'price-list',
	'shop',
	'registrations',
	'gdpr',
	'terms-of-service',
	'registration-success',
	'registration-cancel',
	'shop-success',
	'shop-cancel',
	// The panel moved under the language prefix too - keep the old bookmark alive.
	'admin'
];

/** Language prefixes that are no longer served (english was dropped). */
const RETIRED_PREFIXES = ['en', 'en-us', 'en-gb'];

/**
 * Permanently redirects every *known* legacy URL - including the retired
 * english ones - onto its polish equivalent so the old entries drop out of
 * Google's index. Everything else gets a real 404: redirecting typos and bot
 * scans to the home page would read as a soft-404 and would leave the site
 * with no not-found page at all.
 */
export const load: PageServerLoad = ({ params }) => {
	const segments = params.missing.split('/').filter(Boolean);

	if (RETIRED_PREFIXES.includes((segments[0] ?? '').toLowerCase())) {
		segments.shift();
	}

	const prefix = isLocalePrefix(segments[0]) ? (segments.shift() as string) : DEFAULT_LOCALE_PREFIX;
	const [page, ...rest] = segments;

	// The bare site root was a legacy URL too (`/en`, a retired prefix alone).
	if (page === undefined) {
		redirect(HttpStatus.PERMANENT_REDIRECT, `/${prefix}/home`);
	}

	// `/blog/<id>` used database ids; articles are addressed by slug now, so the
	// only safe target is the blog index.
	if (page === 'blog' && rest.length > 0) {
		redirect(HttpStatus.PERMANENT_REDIRECT, `/${prefix}/blog`);
	}

	if (LEGACY_PAGES.includes(page) && rest.length === 0) {
		redirect(HttpStatus.PERMANENT_REDIRECT, `/${prefix}/${page}`);
	}

	error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
};
