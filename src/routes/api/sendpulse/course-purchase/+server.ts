import { env } from '$env/dynamic/private';
import {
	coursePurchaseEvent,
	validWebhookSecret
} from '$shared/server/services/course-purchase-event';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { json } from '@sveltejs/kit';
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
	const event = coursePurchaseEvent(payload, descriptions);
	if (!event) {
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
	if (!env.META_CAPI_ACCESS_TOKEN || !env.META_GRAPH_API_VERSION || !env.META_PIXEL_ID)
		return json({ error: 'Integration not configured' }, { status: 503 });
	const marker = `meta:${event.event_id}`;
	try {
		if (await prisma.processedStripeEvent.findUnique({ where: { eventId: marker } }))
			return json({ received: true, duplicate: true });
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
		if (!response.ok || result.events_received !== 1) throw new Error('Meta rejected event');
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
