import { STRIPE_SK, STRIPE_WHSEC } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function GET() {
	const webhookSecret = STRIPE_WHSEC;
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	if (!webhookSecret) {
		return json({ error: 'Webhook signature or secret missing' }, { status: 400 });
	}

	const myProducts: Stripe.Response<Stripe.ApiList<Stripe.Product>> = await stripe.products.list({
		active: true,
		expand: ['data.default_price']
	});

	const processedProducts = myProducts.data.map(product => {
		const rawPrice = product.default_price;

		if(!rawPrice || typeof rawPrice === 'string' || ('deleted' in rawPrice && rawPrice.deleted)) {
			return {
				product,
				defaultPrice: null
			}
		}

		const defaultPrice = rawPrice as Stripe.Price;

		return {
			product,
			defaultPrice: defaultPrice
		};
	});

	return json({ data: processedProducts });
}
