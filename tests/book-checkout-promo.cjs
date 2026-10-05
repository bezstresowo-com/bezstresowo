const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
class InvalidRequest extends Error {}
let records, available, rejection;
class FakeStripe {
	static errors = { StripeInvalidRequestError: InvalidRequest };
	promotionCodes = {
		list: async (params) => {
			records.lookups.push(params);
			return { data: available };
		}
	};
	checkout = {
		sessions: {
			create: async (params) => {
				records.checkouts.push(params);
				if (rejection) throw rejection;
				return { url: 'https://checkout.stripe.com/verified-test' };
			}
		}
	};
}
const book = {
	lang: 'pl',
	slug: 'kiedy-lek-atakuje-pl',
	name: 'Kiedy lęk atakuje',
	path: '/pl/materials/kiedy-lek-atakuje'
};
const code = ts.transpileModule(
	fs.readFileSync('src/routes/api/books/checkout/+server.ts', 'utf8'),
	{
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2022,
			esModuleInterop: true
		}
	}
).outputText;
const exportsObject = {};
vm.runInNewContext(code, {
	exports: exportsObject,
	URL,
	require: (name) => {
		if (name === '$env/static/private') return { STRIPE_SK: 'mock' };
		if (name.endsWith('/rate-limit')) return { createRateLimiter: () => ({ consume: () => true }) };
		if (name.endsWith('/book-delivery'))
			return {
				BOOK_PRICE: 4900,
				BOOK_SLUG: book.slug,
				resolveBook: () => book,
				bookSalesReady: () => true,
				readPrivateBook: async () => Buffer.from('mock')
			};
		if (name.endsWith('/prisma-service'))
			return { prisma: { bookDownload: { count: async () => 0 } } };
		if (name === '@sveltejs/kit')
			return {
				error: (status, message) => {
					throw Object.assign(new Error(message), { status });
				},
				json: (body) => body
			};
		if (name === 'stripe') return FakeStripe;
		throw Error(name);
	}
});
async function run(body, options = {}) {
	records = { lookups: [], checkouts: [] };
	available = options.available ?? [{ id: 'promo_verified' }];
	rejection = options.rejection;
	const init = {
		method: 'POST',
		headers: { origin: options.origin ?? 'https://www.bezstresowo.org' }
	};
	if (body !== undefined) {
		init.headers['content-type'] = 'application/json';
		init.body = typeof body === 'string' ? body : JSON.stringify(body);
	}
	const request = new Request(
		'https://www.bezstresowo.org/api/books/checkout?book=' + book.slug,
		init
	);
	return exportsObject.POST({
		request,
		url: new URL(request.url),
		getClientAddress: () => '127.0.0.1'
	});
}
(async () => {
	await run(undefined);
	assert.equal(records.lookups.length, 0);
	assert.equal(records.checkouts[0].allow_promotion_codes, true);
	assert.equal(records.checkouts[0].line_items[0].price_data.unit_amount, 4900);
	await run({ promoCode: ' KSIAZKA2PLQ8M5 ', unit_amount: 1 });
	assert.equal(records.lookups[0].code, 'KSIAZKA2PLQ8M5');
	assert.equal(records.checkouts[0].discounts[0].promotion_code, 'promo_verified');
	assert.equal(records.checkouts[0].allow_promotion_codes, undefined);
	assert.equal(records.checkouts[0].line_items[0].price_data.unit_amount, 4900);
	for (const body of [
		'{',
		{ promoCode: 2 },
		{ promoCode: 'bad code' },
		{ promoCode: 'X'.repeat(65) },
		'x'.repeat(1025)
	]) {
		await assert.rejects(run(body), (e) => e.status === 400);
		assert.equal(records.checkouts.length, 0);
	}
	await assert.rejects(run({ promoCode: 'UNKNOWN' }, { available: [] }), (e) => e.status === 400);
	assert.equal(records.checkouts.length, 0);
	await assert.rejects(
		run({ promoCode: 'EXPIRED' }, { rejection: new InvalidRequest('coupon exhausted') }),
		(e) => e.status === 400
	);
	assert.equal(records.checkouts.length, 1);
	await assert.rejects(
		run({ promoCode: 'VALID' }, { rejection: new Error('Stripe temporarily unavailable') }),
		/temporarily unavailable/
	);
	assert.equal(records.checkouts.length, 1);
	await assert.rejects(
		run({ promoCode: 'VALID' }, { origin: 'https://other.example' }),
		(e) => e.status === 403
	);
	assert.equal(records.checkouts.length, 0);
	console.log(
		'PASS: full price, valid discount, fixed server price, invalid/unknown/exhausted codes, no silent fallback, Stripe outage, origin protection'
	);
})().catch((e) => {
	console.error(e);
	process.exit(1);
});
