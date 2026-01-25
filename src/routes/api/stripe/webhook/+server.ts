import { STRIPE_SK, STRIPE_WHSEC } from '$env/static/private';
import { EmailService } from '$shared/server/services/email/email-service';
import { json, text } from '@sveltejs/kit';
import Stripe from 'stripe';

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
		const metadata = session.metadata;

		if (metadata?.type === 'reservation') {
			try {
				const preferredDates = JSON.parse(metadata.preferredDates || '[]');

				await new EmailService().reservationRequest({
					email: metadata.email || '',
					message: metadata.message || '',
					nameAndSurname: metadata.nameAndSurname || '',
					tel: metadata.tel || '',
					therapyType: metadata.therapyType || '',
					preferredDates
				});
			} catch (error) {
				console.error('Error processing reservation webhook:', error);
			}
		}
	}

	return text('OK', { status: 200 });
}
