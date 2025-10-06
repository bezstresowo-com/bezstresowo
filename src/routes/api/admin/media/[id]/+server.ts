import { HttpStatus } from '$shared/global/enums/http-status.js';
import { S3Service } from '$shared/server/services/s3/s3-service.js';
import type { CreateMediaResponseDto } from './model';
import {
	buildErrorResponse,
	buildOkResponse,
	buildResponse
} from '$shared/server/functions/build-response';

export async function POST({ params, request, route }) {
	const formData = await request.formData();
	const allFileEntries = formData.getAll('file') as (string | File)[];
	const files = allFileEntries.filter((entry): entry is File => entry instanceof File);

	if (files.length === 0) {
		return buildErrorResponse(route, request, HttpStatus.NOT_ACCEPTABLE);
	}

	const maxFiles = 1;
	if (files.length > maxFiles) {
		return buildErrorResponse(route, request, HttpStatus.PAYLOAD_TOO_LARGE, { max: maxFiles });
	}

	try {
		const file = files[0];
		const s3 = new S3Service();
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const { url } = await s3.uploadFile(buffer, params.id, file.type);
		return buildResponse<CreateMediaResponseDto>({ url });
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR, { id: params.id });
	}
}

export async function DELETE({ params, route, request }) {
	try {
		const s3Service = new S3Service();
		await s3Service.deleteFile(params.id);
		return buildOkResponse();
	} catch (error) {
		console.error(error);

		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR, { id: params.id });
	}
}
