import type Stripe from 'stripe';

export type ReservationProduct = {
	id: string;
	name: string;
	description: string | null;
	defaultPrice: Stripe.Price | null;
};
