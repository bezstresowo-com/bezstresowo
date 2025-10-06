import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { setAdminAuthCookie } from '$shared/server/functions/admin-auth.js';
import { buildErrorResponse, buildOkResponse } from '$shared/server/functions/build-response';
import { validateRequest } from '$shared/server/functions/validate-body.js';
import { createHash } from 'crypto';

import { LoginRequestDto } from './model';

export async function POST({ request, cookies, route }) {
	const validationResult = await validateRequest(await request.json(), LoginRequestDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const { password } = validationResult.dto;

	const hash = createHash('sha256');
	hash.update(password);
	const passwordHash = hash.digest('hex');
	if (ADMIN_PASSWORD_HASH === passwordHash) {
		setAdminAuthCookie(cookies);
		return buildOkResponse();
	} else {
		return buildErrorResponse(route, request, HttpStatus.UNAUTHORIZED);
	}
}
