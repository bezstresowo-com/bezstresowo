import { env } from '$env/dynamic/private';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_REGION, AWS_S3_SECRET_ACCESS_KEY } from '$env/static/private';
import { GetObjectCommand, GetPublicAccessBlockCommand, S3Client } from '@aws-sdk/client-s3';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type Stripe from 'stripe';

export const BOOK_SLUG = 'koly-tryvoha-atakuie-ua';
export const BOOK_NAME = 'Коли тривога атакує';
export const BOOK_PRICE = 4900;
export const MAX_BOOK_DOWNLOADS = 3;

export function bookSalesReady() {
	return (
		env.BOOK_SALES_ENABLED === 'true' &&
		Boolean(
			env.AWS_BOOKS_BUCKET_NAME &&
				env.BOOK_UA_OBJECT_KEY &&
				env.BOOK_DOWNLOAD_SECRET &&
				env.BOOK_DOWNLOAD_SECRET.length >= 32
		)
	);
}

function storage() {
	return new S3Client({
		region: AWS_S3_REGION,
		credentials: { accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY },
		...(env.AWS_S3_ENDPOINT ? { endpoint: env.AWS_S3_ENDPOINT, forcePathStyle: true } : {})
	});
}

/** A separate bucket prevents the existing public media cleanup from touching books. */
export async function readPrivateBook() {
	if (!env.AWS_BOOKS_BUCKET_NAME || !env.BOOK_UA_OBJECT_KEY)
		throw new Error('Book storage is not configured');
	const client = storage();
	const { PublicAccessBlockConfiguration: access } = await client.send(
		new GetPublicAccessBlockCommand({ Bucket: env.AWS_BOOKS_BUCKET_NAME })
	);
	if (
		!access?.BlockPublicAcls ||
		!access.IgnorePublicAcls ||
		!access.BlockPublicPolicy ||
		!access.RestrictPublicBuckets
	)
		throw new Error('Book bucket must block all public access');
	const object = await client.send(
		new GetObjectCommand({ Bucket: env.AWS_BOOKS_BUCKET_NAME, Key: env.BOOK_UA_OBJECT_KEY })
	);
	if (!object.Body || (object.ContentLength ?? 0) > 25 * 1024 * 1024)
		throw new Error('Invalid book object');
	const bytes = Buffer.from(await object.Body.transformToByteArray());
	if (bytes.length > 25 * 1024 * 1024 || bytes.subarray(0, 5).toString() !== '%PDF-')
		throw new Error('Book must be a PDF under 25 MB');
	return bytes;
}

function signingKey() {
	const key = env.BOOK_DOWNLOAD_SECRET;
	if (!key || key.length < 32) throw new Error('Book download secret is not configured');
	return key;
}

export function bookToken(sessionId: string) {
	const payload = Buffer.from(JSON.stringify({ sessionId, book: BOOK_SLUG })).toString('base64url');
	const signature = createHmac('sha256', signingKey()).update(payload).digest('base64url');
	return `${payload}.${signature}`;
}

export function verifyBookToken(token: string): string | null {
	if (token.length > 2048) return null;
	const parts = token.split('.');
	if (parts.length !== 2) return null;
	const [payload, signature] = parts;
	const expected = createHmac('sha256', signingKey()).update(payload).digest();
	const actual = Buffer.from(signature, 'base64url');
	if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
	try {
		const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
		if (
			data.book !== BOOK_SLUG ||
			typeof data.sessionId !== 'string' ||
			!/^cs_(test|live)_[A-Za-z0-9]+$/.test(data.sessionId)
		)
			return null;
		return data.sessionId;
	} catch {
		return null;
	}
}

export function isPaidBook(session: Stripe.Checkout.Session) {
	return (
		session.mode === 'payment' &&
		session.payment_status === 'paid' &&
		session.metadata?.type === 'book' &&
		session.metadata?.book === BOOK_SLUG &&
		session.currency === 'pln' &&
		session.amount_total === BOOK_PRICE
	);
}

export function downloadLink(sessionId: string, origin: string) {
	return new URL(`/uk/book-download?token=${bookToken(sessionId)}`, origin).toString();
}
