import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Run the actual security helpers with mocked environment and S3 transport.
// No credentials, mail, database, Stripe or network calls are used.
const source = await readFile('src/shared/server/services/book-delivery.ts', 'utf8');
let js = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 }
}).outputText;
js = js.replace(
	/import \{ env \} from ['"]\$env\/dynamic\/private['"];?/,
	'const env = { BOOK_DOWNLOAD_SECRET: "test-secret-that-is-at-least-32-characters" };'
);
js = js.replace(
	/import \{[\s\S]*?\} from ['"]\$env\/static\/private['"];?/,
	'const AWS_S3_REGION="test", AWS_S3_ACCESS_KEY_ID="test", AWS_S3_SECRET_ACCESS_KEY="test";'
);
js = js.replace(
	/import \{[\s\S]*?\} from ['"]@aws-sdk\/client-s3['"];?/,
	`
 const fixture = { publicAccess: { BlockPublicAcls:true, IgnorePublicAcls:true, BlockPublicPolicy:true, RestrictPublicBuckets:true }, bytes:Buffer.from('%PDF-test') };
 class GetPublicAccessBlockCommand {} class GetObjectCommand {}
 class S3Client { async send(command) { return command instanceof GetPublicAccessBlockCommand ? { PublicAccessBlockConfiguration: fixture.publicAccess } : { ContentLength:fixture.bytes.length, Body: { transformToByteArray:async()=>fixture.bytes } }; } }
 export { env as testEnv, fixture };`
);
const book = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const id = 'cs_test_example123';
const token = book.bookToken(id, 2000);
assert.equal(book.verifyBookToken(token, 1000), id);
assert.equal(book.verifyBookToken(token, 2000), null);
assert.equal(book.verifyBookToken(token.replace('example', 'other') + 'x', 1000), null);
assert.equal(book.verifyBookToken(token.split('.')[0] + '.AAAA', 1000), null);
assert.equal(book.verifyBookToken('malformed', 1000), null);
assert.equal(
	book.verifyBookToken(book.bookToken('cs_test_other456', 2000), 1000),
	'cs_test_other456'
);
assert.equal(book.verifyBookToken(book.bookToken('bad-id', 2000), 1000), null);
assert.equal(book.bookSalesReady(), false);
Object.assign(book.testEnv, {
	BOOK_SALES_ENABLED: 'true',
	AWS_BOOKS_BUCKET_NAME: 'private-books',
	BOOK_UA_OBJECT_KEY: 'book.pdf'
});
assert.equal(book.bookSalesReady(), true);
const paid = {
	mode: 'payment',
	payment_status: 'paid',
	metadata: { type: 'book', book: book.BOOK_SLUG },
	currency: 'pln',
	amount_total: 4900
};
assert.equal(book.isPaidBook(paid), true);
for (const change of [
	{ payment_status: 'unpaid' },
	{ mode: 'subscription' },
	{ currency: 'eur' },
	{ amount_total: 1 },
	{ metadata: { type: 'shop' } }
])
	assert.equal(book.isPaidBook({ ...paid, ...change }), false);
assert.equal((await book.readPrivateBook()).toString(), '%PDF-test');
book.fixture.publicAccess.BlockPublicPolicy = false;
await assert.rejects(book.readPrivateBook(), /block all public access/);
book.fixture.publicAccess.BlockPublicPolicy = true;
book.fixture.bytes = Buffer.from('not a PDF');
await assert.rejects(book.readPrivateBook(), /must be a PDF/);
console.log(
	'Book delivery: token, expiry, unpaid/wrong-product access, activation, private storage and PDF validation passed.'
);
