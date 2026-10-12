import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
 if (params.lang !== 'uk') redirect(307, '/pl/materials');
 return { lang: 'uk', noindex: env.VERCEL_ENV !== 'production' };
};
