import { STRIPE_SK } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { PriceListProduct, PriceListProducts } from './model';

export async function GET() {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	const products = await stripe.products.list({
		active: true,
		expand: ['data.default_price']
	});

	const productList: PriceListProduct[] = products.data
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((product) => {
			const rawPrice = product.default_price;

			let defaultPrice: Stripe.Price | null = null;
			if (
				rawPrice &&
				typeof rawPrice !== 'string' &&
				!('deleted' in rawPrice && rawPrice.deleted)
			) {
				defaultPrice = rawPrice as Stripe.Price;
			}

			return {
				name: product.name,
				defaultPrice
			};
		});

	const response: PriceListProducts = { products: productList };

	return json(response);
}
