import { STRIPE_SK } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RegistrationProduct } from './model';

export async function GET() {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	const products: Stripe.Response<Stripe.ApiList<Stripe.Product>> = await stripe.products.list({
		active: true,
		expand: ['data.default_price']
	});

	const registrationProducts: RegistrationProduct[] = products.data
		.filter((product) => product.metadata?.siteLocation === 'registrations')
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
				id: product.id,
				name: product.name,
				description: product.description,
				defaultPrice
			};
		});

	return json({ data: registrationProducts });
}
