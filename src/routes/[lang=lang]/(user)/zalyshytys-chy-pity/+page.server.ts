import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	if (params.lang !== 'uk') {
		error(404, 'Сторінка доступна лише українською мовою');
	}
};
