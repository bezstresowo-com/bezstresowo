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
			console.log('Payment intent succeeded:', event.data.object);
			break;
		}

		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session;
			console.log('Checkout session completed:', session);

		 // Tu najprawdopodobniej poleci mail z potwierdzeniem zamowienia
		 // spoko miejsce rowniez na aktualizacje danych w bazie itp

			break;
		}

		case 'checkout.session.async_payment_failed': {
			const session = event.data.object as Stripe.Checkout.Session;
			console.log('Checkout session payment failed:', session);

			// Obsługa nieudanej płatności

			break;
		}

		default: {
			// TODO: delete after testing
			console.log({ msg: 'Unhandled stripe event', eventType: event.type, event });
		}
	}

	return json({ received: true });
}

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

	const prices: Stripe.Response<Stripe.ApiList<Stripe.Price>> = await stripe.prices.list({
		active: true,
		expand: ['data.product']
	});

	console.log(prices)

	return json({ data: processedProducts });
}
