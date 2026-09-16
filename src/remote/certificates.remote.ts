import { query } from '$app/server';
import { DEFAULT_LOCALE } from '$i18n';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';

import {
	CertificateListParamsDto,
	toAltRecord,
	type LocalizedCertificate
} from './dto/certificate';

/** The home page gallery, in the order set in the panel. */
export const getCertificates = query(
	dtoSchema(CertificateListParamsDto),
	async ({ lang }): Promise<LocalizedCertificate[]> => {
		const certificates = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });
		const s3 = new S3Service();

		return certificates.map((certificate) => {
			const alts = toAltRecord(certificate.altTexts);

			return {
				id: certificate.id,
				imageUrl: certificateImageUrl(certificate.imageId, s3),
				alt: alts[lang] ?? alts[DEFAULT_LOCALE] ?? ''
			};
		});
	}
);

/**
 * The original certificate imports already live in `static/assets/certs`.
 * Serving their optimized copies avoids downloading the much larger seed
 * originals from the media bucket. Certificates added in the panel continue
 * to use their S3 URL.
 */
function certificateImageUrl(imageId: string, s3: S3Service): string {
	const seededFile = /^seed-(cert-\d+\.jpg)$/.exec(imageId)?.[1];

	return seededFile ? `/assets/certs/${seededFile}` : s3.buildUrl(imageId);
}
