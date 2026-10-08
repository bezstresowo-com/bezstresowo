import { env } from '$env/dynamic/private';
import {
	coursePurchaseEvent,
	coursePurchaseOrder,
	validWebhookSecret
} from '$shared/server/services/course-purchase-event';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	// Disabled until credentials, the exact course description and data-sharing approval are configured.
	if (env.COURSE_META_PURCHASE_ENABLED !== 'true')
		return json({ error: 'Disabled' }, { status: 503 });
	if (!validWebhookSecret(url.searchParams.get('key'), env.SENDPULSE_PAYMENT_WEBHOOK_SECRET))
		return json({ error: 'Unauthorized' }, { status: 401 });
	if (Number(request.headers.get('content-length') || 0) > 32768)
		return json({ error: 'Payload too large' }, { status: 413 });
	const raw = await request.text();
	if (Buffer.byteLength(raw) > 32768) return json({ error: 'Payload too large' }, { status: 413 });
	let payload: unknown;
	try {
		payload = JSON.parse(raw);
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const descriptions = (env.SENDPULSE_PL_COURSE_DESCRIPTIONS || '').split('\n').filter(Boolean);
	const order = coursePurchaseOrder(payload, descriptions);
	if (!order) {
		// Test diagnostics contain only enum values and field presence, never buyer data.
		if (env.META_CAPI_TEST_EVENT_CODE) {
			const p = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
			const o = p.order && typeof p.order === 'object' ? (p.order as Record<string, unknown>) : {};
			const numeric = (value: unknown) =>
				typeof value === 'number' && Number.isFinite(value) ? value : null;
			console.info('Course Purchase skipped', {
				paymentOrder: p.event === 'payment_order',
				status: numeric(o.status),
				service: numeric(o.service),
				paymentMethodType: numeric(o.paymentMethodType),
				type: numeric(o.type),
				descriptionMatched: descriptions.includes(String(o.description)),
				pln: o.currency === 'PLN',
				positiveAmount: typeof o.totalCost === 'number' && o.totalCost > 0,
				variablesPresent: Array.isArray(o.variables),
				emailVariablePresent:
					Array.isArray(o.variables) &&
					o.variables.some(
						(v) => v && typeof v === 'object' && v.valueType === 6 && typeof v.value === 'string'
					),
				contactVariablesPresent: Array.isArray(o.contactVariables)
			});
		}
		return json({ received: true, skipped: true });
	}
	// Never transmit buyer details until consent/attribution and Meta category review are confirmed.
	// Preview must remain non-transmitting by default, even when the basic enabled flag is set.
	if (env.COURSE_META_PRIVACY_REVIEW_APPROVED !== 'true')
		return json({ received: true, skipped: true, reason: 'Privacy review pending' });
	if (
		!env.META_CAPI_ACCESS_TOKEN ||
		!env.META_GRAPH_API_VERSION ||
		!env.META_PIXEL_ID ||
		!env.STRIPE_SK
	)
		return json({ error: 'Integration not configured' }, { status: 503 });
	const marker = `meta:sendpulse:${order.id}`;
	try {
		if (await prisma.processedStripeEvent.findUnique({ where: { eventId: marker } }))
			return json({ received: true, duplicate: true });
		const stripe = new Stripe(env.STRIPE_SK, {
			apiVersion: '2025-11-17.clover' as never,
			timeout: 10000,
			maxNetworkRetries: 1
		});
		const matches = await stripe.paymentIntents.search({
			query: `metadata['order_id']:'${order.id}'`,
			limit: 2,
			expand: ['data.latest_charge', 'data.customer']
		});
		// Search indexing can lag; a non-2xx response allows the sender to retry.
		if (matches.data.length !== 1 || matches.has_more)
			return json({ error: 'Payment verification pending' }, { status: 503 });
		const payment = matches.data[0];
		const charge = typeof payment.latest_charge === 'object' ? payment.latest_charge : null;
		const customer =
			typeof payment.customer === 'object' && payment.customer && !payment.customer.deleted
				? (payment.customer as Stripe.Customer)
				: null;
		if (!charge) return json({ error: 'Payment verification pending' }, { status: 503 });
		const event = coursePurchaseEvent(payload, descriptions, {
			status: payment.status,
			livemode: payment.livemode,
			currency: payment.currency,
			amountReceived: payment.amount_received,
			orderId: payment.metadata.order_id,
			email: charge.billing_details.email || payment.receipt_email || customer?.email,
			refunded: charge.refunded || charge.amount_refunded > 0,
			disputed: charge.disputed
		});
		if (!event) return json({ error: 'Paid order could not be verified' }, { status: 422 });
		const response = await fetch(
			`https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${env.META_PIXEL_ID}/events`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					data: [event],
					access_token: env.META_CAPI_ACCESS_TOKEN,
					...(env.META_CAPI_TEST_EVENT_CODE
						? { test_event_code: env.META_CAPI_TEST_EVENT_CODE }
						: {})
				}),
				signal: AbortSignal.timeout(10000)
			}
		);
		const result = await response.json();
		if (!response.ok || result.events_received !== 1) {
			console.error('Course Purchase rejected by Meta', {
				status: response.status,
				code: result.error?.code,
				subcode: result.error?.error_subcode
			});
			return json(
				{ error: 'Meta rejected event', providerCode: result.error?.code },
				{ status: 502 }
			);
		}
		// Repeated deliveries use the same event_id, including concurrent requests and retries.
		await prisma.processedStripeEvent.upsert({
			where: { eventId: marker },
			create: { eventId: marker },
			update: {}
		});
		return json({ received: true });
	} catch {
		console.error('Course Purchase delivery failed');
		return json({ error: 'Delivery failed' }, { status: 502 });
	}
};
