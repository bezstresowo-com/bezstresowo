import { redirect } from '@sveltejs/kit';
export function load({ params }) {
 if (params.lang !== 'uk') redirect(307, '/pl/materials');
 return { lang: 'uk' };
}
