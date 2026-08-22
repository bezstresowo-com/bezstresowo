import { command, query } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { cleanupMedia } from '$shared/server/functions/media-cleanup';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';

import { UpsertBioDto, type InternationalizedBioDto } from './dto/bio';

const BIO_INCLUDE = {
	internationalizedBios: { orderBy: { lang: 'asc' as const } }
};

/** The bucket config is server side only, so admin reads carry the public URL
 * of the shared portrait for the panel to preview. */
function withImageUrl<T extends { imageId: string | null }>(bio: T) {
	return {
		...bio,
		imageUrl: isNil(bio.imageId) ? null : new S3Service().buildUrl(bio.imageId)
	};
}

/** The singleton with all of its language versions; `null` before the seed. */
export const getAdminBio = query(async () => {
	requireAdmin();

	const bio = await prisma.bio.findFirst({ include: BIO_INCLUDE });

	return isNil(bio) ? null : withImageUrl(bio);
});

/**
 * Upserts the singleton. Like products (and unlike blog articles), submitted
 * language versions fully replace the stored ones - a version missing from the
 * payload is deleted, not kept disabled.
 */
export const updateBio = command(dtoSchema(UpsertBioDto), async (dto) => {
	requireAdmin();

	assertUniqueLanguages(dto.translations);

	const rows = dto.translations.map((translation) => ({
		lang: translation.lang,
		content: translation.content,
		mediaIds: translation.mediaIds
	}));

	const existing = await prisma.bio.findFirst({ include: BIO_INCLUDE });

	if (isNil(existing)) {
		const created = await prisma.bio.create({
			data: {
				imageId: dto.imageId ?? null,
				internationalizedBios: { create: rows }
			},
			include: BIO_INCLUDE
		});

		return withImageUrl(created);
	}

	// The shared portrait is a cleanup candidate like any translation media -
	// when the save keeps it, `cleanupMedia` sees it referenced and leaves it be.
	const previousMediaIds = [
		...existing.internationalizedBios.flatMap((translation) => translation.mediaIds),
		...(isNil(existing.imageId) ? [] : [existing.imageId])
	];

	const updated = await prisma.bio.update({
		where: { id: existing.id },
		data: {
			imageId: dto.imageId ?? null,
			internationalizedBios: {
				deleteMany: {},
				create: rows
			}
		},
		include: BIO_INCLUDE
	});

	// Runs after the write committed, so a bucket failure can never leave a
	// live row pointing at a deleted object.
	await cleanupMedia(previousMediaIds);

	return withImageUrl(updated);
});

function assertUniqueLanguages(translations: InternationalizedBioDto[]) {
	const languages = translations.map((translation) => translation.lang);

	if (new Set(languages).size !== languages.length) {
		error(HttpStatus.BAD_REQUEST, { message: 'api.errors.BAD_REQUEST' });
	}
}
