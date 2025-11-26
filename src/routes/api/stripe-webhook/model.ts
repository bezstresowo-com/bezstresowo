import type Stripe from "stripe";

export type GetProductsResponseDto = {
	products: Product[];
}

export type Product = {
	id: string;
	name: string;
	description: string;
	default_price: Stripe.Price;
	images: string[];
	metadata?: Stripe.Metadata;
}
