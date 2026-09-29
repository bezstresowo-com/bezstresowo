import type { LocalizedProduct } from '$remote/dto/product';
import { OFFERED_SERVICES, type OfferedService } from './model';

export const CONSULTATION_SLUG = 'psychotherapy-consultation';

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
			imageUrl: product.imageUrl
		};
		if (product.slug === CONSULTATION_SLUG) cards.unshift(card);
		else cards.push(card);
	}
	return cards;
}
