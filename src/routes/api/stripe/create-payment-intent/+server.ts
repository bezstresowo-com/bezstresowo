import { STRIPE_SK } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { CreatePaymentIntentRequestDto } from './model.js';
import { validateRequest } from '$shared/server/functions/validate-body';
import { HttpStatus } from '$shared/global/enums/http-status';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	try {
		// Walidacja body
		const body = await request.json();
		const validationResult = await validateRequest(body, CreatePaymentIntentRequestDto);

		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { priceId, quantity = 1 } = validationResult.dto;

		// Pobierz informacje o cenie produktu
		const price = await stripe.prices.retrieve(priceId, {
			expand: ['product']
		});

		if (!price.active) {
			return json({ error: 'Price is not active' }, { status: HttpStatus.BAD_REQUEST });
		}

		// Oblicz kwotę
		const amount = price.unit_amount! * quantity;

		// Utwórz Payment Intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: price.currency,
			payment_method: 'pm_card_visa',
			payment_method_types: ['card'],
			metadata: {
				priceId: priceId,
				productId: (price.product as Stripe.Product).id,
				quantity: quantity.toString()
			}
		});

		return json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			amount: amount,
			currency: price.currency,
			product: {
				id: (price.product as Stripe.Product).id,
				name: (price.product as Stripe.Product).name
			}
		});
	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		return json(
			{ error: 'Failed to create payment intent', details: error.message },
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
