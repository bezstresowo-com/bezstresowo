import { env } from '$env/dynamic/private';
import { validWebhookSecret } from '$shared/server/services/course-purchase-event';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

// Temporary, read-only check for the single purchase authorized for integration testing.
// Never available in production; remove after the integration has been validated.
const paymentId = 'pi_3UNy8wCJSOFeoUAX0NadICY9';
const orderId = '4317903d-7c91-4b6a-9c48-8f47c17f2130';

export const POST: RequestHandler = async ({ url }) => {
	if (env.VERCEL_ENV !== 'preview' || !env.META_CAPI_TEST_EVENT_CODE)
		return json({ error: 'Not available' }, { status: 404 });
	if (!validWebhookSecret(url.searchParams.get('key'), env.SENDPULSE_PAYMENT_WEBHOOK_SECRET))
		return json({ error: 'Unauthorized' }, { status: 401 });
	try {
		if (!env.STRIPE_SK) throw new Error('Stripe not configured');
		const stripe = new Stripe(env.STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
		const payment = await stripe.paymentIntents.retrieve(paymentId, {
			expand: ['latest_charge', 'customer']
		});
		const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentId, limit: 1 });
		const session = sessions.data[0];
		const charge = typeof payment.latest_charge === 'object' ? payment.latest_charge : null;
		const customer =
			typeof payment.customer === 'object' && payment.customer && !payment.customer.deleted
				? (payment.customer as Stripe.Customer)
				: null;
		const descriptions = (env.SENDPULSE_PL_COURSE_DESCRIPTIONS || '').split('\n').filter(Boolean);
		const metadata = { ...payment.metadata, ...charge?.metadata, ...session?.metadata };
		return json({
			status: payment.status,
			live: payment.livemode,
			amountReceived: payment.amount_received,
			currency: payment.currency,
			descriptionMatched: descriptions.includes(payment.description || ''),
			metadataKeys: Object.keys(metadata),
			orderIdFields: Object.keys(metadata).filter((key) => metadata[key] === orderId),
			emailSources: {
				receipt: Boolean(payment.receipt_email),
				chargeBilling: Boolean(charge?.billing_details?.email),
				customer: Boolean(customer?.email),
				checkout: Boolean(session?.customer_details?.email)
			},
			checkoutPresent: Boolean(session),
			checkoutPaid: session?.payment_status === 'paid',
			checkoutLive: session?.livemode === true
		});
	} catch {
		return json({ error: 'Payment lookup failed' }, { status: 502 });
	}
};
