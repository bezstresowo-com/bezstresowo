import assert from 'node:assert/strict';
import { collectionPaymentConfig, isCollectionSessionId } from '../src/shared/server/services/collection-mode.ts';
import { paidCollectionOrder } from '../src/shared/server/services/collection-order.ts';
const preview = { VERCEL_ENV: 'preview', COLLECTIONS_PREVIEW_ENABLED: 'true', COLLECTIONS_STRIPE_TEST_SK: 'sk_test_fixture', COLLECTIONS_WEBHOOK_SECRET: 'whsec_fixture' };
const production = { VERCEL_ENV: 'production', COLLECTIONS_LIVE_ENABLED: 'true', COLLECTIONS_STRIPE_LIVE_SK: 'sk_live_fixture', COLLECTIONS_LIVE_WEBHOOK_SECRET: 'whsec_live_fixture' };
assert.equal(collectionPaymentConfig(preview).live, false);
assert.equal(collectionPaymentConfig(production).live, true);
assert.equal(collectionPaymentConfig({ ...production, COLLECTIONS_STRIPE_LIVE_SK: undefined, COLLECTIONS_LIVE_WEBHOOK_SECRET: undefined, STRIPE_SK: 'sk_live_fixture', STRIPE_WHSEC: 'whsec_existing' }).live, true);
for (const bad of [
 { ...preview, COLLECTIONS_STRIPE_TEST_SK: 'sk_live_fixture' },
 { ...production, COLLECTIONS_STRIPE_LIVE_SK: 'sk_test_fixture' },
 { ...production, COLLECTIONS_LIVE_ENABLED: undefined },
 { ...production, COLLECTIONS_LIVE_WEBHOOK_SECRET: undefined, COLLECTIONS_WEBHOOK_SECRET: 'whsec_test_fixture' },
 { ...preview, VERCEL_ENV: 'development' },
 { ...production, COLLECTIONS_STRIPE_LIVE_SK: undefined, STRIPE_SK: 'sk_test_fixture' }
]) assert.throws(() => collectionPaymentConfig(bad));
assert.equal(isCollectionSessionId('cs_live_123', true), true);
assert.equal(isCollectionSessionId('cs_live_123', false), false);
assert.equal(isCollectionSessionId('cs_test_123', true), false);
assert.equal(isCollectionSessionId('cs_test_123', false), true);
assert.equal(isCollectionSessionId(null, true), false);
const session = { mode: 'payment', payment_status: 'paid', livemode: true, currency: 'pln', amount_total: 4900, amount_subtotal: 4900, metadata: { type: 'collection_series', version: '1', plan: 'three', collections: '[0,4,7]' } };
assert.deepEqual(paidCollectionOrder(session, true).ids, [0,4,7]);
assert.equal(paidCollectionOrder(session, false), null);
assert.equal(paidCollectionOrder({ ...session, livemode: false }, true), null);
for (const bad of [{ payment_status: 'unpaid' }, { amount_total: 1900 }, { currency: 'eur' }]) assert.equal(paidCollectionOrder({ ...session, ...bad }, true), null);
console.log('Preview/production isolation and live payment entitlement checks passed.');
