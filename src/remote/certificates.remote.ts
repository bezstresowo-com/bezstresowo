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

const FALLBACK_CERTIFICATE_FILES = [
	'cert-17.jpg',
	'cert-18.jpg',
	...Array.from({ length: 17 }, (_, index) => `cert-${index}.jpg`)
];

/** The home page gallery, in the order set in the panel. */
export const getCertificates = query(
	dtoSchema(CertificateListParamsDto),
	async ({ lang }): Promise<LocalizedCertificate[]> => {
		const certificates = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });
		const s3 = new S3Service();

		if (certificates.length === 0) {
			return FALLBACK_CERTIFICATE_FILES.map((file, index) => ({
				id: `fallback-${file}`,
				imageUrl: `/assets/certs/${file}`,
				thumbnailUrl: `/assets/certs/thumbs/${file.replace(/\.jpg$/, '.webp')}`,
				alt:
					lang === 'uk-UA'
						? `Диплом або сертифікат про освіту ${index + 1}`
						: `Dyplom lub certyfikat potwierdzający kwalifikacje ${index + 1}`
			}));
		}

		return certificates.map((certificate) => {
			const alts = toAltRecord(certificate.altTexts);
			const seededFile = seededCertificateFile(certificate.imageId);

			return {
				id: certificate.id,
				imageUrl: seededFile ? `/assets/certs/${seededFile}` : s3.buildUrl(certificate.imageId),
				thumbnailUrl: seededFile
					? `/assets/certs/thumbs/${seededFile.replace(/\.jpg$/, '.webp')}`
					: undefined,
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
function seededCertificateFile(imageId: string): string | undefined {
	return /^seed-(cert-\d+\.jpg)$/.exec(imageId)?.[1];
}
