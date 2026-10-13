import assert from 'node:assert/strict';
import { collectionEmail } from '../src/shared/server/services/collection-email-template.ts';
import {
	collectionLanguage,
	collectionNames,
	paidCollectionOrder
} from '../src/shared/server/services/collection-order.ts';
assert.equal(collectionLanguage(undefined), 'uk');
for (const lang of ['pl', 'uk']) assert.equal(collectionLanguage(lang), lang);
for (const bad of ['en', 'PL', '', null, {}, 1]) assert.throws(() => collectionLanguage(bad));
const paid = {
	mode: 'payment',
	payment_status: 'paid',
	livemode: false,
	currency: 'pln',
	amount_subtotal: 1900,
	amount_total: 1900,
	metadata: { type: 'collection_series', version: '1', lang: 'pl', plan: 'one', collections: '[7]' }
};
assert.deepEqual(paidCollectionOrder(paid).ids, [7]);
assert.equal(collectionNames('pl')[7], 'Głos nawyku');
assert.equal(paidCollectionOrder({ ...paid, metadata: { ...paid.metadata, lang: 'en' } }), null);
const pl = collectionEmail(
	'https://example.com/pl/collections-download?token=abc',
	collectionNames('pl'),
	'pl'
);
assert.match(pl.subject, /Cudze oczekiwania/);
assert.match(pl.html, /lang="pl"/);
assert.doesNotMatch(pl.text, /[\u0400-\u04ff]/);
assert.match(pl.text, /do trzech razy/);
const uk = collectionEmail(
	'https://example.com/uk/collections-download?token=abc',
	collectionNames('uk'),
	'uk'
);
assert.match(uk.subject, /Чужі бажання/);
assert.match(uk.html, /lang="uk"/);
assert.doesNotMatch(
	collectionEmail('https://example.com/path?a=b&c=d', ['<script>alert("x")</script>'], 'pl').html,
	/<script>/
);
assert.throws(() => collectionEmail('javascript:alert(1)', [], 'pl'));
console.log('Language validation, paid order language and PL/UA delivery email checks passed.');
