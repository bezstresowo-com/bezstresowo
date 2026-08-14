import { command } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { error } from '@sveltejs/kit';

import { MediaIdDto, UploadMediaDto } from './dto/misc';

/** 8 MB of raw bytes - remote function payloads are JSON, so files are base64. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/svg+xml',
	'video/mp4',
	'video/webm'
];

export const uploadMedia = command(
	dtoSchema(UploadMediaDto),
	async ({ id, mimeType, dataBase64 }) => {
		requireAdmin();

		if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
			error(HttpStatus.UNSUPPORTED_MEDIA_TYPE, { message: 'api.errors.BAD_REQUEST' });
		}

		const buffer = Buffer.from(dataBase64, 'base64');

		if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
			error(HttpStatus.PAYLOAD_TOO_LARGE, { message: 'api.errors.BAD_REQUEST' });
		}

		const { url } = await new S3Service().uploadFile(buffer, id, mimeType);

		return { id, url };
	}
);

export const deleteMedia = command(dtoSchema(MediaIdDto), async ({ id }) => {
	requireAdmin();

	await new S3Service().deleteFile(id);
});
