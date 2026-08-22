import { query } from '$app/server';
import { DEFAULT_LOCALE } from '$i18n';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { isNil } from 'lodash-es';

import { BioParamsDto, type LocalizedBio } from './dto/bio';

/**
 * The "About me" section of the home page. `null` (nothing seeded yet) simply
 * hides the section - there is no hardcoded fallback content anymore.
 */
export const getBio = query(
	dtoSchema(BioParamsDto),
	async ({ lang }): Promise<LocalizedBio | null> => {
		const bio = await prisma.bio.findFirst({ include: { internationalizedBios: true } });

		if (isNil(bio)) {
			return null;
		}

		const translation =
			bio.internationalizedBios.find((candidate) => candidate.lang === lang) ??
			bio.internationalizedBios.find((candidate) => candidate.lang === DEFAULT_LOCALE) ??
			bio.internationalizedBios[0];

		if (isNil(translation)) {
			return null;
		}

		return {
			imageUrl: isNil(bio.imageId) ? null : new S3Service().buildUrl(bio.imageId),
			content: translation.content
		};
	}
);
