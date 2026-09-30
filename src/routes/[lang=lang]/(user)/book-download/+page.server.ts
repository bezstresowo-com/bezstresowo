import { STRIPE_SK } from '$env/static/private';
import {
	isPaidBook,
	MAX_BOOK_DOWNLOADS,
	verifyBookToken
} from '$shared/server/services/book-delivery';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function load({ url, setHeaders }) {
	setHeaders({
		'cache-control': 'private, no-store',
		'referrer-policy': 'no-referrer',
		'x-robots-tag': 'noindex, nofollow'
	});
	const token = url.searchParams.get('token') ?? '';
	const sessionId = verifyBookToken(token);
	if (!sessionId) error(403, 'Посилання недійсне. Напиши на bezstresowo.org@gmail.com.');
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	if (!isPaidBook(await stripe.checkout.sessions.retrieve(sessionId)))
		error(403, 'Оплату книги не підтверджено.');
	const order = await prisma.bookDownload.findUnique({ where: { id: sessionId } });
	if (!order) error(503, 'Доступ ще готується. Спробуй трохи пізніше.');
	return { token, remaining: Math.max(0, MAX_BOOK_DOWNLOADS - order.downloads) };
}
