import { DEFAULT_LOCALE_PREFIX, isLocalePrefix } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { redirect } from '@sveltejs/kit';

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
	'shop-cancel'
];

/** Language prefixes that are no longer served (english was dropped). */
const RETIRED_PREFIXES = ['en', 'en-us', 'en-gb'];

/**
 * Permanently redirects every legacy URL - including the retired english ones -
 * onto its polish equivalent so the old entries drop out of Google's index.
 */
export const load: PageServerLoad = ({ params }) => {
	const segments = params.missing.split('/').filter(Boolean);

	if (RETIRED_PREFIXES.includes((segments[0] ?? '').toLowerCase())) {
		segments.shift();
	}

	const prefix = isLocalePrefix(segments[0]) ? (segments.shift() as string) : DEFAULT_LOCALE_PREFIX;
	const [page, ...rest] = segments;

	// `/blog/<id>` used database ids; articles are addressed by slug now, so the
	// only safe target is the blog index.
	if (page === 'blog' && rest.length > 0) {
		redirect(HttpStatus.PERMANENT_REDIRECT, `/${prefix}/blog`);
	}

	redirect(
		HttpStatus.PERMANENT_REDIRECT,
		LEGACY_PAGES.includes(page) ? `/${prefix}/${page}` : `/${prefix}/home`
	);
};
