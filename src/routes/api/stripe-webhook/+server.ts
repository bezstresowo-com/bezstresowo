import { STRIPE_SK, STRIPE_WHSEC } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function POST({ request }) {
	const sig = request.headers.get('stripe-signature');
	const webhookSecret = STRIPE_WHSEC;

	let event: Stripe.Event;
	const stripe = new Stripe(STRIPE_SK, {
		apiVersion: '2025-11-17.clover' as any
	});

	// TODO: delete after testing
	const myProducts = await stripe.products.list({
		active: true
	});
	console.log(JSON.stringify({ myProducts }, null, 2));

	try {
		const body = await request.text();

		if (!sig || !webhookSecret) {
			return json({ error: 'Webhook signature or secret missing' }, { status: 400 });
		}

		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (e) {
		const err = e as Error;

		// TODO: delete after testing
		console.log(err.message);

		return json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	switch (event.type) {
		case 'payment_intent.succeeded': {
			// TODO: delete after testing
			console.log({ event });
			break;
		}

		default: {
			// TODO: delete after testing
			console.log({ msg: 'Unhandled stripe event', event });
		}
	}

	return json({ received: true });
}
