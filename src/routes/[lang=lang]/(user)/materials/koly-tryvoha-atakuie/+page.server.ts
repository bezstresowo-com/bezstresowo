import { bookSalesReady } from '$shared/server/services/book-delivery';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
	if (params.lang !== 'uk') redirect(307, '/pl/materials/kiedy-lek-atakuje');
	return { bookSalesReady: bookSalesReady() };
};
