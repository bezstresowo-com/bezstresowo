import { getServiceBySlug } from '$lib/ServicesSection/model';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params }) => {
	const service = getServiceBySlug(params.service);
	if (!service) return { product: null };
	const product = await prisma.product.findFirst({
		where: { slug: service.productSlug, active: true },
		include: { price: true }
	});
	return {
		product: product
			? {
					id: product.id,
					slug: product.slug,
					priceInMinorUnits: product.price.inMinorUnits,
					currency: product.price.currency,
					siteLocations: product.siteLocations,
					imageUrl: product.imageId ? new S3Service().buildUrl(product.imageId) : null
				}
			: null
	};
};
