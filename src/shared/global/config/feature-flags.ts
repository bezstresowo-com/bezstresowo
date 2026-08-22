import { env } from '$env/dynamic/public';

/**
 * Cloudflare Turnstile on the contact form.
 *
 * Driven by `PUBLIC_CONTACT_FORM_CAPTCHA_ENABLED` so it can be flipped from
 * the hosting panel (plus a redeploy) without a code change. When enabled the
 * widget renders above the submit button and `sendContactRequest` starts
 * verifying tokens server side - both require `PUBLIC_TURNSTILE_SITE_KEY` /
 * `TURNSTILE_SECRET_KEY` (see `.env.example`). With the flag off nothing
 * captcha related runs or loads.
 */
export const CONTACT_FORM_CAPTCHA_ENABLED = env.PUBLIC_CONTACT_FORM_CAPTCHA_ENABLED === 'true';
