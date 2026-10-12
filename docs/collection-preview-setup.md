# Collection series — preview configuration

Branch: preview/collections-series-2026-10-12. No production rollout authorized.

The implementation reuses existing Stripe SDK, private S3 book reader, Mongo download counters and SMTP credentials. It does not provision another vendor or expose PDFs as static assets.

Set only for this preview branch:
- COLLECTIONS_STRIPE_TEST_SK: real Stripe test secret key (never live).
- COLLECTIONS_PREVIEW_ENABLED=true after storage, email and webhook are verified.
- COLLECTIONS_WEBHOOK_SECRET: signing secret for /api/collections/webhook on the exact preview origin.
- COLLECTION_01_OBJECT_KEY ... COLLECTION_08_OBJECT_KEY: eight private S3 PDF object keys in series order.
- Existing AWS_BOOKS_BUCKET_NAME, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_REGION, BOOK_DOWNLOAD_SECRET, DATABASE_URL, EMAIL_SENDER, EMAIL_APP_PASSWORD must be configured for preview.

Upload the final PDFs from the latest archive. In particular use the heart-on-threads cover for 07 and the record cover plus updated stories 03/08 and pause quote for 08.

Stripe webhook events: checkout.session.completed and checkout.session.async_payment_succeeded. Only test events for collection_series version 1 with matching deliveryOrigin are accepted. Send a signed webhook to this endpoint; a redirect alone is not proof of payment.

Prices are derived on the server: one=1900, three=4900, all=9900 PLN minor units. Duplicate and unknown selections fail. No client-supplied price is used. Downloads require a signed token, a paid test session of the correct amount/currency, and membership in its selected IDs. Each PDF has an atomic counter of three downloads.

Email delivery uses per-session completion and processing markers; concurrent delivery returns retryable failure. Stale processing claims expire after five minutes. As SMTP is not transactional with Mongo, a crash after email acceptance but before the completion marker can cause a retry email. Download entitlement is unchanged by webhook retries.

Validation completed locally: eight single selections, all 56 distinct triple selections, full set, invalid selections and forged/unpaid/live/wrong-currency sessions; Svelte check and build. Real Stripe, SMTP, S3 and protected-preview end-to-end checks remain blocked by missing authorized credentials.

Before enabling: test one/triple/all payments, cancellation, unpaid webhook, invalid signature, duplicate webhook, non-purchased PDF denial, three-download limit and customer email. Do not promote to production without user's separate approval.
