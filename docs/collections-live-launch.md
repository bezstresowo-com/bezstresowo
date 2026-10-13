# Collection live launch

Prepared on 2026-10-12. Publication authorized by the owner on 2026-10-13 after a successful zero-cost test checkout, email delivery and PDF download verification in her browser.

Preview keeps its branch-specific test Stripe key and /api/collections/webhook. Production uses STRIPE_SK and the existing STRIPE_WHSEC with the live /api/stripe/webhook destination. The shared handler routes only paid collection_series sessions with the exact delivery origin to the collection delivery service. Books and consultations keep their existing handling.

Production configuration: COLLECTIONS_LIVE_ENABLED is true; COLLECTION_01_OBJECT_KEY through COLLECTION_08_OBJECT_KEY point to collections/ua/2026-10-12/01.pdf through 08.pdf in the existing private bucket. Polish COLLECTION_PL_01_OBJECT_KEY through COLLECTION_PL_08_OBJECT_KEY point to the reviewed Polish PDFs in the same private bucket. COLLECTIONS_STRIPE_LIVE_SK and COLLECTIONS_LIVE_WEBHOOK_SECRET are optional overrides, not required for the existing production integration.

Validation: all 64 single/triple choices, full series and invalid-order/payment checks; live/test mode isolation, unpaid and wrong-total/currency rejection; Svelte check with zero errors (nine existing admin warnings); local build passed using dummy build-only environment values. No live purchase has been processed. After publication, verify live Checkout amounts and selections. A real charged purchase and its production email/PDF delivery remain untested until an actual purchase is completed. The existing live webhook at https://www.bezstresowo.org/api/stripe/webhook is active and subscribes to checkout.session.completed and checkout.session.async_payment_succeeded.
