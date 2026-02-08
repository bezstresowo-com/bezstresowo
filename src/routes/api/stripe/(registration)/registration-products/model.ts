import type Stripe from 'stripe';

export type RegistrationProduct = {
	id: string;
	name: string;
	description: string | null;
	defaultPrice: Stripe.Price | null;
};
