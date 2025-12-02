import { STRIPE_SK } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { CreateCheckoutSessionRequestDto } from './model';
import { validateRequest } from '$shared/server/functions/validate-body';
import { HttpStatus } from '$shared/global/enums/http-status';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	try {
		// Walidacja body
		const body = await request.json();
		const validationResult = await validateRequest(body, CreateCheckoutSessionRequestDto);

		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { priceId, quantity = 1, successUrl, cancelUrl } = validationResult.dto;

		// Pobierz informacje o cenie produktu
		const price = await stripe.prices.retrieve(priceId, {
			expand: ['product']
		});

		if (!price.active) {
			return json({ error: 'Price is not active' }, { status: HttpStatus.BAD_REQUEST });
		}

		// Utwórz Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: quantity,
				},
			],
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
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
			{ error: 'Failed to create checkout session', details: error.message }, 
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}