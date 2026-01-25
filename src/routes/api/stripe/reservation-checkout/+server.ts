import { STRIPE_SK } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { validateRequest } from '$shared/server/functions/validate-body';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { ReservationCheckoutRequestDto } from './model';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	try {
		const body = await request.json();
		const validationResult = await validateRequest(body, ReservationCheckoutRequestDto);

		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const {
			priceId,
			therapyType,
			preferredDates,
			nameAndSurname,
			tel,
			email,
			message,
			successUrl,
			cancelUrl
		} = validationResult.dto;

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
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
			customer_email: email,
			metadata: {
				type: 'reservation',
				therapyType,
				preferredDates: JSON.stringify(preferredDates),
				nameAndSurname,
				tel,
				email,
				message: message ?? ''
			}
		});

		return json({
			sessionId: session.id,
			url: session.url
		});
	} catch (error: any) {
		console.error('Error creating reservation checkout session:', error);
		return json(
			{ error: 'Failed to create checkout session', details: error.message },
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
