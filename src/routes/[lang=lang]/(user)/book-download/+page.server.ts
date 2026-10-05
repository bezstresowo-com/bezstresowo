import { STRIPE_SK } from '$env/static/private';
import {
	isPaidBook,
	MAX_BOOK_DOWNLOADS,
	tokenBook,
	verifyBookToken
} from '$shared/server/services/book-delivery';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function load({ url, setHeaders, params }) {
	setHeaders({
		'cache-control': 'private, no-store',
		// Keep same-origin POST identity in Safari; never send the token to other sites.
		'referrer-policy': 'same-origin',
		'x-robots-tag': 'noindex, nofollow'
	});
	const token = url.searchParams.get('token') ?? '';
	const sessionId = verifyBookToken(token);
	const book = tokenBook(token);
	const pl = params.lang === 'pl';
	if (!sessionId || !book)
		error(
			403,
			pl
				? 'Link jest nieprawidłowy. Napisz na bezstresowo.org@gmail.com.'
				: 'Посилання недійсне. Напиши на bezstresowo.org@gmail.com.'
		);
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	if (params.lang !== book.lang)
		redirect(303, `/${book.lang}/book-download?token=${encodeURIComponent(token)}`);
	if (!isPaidBook(await stripe.checkout.sessions.retrieve(sessionId), book))
		error(403, pl ? 'Płatność nie została potwierdzona.' : 'Оплату книги не підтверджено.');
	const order = await prisma.bookDownload.findUnique({ where: { id: sessionId } });
	if (!order)
		error(
			503,
			pl
				? 'Dostęp jest przygotowywany. Spróbuj za chwilę.'
				: 'Доступ ще готується. Спробуй трохи пізніше.'
		);
	return {
		token,
		lang: book.lang,
		name: book.name,
		remaining: Math.max(0, MAX_BOOK_DOWNLOADS - order.downloads)
	};
}
