import { STRIPE_SK } from '$env/static/private';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import {
	isPaidBook,
	readPrivateBook,
	verifyBookToken
} from '$shared/server/services/book-delivery';
import { consumeBookDownload } from '$shared/server/services/book-download-counter';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

const limiter = createRateLimiter({ max: 20, windowMs: 60_000 });
export function GET({ url }) {
	redirect(
		303,
		`/uk/book-download?token=${encodeURIComponent(url.searchParams.get('token') ?? '')}`
	);
}

export async function POST({ request, url, getClientAddress }) {
	if (request.headers.get('origin') !== url.origin) error(403, 'Forbidden');
	if (Number(request.headers.get('content-length') ?? 0) > 4096) error(413, 'Payload too large');
	const form = await request.formData();
	if (!limiter.consume(getClientAddress())) error(429, 'Спробуй ще раз за хвилину.');
	const sessionId = verifyBookToken(String(form.get('token') ?? ''));
	if (!sessionId)
		error(403, 'Посилання недійсне. Напиши на bezstresowo.org@gmail.com для відновлення доступу.');
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	const session = await stripe.checkout.sessions.retrieve(sessionId);
	if (!isPaidBook(session)) error(403, 'Оплату книги не підтверджено.');
	const pdf = await readPrivateBook();
	if (!(await consumeBookDownload(prisma.bookDownload, sessionId)))
		error(
			403,
			'Усі три завантаження використані. Напиши на bezstresowo.org@gmail.com для відновлення доступу.'
		);
	return new Response(new Uint8Array(pdf), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="Koly-tryvoha-atakuie.pdf"; filename*=UTF-8''${encodeURIComponent('Коли тривога атакує.pdf')}`,
			'Cache-Control': 'private, no-store',
			'Referrer-Policy': 'no-referrer',
			'X-Robots-Tag': 'noindex, nofollow',
			'X-Content-Type-Options': 'nosniff'
		}
	});
}
