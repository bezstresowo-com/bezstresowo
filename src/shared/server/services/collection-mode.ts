export function collectionPaymentConfig(env: Record<string, string | undefined>) {
 const live = env.VERCEL_ENV === 'production';
 const enabled = live ? env.COLLECTIONS_LIVE_ENABLED === 'true' : env.VERCEL_ENV === 'preview' && env.COLLECTIONS_PREVIEW_ENABLED === 'true';
 const key = live ? env.COLLECTIONS_STRIPE_LIVE_SK || env.STRIPE_SK : env.COLLECTIONS_STRIPE_TEST_SK || env.STRIPE_SK;
 const webhookSecret = live ? env.COLLECTIONS_LIVE_WEBHOOK_SECRET : env.COLLECTIONS_WEBHOOK_SECRET;
 if (!enabled || !key?.startsWith(live ? 'sk_live_' : 'sk_test_') || /placeholder|dummy|example/i.test(key) || !webhookSecret?.startsWith('whsec_')) throw new Error('Collection payments are not configured');
 return { live, key, webhookSecret };
}

export function isCollectionSessionId(sessionId: unknown, live: boolean) {
 return typeof sessionId === 'string' && (live ? /^cs_live_[A-Za-z0-9]+$/ : /^cs_test_[A-Za-z0-9]+$/).test(sessionId);
}
