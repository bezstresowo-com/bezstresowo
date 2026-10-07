# Polish course Purchase integration (disabled by default)

The native SendPulse pricing form sends its configured event before payment. Change that event to InitiateCheckout; do not use it as Purchase.

The new `/api/sendpulse/course-purchase` endpoint accepts SendPulse payment_order webhooks. Only successful live Stripe EDU payments (status 200, service 200, paymentMethodType 6, type 1) with the exact configured Polish course description are forwarded. Amount reflects the actual payment, including discounts. Email is normalized and SHA-256 hashed. Stable payment IDs provide Meta deduplication; existing database records suppress redelivery after success. No credentials or payloads are logged.

Required private deployment settings:

- COURSE_META_PURCHASE_ENABLED=false until validated
- SENDPULSE_PAYMENT_WEBHOOK_SECRET: random secret of at least 32 characters
- SENDPULSE_PL_COURSE_DESCRIPTIONS: exact description from an actual course payment, newline-separated
- META_PIXEL_ID=2269646353881533
- META_CAPI_ACCESS_TOKEN: restricted Conversions API token, server only
- META_GRAPH_API_VERSION: version supported by the connected Meta account
- META_CAPI_TEST_EVENT_CODE: use only during Meta Test Events validation; remove before live operation

After user approval for credentials and sharing hashed buyer email plus payment details with Meta, store secrets in deployment settings. Register the HTTPS endpoint with `?key=<secret>` in SendPulse Account Settings > API > Successful payment webhooks. Treat the full webhook URL as a credential and never publish it in source, screenshots or messages.

Validate the exact real payload format without another charged purchase. The public docs call the timestamp milliseconds while their example uses seconds; this implementation uses the payment updatedAt ISO date instead. Confirm receipt and retry behavior, course description, currency capitalization and available buyer information from the actual SendPulse delivery. The event currently uses system_generated because the payment webhook contains neither browser user-agent nor consent/click identifiers. Verify this action source is appropriate in Meta before activating; do not invent browser data. Browser consent and attribution linkage remain to be integrated before production use.

Run `node scripts/test-course-purchase.mjs`. Check Meta Test Events, unpaid exclusions and duplicate delivery, then remove the test code and enable. Keep ads off until confirmed Purchase receipt and production approval.
