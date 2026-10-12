import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { COLLECTIONS } from '$lib/Materials/collections-catalog';
import { collectionConfigReady } from '$shared/server/services/collection-delivery';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
 const collection = COLLECTIONS.find((item) => item.slug === params.slug);
 if (params.lang !== 'uk' || !collection) error(404, 'Збірку не знайдено');
 return { collection, noindex: env.VERCEL_ENV !== 'production', purchaseReady: collectionConfigReady() };
};
