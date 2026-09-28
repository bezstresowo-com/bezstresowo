import { env } from '$env/dynamic/private';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { isCoursePurchaseEventConfigured } from '$shared/server/services/sendpulse/course-purchase-event';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.lang !== 'uk') {
		redirect(307, '/pl/shop');
	}

	const product = await prisma.product.findUnique({
		where: { slug: 'kryza-chy-kinets' },
		include: { price: true, internationalizedProducts: true }
	});

	return {
		purchaseReady:
			env.COURSE_UA_SALES_ENABLED === 'true' &&
			isCoursePurchaseEventConfigured() &&
			product?.active === true &&
			product.price.currency === 'EUR' &&
			product.price.inMinorUnits === 1900 &&
			product.internationalizedProducts.some((translation) => translation.lang === 'uk-UA')
	};
};
