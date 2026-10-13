import {
	collectionConfig,
	collectionStripe,
	deliverCollections
} from '$shared/server/services/collection-delivery';
import { paidCollectionOrder } from '$shared/server/services/collection-order';
import { text } from '@sveltejs/kit';
export async function POST({ request, url }) {
	let config;
	try {
		config = collectionConfig();
	} catch {
		return text('Not configured', { status: 503 });
	}
	let event;
	try {
		event = collectionStripe().webhooks.constructEvent(
			await request.text(),
			request.headers.get('stripe-signature') ?? '',
			config.webhookSecret
		);
	} catch {
		return text('Invalid signature', { status: 400 });
	}
	if (event.livemode !== config.live) return text('Wrong payment mode', { status: 400 });
	if (
		event.type === 'checkout.session.completed' ||
		event.type === 'checkout.session.async_payment_succeeded'
	) {
		const session = event.data.object;
		if (
			session.metadata?.type !== 'collection_series' ||
			session.metadata.deliveryOrigin !== url.origin ||
			!paidCollectionOrder(session, config.live)
		)
			return text('OK');
		try {
			await deliverCollections(session.id, url.origin);
		} catch {
			return text('Delivery not completed', { status: 500 });
		}
	}
	return text('OK');
}
