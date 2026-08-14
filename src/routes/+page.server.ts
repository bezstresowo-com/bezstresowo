import { DEFAULT_LOCALE, LOCALE_PREFIXES, matchPreferredLocale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

/** `/` has no language of its own - send visitors to their best match. */
export const load: PageServerLoad = ({ request }) => {
	const acceptLanguage = request.headers.get('accept-language') ?? '';
	const preferred = acceptLanguage
		.split(',')
		.map((entry) => entry.split(';')[0].trim())
		.filter(Boolean);

	const locale = matchPreferredLocale(preferred) ?? DEFAULT_LOCALE;

	redirect(HttpStatus.FOUND, `/${LOCALE_PREFIXES[locale]}/home`);
};
