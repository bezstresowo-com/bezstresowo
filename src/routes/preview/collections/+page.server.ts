import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({url}) => {
 if (env.VERCEL_ENV !== 'preview') error(404, 'Сторінку не знайдено');
 return {lang:url.searchParams.get('lang')==='pl'?'pl':'uk'};
};
