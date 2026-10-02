import { STRIPE_SK } from '$env/static/private';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import {
	BOOK_PRICE,
	BOOK_SLUG,
	bookSalesReady,
	readPrivateBook,
	resolveBook
} from '$shared/server/services/book-delivery';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';

const limiter = createRateLimiter({ max: 10, windowMs: 60_000 });
export async function POST({ request, url, getClientAddress }) {
	const book = resolveBook(url.searchParams.get('book') ?? BOOK_SLUG);
	if (!book) error(400, 'Unknown book');
	const pl = book.lang === 'pl';
	if (request.headers.get('origin') !== url.origin) error(403, 'Forbidden');
	if (!limiter.consume(getClientAddress()))
		error(429, pl ? 'Spróbuj ponownie za minutę.' : 'Спробуй ще раз за хвилину.');
	if (!bookSalesReady(book))
		error(503, pl ? 'Sprzedaż książki jest jeszcze przygotowywana.' : 'Продаж книги ще готується.');
	// Check privacy and the actual PDF before allowing a customer to pay.
	try {
		await Promise.all([readPrivateBook(book), prisma.bookDownload.count()]);
	} catch {
		error(
			503,
			pl
				? 'Książka jest chwilowo niedostępna. Spróbuj później.'
				: 'Книга тимчасово недоступна для покупки.'
		);
	}
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		locale: pl ? 'pl' : 'auto',
		allow_promotion_codes: true,
		adaptive_pricing: { enabled: false },
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: 'pln',
					unit_amount: BOOK_PRICE,
					product_data: {
						name: book.name,
						description: pl
							? 'Książka elektroniczna PDF · 75 stron · 21 ćwiczeń'
							: 'Електронна книга у PDF · 75 сторінок · 21 практика'
					}
				}
			}
		],
		success_url: new URL(`/${book.lang}/book-success`, url.origin).toString(),
		cancel_url: new URL(book.path, url.origin).toString(),
		metadata: { type: 'book', book: book.slug, lang: book.lang, deliveryOrigin: url.origin }
	});
	return json({ url: session.url });
}
