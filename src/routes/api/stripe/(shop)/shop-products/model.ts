import type Stripe from 'stripe';

export type ProductWithDefaultPrice = {
	product: Stripe.Product;
	defaultPrice: Stripe.Price | null;
};
