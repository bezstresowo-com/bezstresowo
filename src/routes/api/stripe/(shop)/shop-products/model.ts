import type Stripe from 'stripe';

export type ShopProductMetadata = {
	siteLocation?: string;
	orderKey?: string;
}

export type ProductWithDefaultPrice = {
	product: Stripe.Product;
	defaultPrice: Stripe.Price | null;
};
