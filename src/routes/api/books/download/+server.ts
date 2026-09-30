import { STRIPE_SK } from '$env/static/private';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import {
	isPaidBook,
	readPrivateBook,
	verifyBookToken
} from '$shared/server/services/book-delivery';
import { error } from '@sveltejs/kit';
import Stripe from 'stripe';

const limiter = createRateLimiter({ max: 20, windowMs: 60_000 });
export async function GET({ url, getClientAddress }) {
	if (!limiter.consume(getClientAddress())) error(429, 'Спробуй ще раз за хвилину.');
	const sessionId = verifyBookToken(url.searchParams.get('token') ?? '');
	if (!sessionId)
		error(
			403,
			'Посилання недійсне або термін його дії минув. Напиши на bezstresowo.org@gmail.com для відновлення доступу.'
		);
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	const session = await stripe.checkout.sessions.retrieve(sessionId);
	if (!isPaidBook(session)) error(403, 'Оплату книги не підтверджено.');
	const pdf = await readPrivateBook();
	return new Response(new Uint8Array(pdf), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="Koly-tryvoha-atakuie.pdf"',
			'Cache-Control': 'private, no-store',
			'Referrer-Policy': 'no-referrer',
			'X-Robots-Tag': 'noindex, nofollow',
			'X-Content-Type-Options': 'nosniff'
		}
	});
}
