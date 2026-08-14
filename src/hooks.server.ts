import { LOCALE_HTML_LANG, toLocale } from '$i18n';

import type { Handle, HandleValidationError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const [, maybePrefix] = event.url.pathname.split('/');
	const locale = toLocale(maybePrefix);

	event.locals.locale = locale;

	return resolve(event, {
		// `<html lang>` follows the language prefix of the URL.
		transformPageChunk: ({ html }) => html.replace('%lang%', LOCALE_HTML_LANG[locale])
	});
};

/**
 * Remote function inputs are validated with the existing class-validator DTOs
 * (see `$shared/server/functions/dto-schema`), whose messages are translation
 * keys - they are forwarded to the client so forms can show field level errors.
 */
export const handleValidationError: HandleValidationError = ({ issues }) => {
	const byField = new Map<string, string[]>();

	for (const issue of issues) {
		const field = (issue.path ?? []).map((segment) => String(segment)).join('.');
		byField.set(field, [...(byField.get(field) ?? []), issue.message]);
	}

	return {
		message: 'api.errors.BAD_REQUEST',
		issues: [...byField].map(([field, messages]) => ({ field, messages }))
	};
};
