import type { LocalizedProduct } from '$remote/dto/product';
import { OFFERED_SERVICES, type OfferedService } from './model';

export const CONSULTATION_SLUG = 'psychotherapy-consultation';
export const CONSULTATION_IMAGE_URL =
	'https://s3-bezstresowo.s3.eu-central-1.amazonaws.com/4ac87e07-7396-43c1-bc89-4515f8e67d03';

export function isCatalogService(product: Pick<LocalizedProduct, 'slug' | 'siteLocations'>) {
	return (
		product.slug === CONSULTATION_SLUG ||
		product.siteLocations.some((location) => location === 'shop' || location === 'registrations')
	);
}

export type ServiceCard = {
	key: string;
	href: string;
	service?: OfferedService;
	product?: LocalizedProduct;
	imageUrl: string | null;
};

/** Keep the existing SEO URLs and append services managed through the admin panel. */
export function serviceCards(products: LocalizedProduct[]): ServiceCard[] {
	const cards: ServiceCard[] = OFFERED_SERVICES.map((service) => {
		const product = products.find((item) => item.slug === service.productSlug);
		return {
			key: service.slug,
			href: `/${service.slug}`,
			service,
			product,
			imageUrl: product?.imageUrl ?? service.imageUrl
		};
	});
	for (const product of products.filter(isCatalogService)) {
		if (OFFERED_SERVICES.some((service) => service.productSlug === product.slug)) continue;
		const card = {
			key: product.slug,
			href: `/services/${product.slug}`,
			product,
			imageUrl:
				product.imageUrl ?? (product.slug === CONSULTATION_SLUG ? CONSULTATION_IMAGE_URL : null)
		};
		if (product.slug === CONSULTATION_SLUG) cards.unshift(card);
		else cards.push(card);
	}
	return cards;
}
