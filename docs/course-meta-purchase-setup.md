# Polish course Purchase integration (disabled by default)

The native SendPulse pricing form sends its configured event before payment. Change that event to InitiateCheckout; do not use it as Purchase.

The new `/api/sendpulse/course-purchase` endpoint accepts SendPulse payment_order webhooks. Only successful live EDU payments (status 200, service 200, type 1) with the exact configured Polish course description are eligible. The handler independently verifies Stripe: a unique PaymentIntent must carry the same SendPulse order_id, be successful and live, match PLN and the paid amount, and have no refund or dispute. Stripe Connect is not identified by the legacy SendPulse Stripe enum. Buyer email comes from the verified Stripe charge, receipt or customer, then is normalized and SHA-256 hashed. Amount comes from Stripe amount_received, including discounts. Stable payment IDs provide Meta deduplication; existing database records suppress redelivery after success. No credentials or payloads are logged.

Required private deployment settings:

- COURSE_META_PURCHASE_ENABLED=false until validated
- SENDPULSE_PAYMENT_WEBHOOK_SECRET: random secret of at least 32 characters
- SENDPULSE_PL_COURSE_DESCRIPTIONS: exact description from an actual course payment, newline-separated
- STRIPE_SK: existing server-side Stripe key with PaymentIntent search/read permissions
- META_PIXEL_ID=2269646353881533
- META_CAPI_ACCESS_TOKEN: restricted Conversions API token, server only
- META_GRAPH_API_VERSION: version supported by the connected Meta account
- META_CAPI_TEST_EVENT_CODE: use only during Meta Test Events validation; remove before live operation

After user approval for credentials and sharing hashed buyer email plus payment details with Meta, store secrets in deployment settings. Register the HTTPS endpoint with `?key=<secret>` in SendPulse Account Settings > API > Successful payment webhooks. Treat the full webhook URL as a credential and never publish it in source, screenshots or messages.

Validate the exact real payload format without another charged purchase. The public docs call the timestamp milliseconds while their example uses seconds; this implementation uses the payment updatedAt ISO date instead. Confirm receipt and retry behavior, course description, currency capitalization and available buyer information from the actual SendPulse delivery. The event currently uses system_generated because the payment webhook contains neither browser user-agent nor consent/click identifiers. Verify this action source is appropriate in Meta before activating; do not invent browser data. Browser consent and attribution linkage remain to be integrated before production use.

Run `node scripts/test-course-purchase.mjs`. Check Meta Test Events, unpaid exclusions and duplicate delivery, then remove the test code and enable. Keep ads off until confirmed Purchase receipt and production approval.

Verified test evidence on 2026-10-07: SendPulse CSV records a COMPLETE/LIVE EDU order paid at 16:58:03 UTC for 2 PLN; Stripe API confirms a live succeeded PaymentIntent with 200 minor units, an exact order_id match, and buyer email in charge/customer/checkout. No additional charge is needed. The original native webhook was acknowledged without a Meta outgoing request. Replay must use this existing paid order, not a fabricated new purchase.

Stripe search can lag indexing. Return 503 rather than acknowledging an unverified eligible order; confirm SendPulse retries or provide a durable replay mechanism before production. Current implementation has no durable retry queue. Browser consent/attribution and production approval remain unresolved.

Temporary /api/sendpulse/course-purchase/check-payment is read-only, accepts the existing secret, is restricted to Preview with a Meta test code and one authorized test purchase, and returns no buyer email or credentials. Remove it after testing and before production merge.
