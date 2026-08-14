import { command, getRequestEvent } from '$app/server';
import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { clearAdminAuthCookie, setAdminAuthCookie } from '$shared/server/functions/admin-auth';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { error } from '@sveltejs/kit';
import { createHash } from 'node:crypto';

import { LoginDto } from './dto/misc';

export const login = command(dtoSchema(LoginDto), async ({ password }) => {
	const { cookies } = getRequestEvent();
	const passwordHash = createHash('sha256').update(password).digest('hex');

	if (ADMIN_PASSWORD_HASH !== passwordHash) {
		error(HttpStatus.UNAUTHORIZED, { message: 'api.errors.UNAUTHORIZED' });
	}

	setAdminAuthCookie(cookies);
});

export const logout = command(async () => {
	clearAdminAuthCookie(getRequestEvent().cookies);
});
