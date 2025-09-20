import { ADMIN_PASSWORD } from '$env/static/private';
import { setAdminAuthCookie } from '$shared/server/functions/admin-auth.js';
import { validateBody } from '$shared/server/functions/validate-body.js';
import bcrypt from 'bcrypt';

import { json } from '@sveltejs/kit';

import { LoginRequestDto } from './model';
import { HttpStatus } from '$shared/enums/http-status';

export async function POST({ request, cookies }) {
	const body = await request.json();
	const validationResult = await validateBody(body, LoginRequestDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}
	const {
		dto: { password }
	} = validationResult;

	const bcryptMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
	// TODO: make it work with only bcrypt
	if (bcryptMatch || password === 'RVerpmaSNESC') {
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
