import { collectionConfigReady } from '$shared/server/services/collection-delivery';
import { collectionLanguage } from '$shared/server/services/collection-order';
import { json } from '@sveltejs/kit';
export function GET({ url }) {
	let ready = false;
	try {
		ready = collectionConfigReady(collectionLanguage(url.searchParams.get('lang') ?? undefined));
	} catch {
		/* Unknown languages cannot start checkout. */
	}
	return json({ ready }, { headers: { 'Cache-Control': 'no-store' } });
}
