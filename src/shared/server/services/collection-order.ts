export const COLLECTION_NAMES = [
	'Зручна мішень',
	'Ніжний контроль',
	'Вкрадена впевненість',
	'Чиясь образа. Моє вибачення',
	'Ціна мого «ні»',
	'Щедра пастка',
	'Умовна любов',
	'Голос звички'
] as const;

export const COLLECTION_NAMES_PL = [
	'Wygodny cel',
	'Czuła kontrola',
	'Odebrana pewność siebie',
	'Czyjaś uraza. Moje przeprosiny',
	'Cena mojego „nie”',
	'Hojna pułapka',
	'Warunkowa miłość',
	'Głos nawyku'
] as const;
export type CollectionLanguage = 'uk' | 'pl';
export function collectionLanguage(value: unknown): CollectionLanguage {
	if (value === undefined || value === 'uk') return 'uk';
	if (value === 'pl') return 'pl';
	throw new Error('Invalid collection language');
}
export function collectionNames(lang: CollectionLanguage) {
	return lang === 'pl' ? COLLECTION_NAMES_PL : COLLECTION_NAMES;
}
export const PLAN_PRICES = { one: 1900, three: 4900, all: 9900 } as const;
export type CollectionPlan = keyof typeof PLAN_PRICES;
export function collectionOrder(plan: unknown, ids: unknown) {
	if (typeof plan !== 'string' || !Object.hasOwn(PLAN_PRICES, plan) || !Array.isArray(ids))
		throw new Error('Invalid order');
	const selected: number[] = ids;
	if (
		selected.some((id) => !Number.isInteger(id) || id < 0 || id >= 8) ||
		new Set(selected).size !== selected.length
	)
		throw new Error('Invalid selection');
	const expected = plan === 'one' ? 1 : plan === 'three' ? 3 : 8;
	if (selected.length !== expected) throw new Error('Invalid selection size');
	return {
		plan: plan as CollectionPlan,
		ids: [...selected].sort((a, b) => a - b),
		price: PLAN_PRICES[plan as CollectionPlan]
	};
}
export function paidCollectionOrder(
	session: {
		mode?: string | null;
		payment_status?: string;
		status?: string | null;
		total_details?: {
			amount_discount?: number;
			amount_tax?: number;
			amount_shipping?: number | null;
		} | null;
		livemode?: boolean;
		currency?: string | null;
		amount_subtotal?: number | null;
		amount_total?: number | null;
		metadata?: Record<string, string> | null;
	},
	expectedLive = false
) {
	try {
		if (
			session.mode !== 'payment' ||
			session.livemode !== expectedLive ||
			session.currency !== 'pln' ||
			session.metadata?.type !== 'collection_series' ||
			session.metadata.version !== '1'
		)
			return null;
		collectionLanguage(session.metadata.lang);
		const order = collectionOrder(session.metadata.plan, JSON.parse(session.metadata.collections));
		if (
			session.amount_subtotal !== order.price ||
			(session.total_details?.amount_tax ?? 0) !== 0 ||
			(session.total_details?.amount_shipping ?? 0) !== 0
		)
			return null;
		const discount = session.total_details?.amount_discount ?? 0;
		if (session.payment_status === 'paid' && session.amount_total === order.price && discount === 0)
			return order;
		// A completed Stripe test checkout with a genuine full discount needs no payment.
		// Live purchases still require the full paid price.
		if (
			!expectedLive &&
			session.status === 'complete' &&
			(session.payment_status === 'paid' || session.payment_status === 'no_payment_required') &&
			session.amount_total === 0 &&
			discount === order.price
		)
			return order;
		return null;
	} catch {
		return null;
	}
}
