import type Stripe from 'stripe';

export type RegistrationProductMetadata = Stripe.Metadata & {
	orderKey?: string;
	siteLocation?: string;
};

export type RegistrationProduct = {
	id: string;
	name: string;
	description: string | null;
	defaultPrice: Stripe.Price | null;
};
