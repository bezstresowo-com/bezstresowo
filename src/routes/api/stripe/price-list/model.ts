import type Stripe from 'stripe';

export type PriceListProduct = {
	name: string;
	defaultPrice: Stripe.Price | null;
};

export type PriceListProducts = {
	products: PriceListProduct[];
};
