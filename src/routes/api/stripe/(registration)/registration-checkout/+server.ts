import { STRIPE_SK } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { validateRequest } from '$shared/server/functions/validate-body';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import {
	RegistrationCheckoutRequestDto,
	type ConsultationRegistrationCheckoutMetadata
} from './model';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	try {
		const body = await request.json();
		const validationResult = await validateRequest(body, RegistrationCheckoutRequestDto);

		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { priceId, therapyName, nameAndSurname, tel, email, message, successUrl, cancelUrl } =
			validationResult.dto;

		const price = await stripe.prices.retrieve(priceId, {
			expand: ['product']
		});

		if (!price.active) {
			return json({ error: 'Price is not active' }, { status: HttpStatus.BAD_REQUEST });
		}

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: successUrl,
			cancel_url: cancelUrl,
			phone_number_collection: {
				enabled: true
			},
			customer_email: email,
			metadata: {
				type: 'consultation-registration',
				therapyName: therapyName,
				nameAndSurname,
				tel,
				email,
				message: message ?? ''
			} satisfies ConsultationRegistrationCheckoutMetadata
		});

		return json({
			sessionId: session.id,
			url: session.url
		});
	} catch (error: any) {
		console.error('Error creating registration checkout session:', error);
		return json(
			{ error: 'Failed to create checkout session', details: error.message },
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}
