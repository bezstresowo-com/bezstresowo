import { DEFAULT_LOCALE, LOCALE_PREFIXES, matchPreferredLocale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

/** `/` has no language of its own - send visitors to their best match. */
export const load: PageServerLoad = ({ request }) => {
	const acceptLanguage = request.headers.get('accept-language') ?? '';
	const preferred = acceptLanguage
		.split(',')
		.map((entry) => {
			const [tag = '', ...params] = entry.trim().split(';');
			const qParam = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
			const quality = qParam === undefined ? 1 : Number(qParam.slice(2));

			return { tag: tag.trim(), quality: Number.isFinite(quality) ? quality : 0 };
		})
		.filter(({ tag, quality }) => tag.length > 0 && quality > 0)
		// The sort is stable, so entries with equal weights keep the header
		// order - which browsers already emit by preference.
		.sort((a, b) => b.quality - a.quality)
		.map(({ tag }) => tag);

	const locale = matchPreferredLocale(preferred) ?? DEFAULT_LOCALE;

	redirect(HttpStatus.FOUND, `/${LOCALE_PREFIXES[locale]}/home`);
};
