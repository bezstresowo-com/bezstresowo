import { STRIPE_SK, STRIPE_WHSEC } from '$env/static/private';
import { EmailService } from '$shared/server/services/email/email-service';
import type { ReservationRequestArgs } from '$shared/server/services/email/model.js';
import { json, text } from '@sveltejs/kit';
import { isNil } from 'lodash-es';
import Stripe from 'stripe';
import type { StripeSessionMetadata } from './model';

export async function POST({ request }) {
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature || !STRIPE_WHSEC) {
		return json({ error: 'Missing signature or webhook secret' }, { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WHSEC);
	} catch (err: any) {
		console.error('Webhook signature verification failed:', err.message);
		return json({ error: 'Webhook signature verification failed' }, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		const metadata = session.metadata as StripeSessionMetadata;

		if (!isNil(metadata)) {
			try {
				switch (metadata.type) {
					case 'reservation': {
						const parsedMetadata = {
							...metadata,
							preferredDates: JSON.parse(metadata.preferredDates || '[]')
						} as ReservationRequestArgs;

						await new EmailService().reservationRequest({
							email: parsedMetadata.email || '',
							message: parsedMetadata.message || '',
							nameAndSurname: parsedMetadata.nameAndSurname || '',
							tel: parsedMetadata.tel || '',
							therapyName: parsedMetadata.therapyName || '',
							preferredDates: parsedMetadata.preferredDates
						});
						break;
					}
				}
			} catch (error) {
				console.error('Error processing reservation webhook:', error);
			}
		}
	}

	return text('OK', { status: 200 });
}
