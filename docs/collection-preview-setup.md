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

Validation completed locally: eight single selections, all 56 distinct triple selections, full set, invalid selections and forged/unpaid/live/wrong-currency sessions; Svelte check and build. Connected on 2026-10-12: existing test Stripe key and new dedicated test webhook stored as branch-only secrets; preview-enabled flag and eight S3 object keys set on the same branch. Eight final PDFs uploaded under collections/ua/2026-10-12/01.pdf ... 08.pdf to the existing private bucket, with all four public-access blocks enabled, server-side AES256 encryption, and readback SHA-256 verification.

End-to-end single purchase: 19 PLN test payment succeeded, portal exposed only selected collection 01, automatic checkout.session.completed webhook returned HTTP 200, and the downloaded PDF matched the final source byte-for-byte. SMTP acceptance is confirmed by successful completion of the delivery handler; inbox placement is not independently confirmed. Triple/all test purchases also succeeded at 49 PLN and 99 PLN. Their portals listed exactly 3 selected PDFs and all 8 PDFs respectively; the webhook dashboard confirmed HTTP 200 for all three purchases plus the repeated single-purchase event. Downloaded samples from triple and all orders matched final PDFs 02, 08 and 07 byte-for-byte. A non-purchased PDF and a tampered token returned 403, the third allowed download returned the correct PDF and the fourth returned 403, and an unsigned webhook returned 400. Cancellation returned to the collection page. An unpaid Checkout session is denied download access. No real transactions were processed. Adaptive Pricing is disabled per collection session to keep checkout in PLN. Production and existing payment destinations are unchanged.

Preview setup and end-to-end verification are complete. Do not promote to production or replace test credentials with live credentials without the user's separate approval. Production launch still requires a reviewed live-mode implementation, dedicated live webhook and relevant environment settings; the present code deliberately refuses live payments.
