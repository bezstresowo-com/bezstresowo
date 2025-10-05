import { HttpStatus } from '$shared/global/enums/http-status.js';
import type { HttpErrorResponse, HttpStatusResponse } from '$shared/global/types/http';
import { S3Service } from '$shared/server/services/s3/s3-service.js';
import { json } from '@sveltejs/kit';
import type { CreateMediaResponseDto } from './model';

export async function POST({ params, request }) {
	const ERROR_PREFIX = 'api.admin.media.[id].POST.errors';

	const formData = await request.formData();
	const allFileEntries = formData.getAll('file') as (string | File)[];
	const files = allFileEntries.filter((entry): entry is File => entry instanceof File);

	if (files.length === 0) {
		return json(
			{
				message: `${ERROR_PREFIX}.NOT_ACCEPTABLE`
			} satisfies HttpErrorResponse,
			{ status: HttpStatus.NOT_ACCEPTABLE }
		);
	}

	if (files.length > 1) {
		return json(
			{
				message: `${ERROR_PREFIX}.PAYLOAD_TOO_LARGE`
			} satisfies HttpErrorResponse,
			{ status: HttpStatus.PAYLOAD_TOO_LARGE }
		);
	}

	try {
		const file = files[0];
		const s3 = new S3Service();
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const { url } = await s3.uploadFile(buffer, params.id, file.type);
		return json({ url } satisfies CreateMediaResponseDto, { status: HttpStatus.OK });
	} catch (error) {
		console.error(error);

		return json(
			{
				message: `${ERROR_PREFIX}.INTERNAL_SERVER_ERROR`
			} satisfies HttpErrorResponse,
			{ status: HttpStatus.INTERNAL_SERVER_ERROR }
		);
	}
}

export async function DELETE({ params }) {
	const s3Service = new S3Service();
	await s3Service.deleteFile(params.id);
	return json({ status: 'ok' } satisfies HttpStatusResponse, { status: HttpStatus.OK });
}
