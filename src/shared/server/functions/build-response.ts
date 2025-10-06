import { HTTP_STATUS_VALUE_NAME_MAP, HttpStatus } from '$shared/global/enums/http-status';
import type { HttpErrorResponse, HttpStatusResponse } from '$shared/global/types/http';
import { json } from '@sveltejs/kit';
import { isEmpty, isNil } from 'lodash-es';

export function buildErrorResponse(
	route: { id: string },
	request: Request,
	httpStatus: HttpStatus,
	data?: Record<string, any>
) {
	let errorTranslationString = `${route.id
		.split('/')
		.filter((s) => !isEmpty(s))
		.join('.')}.${request.method}.errors.${HTTP_STATUS_VALUE_NAME_MAP[httpStatus]}`;

	if (!isNil(data)) {
		errorTranslationString += `@${JSON.stringify(data)}`;
	}

	return json(
		{
			message: errorTranslationString
		} satisfies HttpErrorResponse,
		{ status: httpStatus }
	);
}

export function buildOkResponse() {
	return json({ status: 'ok' } satisfies HttpStatusResponse, { status: HttpStatus.OK });
}

export function buildResponse<T>(data: T, httpStatus?: HttpStatus) {
	return json(data satisfies T, { status: httpStatus ?? HttpStatus.OK });
}
