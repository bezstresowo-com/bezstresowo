import {
	collectionAccess,
	collectionLink,
	validCollectionSessionId,
	verifyCollectionToken
} from '$shared/server/services/collection-delivery';
import { collectionNames } from '$shared/server/services/collection-order';
import { error, redirect } from '@sveltejs/kit';
export async function load({ url, setHeaders, params }) {
	setHeaders({
		'cache-control': 'private, no-store',
		'referrer-policy': 'same-origin',
		'x-robots-tag': 'noindex, nofollow'
	});
	if (params.lang !== 'uk' && params.lang !== 'pl') error(404, 'Not found');
	const pl = params.lang === 'pl';
	const session = url.searchParams.get('session_id');
	if (session && validCollectionSessionId(session)) {
		let access;
		try {
			access = await collectionAccess(session, url.origin);
		} catch {
			error(403, pl ? 'Płatność nie została jeszcze potwierdzona.' : 'Оплату ще не підтверджено.');
		}
		redirect(303, collectionLink(session, url.origin, access.lang));
	}
	const token = url.searchParams.get('token') ?? '';
	const id = verifyCollectionToken(token);
	if (!id) error(403, pl ? 'Nieprawidłowy link.' : 'Недійсне посилання.');
	let access;
	try {
		access = await collectionAccess(id, url.origin);
	} catch {
		error(403, pl ? 'Płatność nie została potwierdzona.' : 'Оплату не підтверджено.');
	}
	if (params.lang !== access.lang) redirect(303, collectionLink(id, url.origin, access.lang));
	return {
		lang: access.lang,
		token,
		collections: access.order.ids.map((id) => ({ id, name: collectionNames(access.lang)[id] }))
	};
}
