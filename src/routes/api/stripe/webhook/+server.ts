import { STRIPE_SK, STRIPE_WHSEC } from '$env/static/private';
import { toLocale } from '$i18n';
import type { StripeSessionMetadata } from '$remote/dto/stripe-metadata';
import { HttpStatus } from '$shared/global/enums/http-status';
import { EmailService } from '$shared/server/services/email/email-service';
import { json, text } from '@sveltejs/kit';
import { isNil } from 'lodash-es';
import Stripe from 'stripe';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as never
	});

	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature || !STRIPE_WHSEC) {
		return json(
			{ error: 'Missing signature or webhook secret' },
			{ status: HttpStatus.BAD_REQUEST }
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WHSEC);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json(
			{ error: 'Webhook signature verification failed' },
			{ status: HttpStatus.BAD_REQUEST }
		);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		const metadata = session.metadata as StripeSessionMetadata;

		if (!isNil(metadata)) {
			try {
				switch (metadata.type) {
					case 'consultation-registration': {
						// The customer's email follows the language they checked out in.
						await new EmailService().consultationRegistrationMessage(toLocale(metadata.lang), {
							email: metadata.email || '',
							message: metadata.message || '<i>Brak wiadomości</i>',
							nameAndSurname: metadata.nameAndSurname || '',
							tel: metadata.tel || '',
							therapyName: metadata.therapyName || ''
						});
						break;
					}

					case 'shop': {
						const customerDetails = session.customer_details;

						await new EmailService().shopBuyMessage(toLocale(metadata.lang), {
							email: customerDetails?.email || '',
							tel: customerDetails?.phone || '',
							nameAndSurname: customerDetails?.name || '',
							price: session.amount_total != null ? (session.amount_total / 100).toFixed(2) : '',
							currency: session.currency || '',
							// Products live in our database only, so the name comes from the metadata.
							productName: metadata.productName || ''
						});
						break;
					}
				}
			} catch (error) {
				console.error('Error processing stripe webhook:', error);
			}
		}
	}

	return text('OK', { status: HttpStatus.OK });
}
