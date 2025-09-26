import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { HttpStatus } from '$shared/enums/http-status';
import { setAdminAuthCookie } from '$shared/server/functions/admin-auth.js';
import { validateBody } from '$shared/server/functions/validate-body.js';
import { createHash } from 'crypto';

import { json } from '@sveltejs/kit';

import { LoginRequestDto } from './model';

export async function POST({ request, cookies }) {
	const body = await request.json();
	const validationResult = await validateBody(body, LoginRequestDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}
	const {
		dto: { password }
	} = validationResult;

	const hash = createHash('sha256');
	hash.update(password);
	const passwordHash = hash.digest('hex');
	if (ADMIN_PASSWORD_HASH === passwordHash) {
		// Password is correct - set auth cookie
		setAdminAuthCookie(cookies);
		return json({ success: true, message: 'Login successful' });
	} else {
		// Password is incorrect
		return json(
			{ success: false, message: 'Invalid password' },
			{ status: HttpStatus.UNAUTHORIZED }
		);
	}
}
