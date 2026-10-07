import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/shared/server/services/course-purchase-event.ts', 'utf8');
const js = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 }
}).outputText;
const { coursePurchaseEvent, validWebhookSecret } = await import(
	`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
);
const now = Date.now();
const fixture = {
	event: 'payment_order',
	order: {
		status: 200,
		service: 200,
		paymentMethodType: 6,
		type: 1,
		description: 'PL course fixture',
		id: 'a3704313-8c0b-0000-b195-c6b84242f0e2',
		currency: 'PLN',
		totalCost: 2,
		updatedAt: new Date(now).toISOString(),
		variables: [{ valueType: 6, value: ' TEST@example.com ' }]
	}
};
const payment = {
	status: 'succeeded',
	livemode: true,
	currency: 'pln',
	amountReceived: 200,
	orderId: fixture.order.id,
	email: ' TEST@example.com ',
	refunded: false,
	disputed: false
};
const event = coursePurchaseEvent(fixture, ['PL course fixture'], payment, now);
assert.equal(event.custom_data.value, 2);
assert.equal(event.user_data.em[0].length, 64);
assert.ok(!JSON.stringify(event).includes('example.com'));
assert.equal(
	coursePurchaseEvent(fixture, ['PL course fixture'], payment, now).event_id,
	event.event_id
);
for (const status of [100, 101, 102, 103, 104, 300, 301, 302, 303, 304, 305, 400, 500]) {
	assert.equal(
		coursePurchaseEvent(
			{ ...fixture, order: { ...fixture.order, status } },
			['PL course fixture'],
			payment,
			now
		),
		null
	);
}
for (const change of [
	{ type: 2 },
	{ type: 3 },
	{ description: 'UA course' },
	{ currency: 'EUR' },
	{ totalCost: 0 },
	{ totalCost: -1 },
	{ totalCost: NaN },
	{ updatedAt: 'invalid' },
	{ service: 100 }
]) {
	assert.equal(
		coursePurchaseEvent(
			{ ...fixture, order: { ...fixture.order, ...change } },
			['PL course fixture'],
			payment,
			now
		),
		null
	);
}
assert.equal(validWebhookSecret('a'.repeat(32), 'a'.repeat(32)), true);
assert.equal(validWebhookSecret('b'.repeat(32), 'a'.repeat(32)), false);
assert.equal(validWebhookSecret(null, 'a'.repeat(32)), false);
console.log(
	'Course Purchase checks passed: paid-only, exact product, discounted amount, hashed email, stable event ID, authentication.'
);

// The native course webhook may omit email or use Stripe Connect's separate enum.
assert.ok(
	coursePurchaseEvent(
		{ ...fixture, order: { ...fixture.order, variables: [], paymentMethodType: 16 } },
		['PL course fixture'],
		payment,
		now
	)
);
for (const change of [
	{ status: 'processing' },
	{ livemode: false },
	{ currency: 'eur' },
	{ amountReceived: 100 },
	{ orderId: 'different-order' },
	{ email: '' },
	{ refunded: true },
	{ disputed: true }
]) {
	assert.equal(
		coursePurchaseEvent(fixture, ['PL course fixture'], { ...payment, ...change }, now),
		null
	);
}
assert.equal(coursePurchaseEvent(fixture, ['PL course fixture'], null, now), null);
console.log(
	'Stripe verification checks passed: real paid amount and order ID required; test, refund, dispute and missing email rejected.'
);
