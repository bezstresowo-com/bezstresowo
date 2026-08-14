import { query } from '$app/server';
import { DEFAULT_LOCALE } from '$i18n';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { isNil } from 'lodash-es';

import { ProductListParamsDto, type LocalizedProduct } from './dto/product';

/**
 * Public product listing. Everything lives in our database - Stripe is only
 * used to open a checkout session (see `checkout.remote.ts`).
 */
export const getProducts = query(
	dtoSchema(ProductListParamsDto),
	async ({ lang, siteLocation }): Promise<LocalizedProduct[]> => {
		const products = await prisma.product.findMany({
			where: {
				active: true,
				...(isNil(siteLocation) ? {} : { siteLocations: { has: siteLocation } })
			},
			include: { price: true, internationalizedProducts: true }
		});

		return products
			.map((product) => {
				const translation =
					product.internationalizedProducts.find((candidate) => candidate.lang === lang) ??
					product.internationalizedProducts.find(
						(candidate) => candidate.lang === DEFAULT_LOCALE
					) ??
					product.internationalizedProducts[0];

				if (isNil(translation)) {
					return null;
				}

				const s3 = new S3Service();

				return {
					id: product.id,
					slug: product.slug,
					name: translation.name,
					description: translation.description,
					mediaIds: translation.mediaIds,
					imageUrls: translation.mediaIds.map((mediaId) => s3.buildUrl(mediaId)),
					priceInMinorUnits: product.price.inMinorUnits,
					currency: product.price.currency,
					siteLocations: product.siteLocations,
					orderKey: product.orderKey
				};
			})
			.filter(
				(product): product is LocalizedProduct & { orderKey: string | null } => !isNil(product)
			)
			.sort((a, b) => (a.orderKey ?? a.name).localeCompare(b.orderKey ?? b.name, lang))
			.map(({ orderKey: _orderKey, ...product }) => product);
	}
);
