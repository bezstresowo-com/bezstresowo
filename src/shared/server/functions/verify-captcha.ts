import { env } from '$env/dynamic/private';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server side check of a Cloudflare Turnstile token.
 *
 * Fails closed: with the captcha feature enabled, a missing secret or an
 * unreachable verification endpoint must reject the request instead of quietly
 * letting bots through.
 */
export async function verifyCaptchaToken(
	token: string | undefined,
	remoteIp?: string
): Promise<boolean> {
	const secret = env.TURNSTILE_SECRET_KEY;

	if (!secret) {
		console.error('[captcha] TURNSTILE_SECRET_KEY is not set while the captcha flag is on');
		return false;
	}

	if (!token) {
		return false;
	}

	try {
		const response = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			body: new URLSearchParams({
				secret,
				response: token,
				...(remoteIp ? { remoteip: remoteIp } : {})
			})
		});

		const result = (await response.json()) as { success?: boolean };

		return result.success === true;
	} catch (cause) {
		console.error('[captcha] turnstile verification request failed', cause);
		return false;
	}
}
