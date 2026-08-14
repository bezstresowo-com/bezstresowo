import { command, query } from '$app/server';
import { Locale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { buildProductJsonLD } from '$shared/server/functions/json-ld';
import { cleanupMedia } from '$shared/server/functions/media-cleanup';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';

import {
	PRODUCT_CURRENCY,
	ProductIdDto,
	UpdateProductDto,
	UpsertProductDto,
	type InternationalizedProductDto
} from './dto/product';

const PRODUCT_INCLUDE = {
	price: true,
	internationalizedProducts: { orderBy: { lang: 'asc' as const } }
};

export const getAdminProducts = query(async () => {
	requireAdmin();

	return await prisma.product.findMany({
		include: PRODUCT_INCLUDE,
		orderBy: { createdAt: 'desc' }
	});
});

export const createProduct = command(dtoSchema(UpsertProductDto), async (dto) => {
	requireAdmin();

	assertUniqueLanguages(dto.translations);
	await assertFreeSlug(dto.slug);

	return await prisma.product.create({
		data: {
			slug: dto.slug,
			active: dto.active ?? true,
			siteLocations: dto.siteLocations,
			orderKey: dto.orderKey ?? null,
			price: {
				create: {
					currency: PRODUCT_CURRENCY,
					inMinorUnits: dto.priceInMinorUnits
				}
			},
			internationalizedProducts: {
				create: dto.translations.map((translation) => toTranslationRow(translation, dto))
			}
		},
		include: PRODUCT_INCLUDE
	});
});

export const updateProduct = command(dtoSchema(UpdateProductDto), async (dto) => {
	requireAdmin();

	assertUniqueLanguages(dto.translations);

	const existing = await prisma.product.findFirst({
		where: { id: dto.id },
		include: PRODUCT_INCLUDE
	});

	if (isNil(existing)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	await assertFreeSlug(dto.slug, dto.id);

	const previousMediaIds = existing.internationalizedProducts.flatMap(
		(translation) => translation.mediaIds
	);

	const updated = await prisma.product.update({
		where: { id: dto.id },
		data: {
			slug: dto.slug,
			active: dto.active ?? true,
			siteLocations: dto.siteLocations,
			orderKey: dto.orderKey ?? null,
			price: {
				update: {
					currency: PRODUCT_CURRENCY,
					inMinorUnits: dto.priceInMinorUnits
				}
			},
			internationalizedProducts: {
				deleteMany: {},
				create: dto.translations.map((translation) => toTranslationRow(translation, dto))
			}
		},
		include: PRODUCT_INCLUDE
	});

	await cleanupMedia(previousMediaIds);

	return updated;
});

export const deleteProduct = command(dtoSchema(ProductIdDto), async ({ id }) => {
	requireAdmin();

	const existing = await prisma.product.findFirst({
		where: { id },
		include: PRODUCT_INCLUDE
	});

	if (isNil(existing)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	const mediaIds = existing.internationalizedProducts.flatMap(
		(translation) => translation.mediaIds
	);

	await prisma.product.delete({ where: { id } });
	// The one-to-one price row is not cascaded by the relation, drop it here.
	await prisma.price.delete({ where: { id: existing.priceId } }).catch(() => undefined);
	await cleanupMedia(mediaIds);
});

function assertUniqueLanguages(translations: InternationalizedProductDto[]) {
	const languages = translations.map((translation) => translation.lang);

	if (new Set(languages).size !== languages.length) {
		error(HttpStatus.BAD_REQUEST, { message: 'api.errors.BAD_REQUEST' });
	}
}

async function assertFreeSlug(slug: string, ignoreProductId?: string) {
	const clashing = await prisma.product.findFirst({
		where: { slug, ...(isNil(ignoreProductId) ? {} : { id: { not: ignoreProductId } }) },
		select: { id: true }
	});

	if (!isNil(clashing)) {
		error(HttpStatus.CONFLICT, { message: 'api.errors.CONFLICT' });
	}
}

function toTranslationRow(
	translation: InternationalizedProductDto,
	product: { slug: string; active?: boolean; priceInMinorUnits: number }
) {
	const mediaIds = translation.mediaIds ?? [];
	const [featuredImageId] = mediaIds;

	return {
		lang: translation.lang,
		name: translation.name,
		description: translation.description,
		mediaIds,
		// JSON-LD is materialized on write only, never while rendering.
		metadataJsonLD: buildProductJsonLD({
			locale: translation.lang as Locale,
			slug: product.slug,
			name: translation.name,
			description: translation.description,
			priceInMinorUnits: product.priceInMinorUnits,
			currency: PRODUCT_CURRENCY,
			imageUrl: isNil(featuredImageId) ? null : new S3Service().buildUrl(featuredImageId),
			available: product.active ?? true
		})
	};
}
