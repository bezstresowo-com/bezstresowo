import { STRIPE_SK } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { validateRequest } from '$shared/server/functions/validate-body';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { CreateCheckoutSessionRequestDto } from './model';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	try {
		const body = await request.json();
		const validationResult = await validateRequest(body, CreateCheckoutSessionRequestDto);

		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { priceId, quantity = 1, successUrl, cancelUrl } = validationResult.dto;

		const price = await stripe.prices.retrieve(priceId, {
			expand: ['product']
		});

		if (!price.active) {
			return json({ error: 'Price is not active' }, { status: HttpStatus.BAD_REQUEST });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: quantity
				}
			],
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
			phone_number_collection: {
				enabled: true
			},
			metadata: {
				priceId: priceId,
				productId: (price.product as Stripe.Product).id,
				quantity: quantity.toString()
			}
		});

		return json({
			sessionId: session.id,
			url: session.url,
			product: {
				id: (price.product as Stripe.Product).id,
				name: (price.product as Stripe.Product).name
			}
		});
	} catch (error: any) {
		console.error('Error creating checkout session:', error);
		return json(
			{ error: 'Failed to create checkout session', details: error.message }, // nie tlumacze tego bo i tak to inaczej obsluguje na froncie
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
