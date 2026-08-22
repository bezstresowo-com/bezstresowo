import { command, query } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { cleanupMedia } from '$shared/server/functions/media-cleanup';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';
import { isNil } from 'lodash-es';

import {
	CertificateIdDto,
	CreateCertificateDto,
	ReorderCertificatesDto,
	toAltRecord,
	UpdateCertificateDto,
	type AdminCertificate,
	type CertificateAltDto
} from './dto/certificate';

function toAdminCertificate(certificate: {
	id: string;
	imageId: string;
	order: number;
	altTexts: unknown;
}): AdminCertificate {
	return {
		id: certificate.id,
		imageId: certificate.imageId,
		imageUrl: new S3Service().buildUrl(certificate.imageId),
		order: certificate.order,
		altTexts: toAltRecord(certificate.altTexts)
	};
}

/** Empty alt texts are dropped - the section falls back to a generic label. */
function toAltTexts(alts: CertificateAltDto[]): Record<string, string> {
	return Object.fromEntries(
		alts.map((alt) => [alt.lang, alt.text.trim()] as const).filter(([, text]) => text.length > 0)
	);
}

export const getAdminCertificates = query(async (): Promise<AdminCertificate[]> => {
	requireAdmin();

	const certificates = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });

	return certificates.map(toAdminCertificate);
});

/** New certificates join at the end of the gallery - reorder afterwards. */
export const createCertificate = command(
	dtoSchema(CreateCertificateDto),
	async ({ imageId, alts }) => {
		requireAdmin();

		const last = await prisma.certificate.findFirst({
			orderBy: { order: 'desc' },
			select: { order: true }
		});

		const created = await prisma.certificate.create({
			data: {
				imageId,
				order: isNil(last) ? 0 : last.order + 1,
				altTexts: toAltTexts(alts)
			}
		});

		return toAdminCertificate(created);
	}
);

export const updateCertificate = command(dtoSchema(UpdateCertificateDto), async ({ id, alts }) => {
	requireAdmin();

	const existing = await prisma.certificate.findFirst({ where: { id }, select: { id: true } });

	if (isNil(existing)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	const updated = await prisma.certificate.update({
		where: { id },
		data: { altTexts: toAltTexts(alts) }
	});

	return toAdminCertificate(updated);
});

export const deleteCertificate = command(dtoSchema(CertificateIdDto), async ({ id }) => {
	requireAdmin();

	const existing = await prisma.certificate.findFirst({ where: { id } });

	if (isNil(existing)) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	await prisma.certificate.delete({ where: { id } });
	await cleanupMedia([existing.imageId]);
});

/**
 * Rewrites the whole gallery order at once. The payload must contain every
 * existing id exactly once, so a stale panel (certificate added or removed in
 * another tab) fails loudly instead of silently mangling positions.
 */
export const reorderCertificates = command(dtoSchema(ReorderCertificatesDto), async ({ ids }) => {
	requireAdmin();

	const existing = await prisma.certificate.findMany({ select: { id: true } });
	const existingIds = new Set(existing.map((certificate) => certificate.id));

	const matchesExisting =
		ids.length === existingIds.size &&
		new Set(ids).size === ids.length &&
		ids.every((id) => existingIds.has(id));

	if (!matchesExisting) {
		error(HttpStatus.BAD_REQUEST, { message: 'api.errors.BAD_REQUEST' });
	}

	// No transaction on purpose: a partial write leaves duplicate `order`
	// values, which only affects tie-breaking - the next reorder heals it.
	await Promise.all(
		ids.map((id, index) => prisma.certificate.update({ where: { id }, data: { order: index } }))
	);
});
