import { STRIPE_SK } from '$env/static/private';
import Stripe from 'stripe';
import type { PageServerLoad } from './$types';

const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');

	// A direct visit to this page must never count as a completed booking.
	if (!sessionId || !/^cs_(test_|live_)[A-Za-z0-9]+$/.test(sessionId)) {
		return { paidConsultation: false, sessionId: null };
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		return {
			paidConsultation:
				session.payment_status === 'paid' &&
				session.status === 'complete' &&
				session.metadata?.type === 'consultation-registration',
			sessionId
		};
	} catch (error) {
		// Tracking must never interrupt the existing confirmation or payment flow.
		console.error('Could not verify consultation checkout for tracking:', error);
		return { paidConsultation: false, sessionId: null };
	}
};
