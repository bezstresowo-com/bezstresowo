import { env } from '$env/dynamic/private';

export function isCoursePurchaseEventConfigured(): boolean {
	try {
		const url = new URL(env.SENDPULSE_COURSE_UA_EVENT_URL);
		return url.protocol === 'https:' && url.hostname === 'events.sendpulse.com';
	} catch {
		return false;
	}
}

/** Called only by the verified, paid Stripe webhook. The URL is a private event token. */
export async function sendUkrainianCoursePurchaseEvent(email: string, sessionId: string) {
	const configuredUrl = env.SENDPULSE_COURSE_UA_EVENT_URL;
	if (!isCoursePurchaseEventConfigured()) {
		throw new Error('Invalid SendPulse course purchase event URL');
	}
	const url = new URL(configuredUrl);

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, order_id: sessionId }),
		signal: AbortSignal.timeout(10000)
	});

	if (!response.ok) throw new Error(`SendPulse course event failed: ${response.status}`);
}
