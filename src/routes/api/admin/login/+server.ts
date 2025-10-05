import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { setAdminAuthCookie } from '$shared/server/functions/admin-auth.js';
import { validateRequest } from '$shared/server/functions/validate-body.js';
import { createHash } from 'crypto';

import { json } from '@sveltejs/kit';

import { LoginRequestDto } from './model';
import type { HttpErrorResponse, HttpStatusResponse } from '$shared/global/types/http';

export async function POST({ request, cookies }) {
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
		return json({ status: 'ok' } satisfies HttpStatusResponse, { status: HttpStatus.OK });
	} else {
		return json({ message: 'api.admin.login.errors.invalidPassword' } satisfies HttpErrorResponse, {
			status: HttpStatus.UNAUTHORIZED
		});
	}
}
