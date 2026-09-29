import { DEFAULT_LOCALE, toLocale } from '$i18n';
import { isCatalogService } from '$lib/ServicesSection/catalog';
import { OFFERED_SERVICES } from '$lib/ServicesSection/model';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const existing = OFFERED_SERVICES.find((service) => service.productSlug === params.slug);
	if (existing) redirect(301, `/${params.lang}/${existing.slug}`);
	const product = await prisma.product.findFirst({
		where: { slug: params.slug, active: true },
		include: { price: true, internationalizedProducts: true }
	});
	if (!product || !isCatalogService(product)) error(404, 'Service not found');
	const locale = toLocale(params.lang);
	const translation =
		product.internationalizedProducts.find((item) => item.lang === locale) ??
		product.internationalizedProducts.find((item) => item.lang === DEFAULT_LOCALE) ??
		product.internationalizedProducts[0];
	if (!translation) error(404, 'Service not found');
	return {
		product: {
			id: product.id,
			slug: product.slug,
			name: translation.name,
			description: translation.description,
			priceInMinorUnits: product.price.inMinorUnits,
			currency: product.price.currency,
			siteLocations: product.siteLocations,
			imageUrl: product.imageId ? new S3Service().buildUrl(product.imageId) : null
		}
	};
};
