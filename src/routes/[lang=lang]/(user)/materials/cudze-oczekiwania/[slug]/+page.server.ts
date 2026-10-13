import { env } from '$env/dynamic/private';
import { COLLECTIONS_PL } from '$lib/Materials/collections-catalog-pl';
import { collectionConfigReady } from '$shared/server/services/collection-delivery';
import { error } from '@sveltejs/kit';
export function load({ params }) {
	const collection = COLLECTIONS_PL.find((item) => item.slug === params.slug);
	if (params.lang !== 'pl' || !collection) error(404, 'Nie znaleziono zbioru');
	return {
		collection,
		noindex: env.VERCEL_ENV !== 'production',
		purchaseReady: collectionConfigReady('pl')
	};
}
