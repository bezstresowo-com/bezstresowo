import { HttpStatus } from '$shared/global/enums/http-status';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

/** `/pl` and `/uk` have no page of their own. */
export const load: PageServerLoad = ({ params }) => {
	redirect(HttpStatus.PERMANENT_REDIRECT, `/${params.lang}/home`);
};
