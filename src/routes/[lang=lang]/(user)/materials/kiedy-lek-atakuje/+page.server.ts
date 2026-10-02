import { BOOKS, bookSalesReady } from '$shared/server/services/book-delivery';
import { redirect } from '@sveltejs/kit';
export const load = ({ params }) => {
	if (params.lang !== 'pl') redirect(307, '/uk/materials/koly-tryvoha-atakuie');
	return { bookSalesReady: bookSalesReady(BOOKS['kiedy-lek-atakuje-pl']) };
};
