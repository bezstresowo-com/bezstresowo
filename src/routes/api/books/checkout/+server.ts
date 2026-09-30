import { STRIPE_SK } from '$env/static/private';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import {
	BOOK_NAME,
	BOOK_PRICE,
	BOOK_SLUG,
	bookSalesReady,
	readPrivateBook
} from '$shared/server/services/book-delivery';
import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';

const limiter = createRateLimiter({ max: 10, windowMs: 60_000 });
export async function POST({ request, url, getClientAddress }) {
	if (request.headers.get('origin') !== url.origin) error(403, 'Forbidden');
	if (!limiter.consume(getClientAddress())) error(429, 'Спробуй ще раз за хвилину.');
	if (!bookSalesReady()) error(503, 'Продаж книги ще готується.');
	// Check privacy and the actual PDF before allowing a customer to pay.
	try {
		await Promise.all([readPrivateBook(), prisma.bookDownload.count()]);
	} catch {
		error(503, 'Книга тимчасово недоступна для покупки.');
	}
	const stripe = new Stripe(STRIPE_SK, { apiVersion: '2025-11-17.clover' as never });
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		locale: 'auto',
		allow_promotion_codes: true,
		adaptive_pricing: { enabled: false },
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: 'pln',
					unit_amount: BOOK_PRICE,
					product_data: {
						name: BOOK_NAME,
						description: 'Електронна книга у PDF · 75 сторінок · 21 практика'
					}
				}
			}
		],
		success_url: new URL('/uk/book-success', url.origin).toString(),
		cancel_url: new URL('/uk/materials/koly-tryvoha-atakuie', url.origin).toString(),
		metadata: { type: 'book', book: BOOK_SLUG, lang: 'uk', deliveryOrigin: url.origin }
	});
	return json({ url: session.url });
}
