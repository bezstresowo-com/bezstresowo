import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	if (params.lang !== 'uk') redirect(307, '/pl/materials/kiedy-mysli-nie-daja-spokoju');
	return {};
};
