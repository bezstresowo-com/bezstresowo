import { command, getRequestEvent } from '$app/server';
import { STRIPE_SK } from '$env/static/private';
import { LOCALE_PREFIXES, type Locale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { toStripeCurrency } from '$shared/global/functions/to-stripe-currenty';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';
import Stripe from 'stripe';

import { RegistrationCheckoutDto, ShopCheckoutDto, type CheckoutSession } from './dto/misc';
import type {
	ConsultationRegistrationCheckoutMetadata,
	ShopCheckoutMetadata
} from './dto/stripe-metadata';

const STRIPE_API_VERSION = '2025-11-17.clover';

export const createRegistrationCheckout = command(
	dtoSchema(RegistrationCheckoutDto),
	async (dto): Promise<CheckoutSession> => {
		const { product, translation } = await loadProduct(dto.productId, dto.lang, 'registrations');

		const session = await stripe().checkout.sessions.create({
			line_items: [buildLineItem(product, translation, 1)],
			mode: 'payment',
			success_url: pageUrl('/registration-success', dto.lang),
			cancel_url: pageUrl('/registration-cancel', dto.lang),
			locale: stripeLocale(dto.lang),
			phone_number_collection: { enabled: true },
			customer_email: dto.email,
			metadata: {
				type: 'consultation-registration',
				therapyName: dto.therapyName,
				nameAndSurname: dto.nameAndSurname,
				tel: dto.tel,
				email: dto.email,
				message: dto.message ?? ''
			} satisfies ConsultationRegistrationCheckoutMetadata
		});

		return { sessionId: session.id, url: session.url };
	}
);

export const createShopCheckout = command(
	dtoSchema(ShopCheckoutDto),
	async (dto): Promise<CheckoutSession> => {
		const { product, translation } = await loadProduct(dto.productId, dto.lang, 'shop');
		const quantity = dto.quantity ?? 1;

		const session = await stripe().checkout.sessions.create({
			line_items: [buildLineItem(product, translation, quantity)],
			mode: 'payment',
			success_url: pageUrl('/shop-success', dto.lang),
			cancel_url: pageUrl('/shop-cancel', dto.lang),
			locale: stripeLocale(dto.lang),
			phone_number_collection: { enabled: true },
			metadata: {
				type: 'shop',
				productId: product.id,
				productName: translation.name
			} satisfies ShopCheckoutMetadata
		});

		return { sessionId: session.id, url: session.url };
	}
);

function stripe() {
	return new Stripe(STRIPE_SK, { apiVersion: STRIPE_API_VERSION as never });
}

async function loadProduct(productId: string, lang: Locale, siteLocation: string) {
	const product = await prisma.product.findFirst({
		where: { id: productId, active: true, siteLocations: { has: siteLocation } },
		include: { price: true, internationalizedProducts: true }
	});

	if (isNil(product)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	const translation =
		product.internationalizedProducts.find((candidate) => candidate.lang === lang) ??
		product.internationalizedProducts[0];

	if (isNil(translation)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	return { product, translation };
}

function buildLineItem(
	product: { price: { currency: string; inMinorUnits: number } },
	translation: { name: string; description: string },
	quantity: number
): Stripe.Checkout.SessionCreateParams.LineItem {
	return {
		quantity,
		price_data: {
			currency: toStripeCurrency(product.price.currency),
			unit_amount: product.price.inMinorUnits,
			product_data: {
				name: translation.name,
				// Stripe rejects an empty string here.
				...(translation.description ? { description: translation.description } : {})
			}
		}
	};
}

function pageUrl(path: string, lang: Locale) {
	return new URL(`/${LOCALE_PREFIXES[lang]}${path}`, getRequestEvent().url.origin).toString();
}

function stripeLocale(lang: Locale): Stripe.Checkout.SessionCreateParams.Locale {
	return LOCALE_PREFIXES[lang] as Stripe.Checkout.SessionCreateParams.Locale;
}
