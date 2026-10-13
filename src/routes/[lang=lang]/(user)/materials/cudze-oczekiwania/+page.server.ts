import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
export function load({ params }) {
	if (params.lang !== 'pl') redirect(307, '/uk/materials/chuzhi-bazhannia');
	return { noindex: env.VERCEL_ENV !== 'production' };
}
