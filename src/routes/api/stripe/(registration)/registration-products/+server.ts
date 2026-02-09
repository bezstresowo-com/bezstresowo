import { STRIPE_SK } from '$env/static/private';
import Stripe from 'stripe';

import { json } from '@sveltejs/kit';

import type { RegistrationProduct, RegistrationProductMetadata } from './model';

export async function GET() {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	const products: Stripe.Response<Stripe.ApiList<Stripe.Product>> = await stripe.products.list({
		active: true,
		expand: ['data.default_price']
	});

	const registrationProducts: RegistrationProduct[] = products.data
		.filter((product) =>
			/registrations/.test((product.metadata as RegistrationProductMetadata)?.siteLocation ?? '')
		)
		.sort((productA, productB) => {
			const orderMetricA =
				(productA.metadata as RegistrationProductMetadata)?.orderKey ?? productA.name;
			const orderMetricB =
				(productB.metadata as RegistrationProductMetadata)?.orderKey ?? productB.name;

			return orderMetricA.localeCompare(orderMetricB);
		})
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
