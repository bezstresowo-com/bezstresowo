import { createHash, timingSafeEqual } from 'node:crypto';

export function validWebhookSecret(actual: string | null, expected: string | undefined) {
	if (!actual || !expected || expected.length < 32) return false;
	const a = Buffer.from(actual),
		b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function coursePurchaseOrder(payload: unknown, descriptions: string[], now = Date.now()) {
	if (!payload || typeof payload !== 'object') return null;
	const p = payload as Record<string, unknown>;
	const o = p.order as Record<string, unknown> | undefined;
	if (
		p.event !== 'payment_order' ||
		!o ||
		o.status !== 200 ||
		o.service !== 200 ||
		o.type !== 1 ||
		typeof o.description !== 'string' ||
		!descriptions.includes(o.description) ||
		typeof o.id !== 'string' ||
		!/^[a-zA-Z0-9-]{16,64}$/.test(o.id) ||
		o.currency !== 'PLN' ||
		typeof o.totalCost !== 'number' ||
		!Number.isFinite(o.totalCost) ||
		o.totalCost <= 0
	)
		return null;
	const time = typeof o.updatedAt === 'string' ? Date.parse(o.updatedAt) : NaN;
	if (!Number.isFinite(time) || time > now + 60_000 || time < now - 7 * 86400_000) return null;
	return { id: o.id, description: o.description, totalCost: o.totalCost, time };
}

export interface VerifiedCoursePayment {
	status: string;
	livemode: boolean;
	currency: string;
	amountReceived: number;
	orderId: string | undefined;
	email: string | null | undefined;
	refunded: boolean;
	disputed: boolean;
}

export function coursePurchaseEvent(
	payload: unknown,
	descriptions: string[],
	payment: VerifiedCoursePayment,
	now = Date.now()
) {
	const order = coursePurchaseOrder(payload, descriptions, now);
	if (
		!order ||
		!payment ||
		payment.status !== 'succeeded' ||
		!payment.livemode ||
		payment.currency !== 'pln' ||
		payment.orderId !== order.id ||
		!Number.isSafeInteger(payment.amountReceived) ||
		payment.amountReceived <= 0 ||
		payment.amountReceived !== Math.round(order.totalCost * 100) ||
		payment.refunded ||
		payment.disputed
	)
		return null;
	const email = typeof payment.email === 'string' ? payment.email.trim().toLowerCase() : '';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
	return {
		event_name: 'Purchase',
		event_time: Math.floor(order.time / 1000),
		event_id: createHash('sha256').update(`sendpulse:${order.id}`).digest('hex'),
		action_source: 'system_generated',
		user_data: { em: [createHash('sha256').update(email).digest('hex')] },
		custom_data: {
			currency: 'PLN',
			value: payment.amountReceived / 100
		}
	};
}
