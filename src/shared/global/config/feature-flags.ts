/**
 * Cloudflare Turnstile on the contact form.
 *
 * Flip to `true` to enable. The widget then renders above the submit button and
 * `sendContactRequest` starts verifying tokens server side - both require
 * `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` (see `.env.example`).
 * With the flag off nothing captcha related runs or loads.
 */
export const CONTACT_FORM_CAPTCHA_ENABLED = false;
