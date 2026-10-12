# Collection live launch — staged, not published

Prepared on 2026-10-12. User has approved the collection preview but has not authorized publication on master in this conversation.

Preview keeps its branch-specific test Stripe key and /api/collections/webhook. Production uses STRIPE_SK and the existing STRIPE_WHSEC with the live /api/stripe/webhook destination. The shared handler routes only paid collection_series sessions with the exact delivery origin to the collection delivery service. Books and consultations keep their existing handling.

Production configuration: COLLECTIONS_LIVE_ENABLED is staged as false; COLLECTION_01_OBJECT_KEY through COLLECTION_08_OBJECT_KEY point to collections/ua/2026-10-12/01.pdf through 08.pdf in the existing private bucket. Enable live collection payments only as part of a separately approved publication. COLLECTIONS_STRIPE_LIVE_SK and COLLECTIONS_LIVE_WEBHOOK_SECRET are optional overrides, not required for the existing production integration.

Validation: all 64 single/triple choices, full series and invalid-order/payment checks; live/test mode isolation, unpaid and wrong-total/currency rejection; Svelte check with zero errors (nine existing admin warnings); local build passed using dummy build-only environment values. No live purchase has been processed. After approved publication, verify actual live Checkout amount and selections, existing webhook delivery and PDF entitlement flow before declaring live end-to-end verification complete.
