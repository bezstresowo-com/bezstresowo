import { command, getRequestEvent } from '$app/server';
import { ADMIN_PASSWORD_HASH } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { clearAdminAuthCookie, setAdminAuthCookie } from '$shared/server/functions/admin-auth';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import { verifyAdminPassword } from '$shared/server/functions/verify-admin-password';
import { error } from '@sveltejs/kit';

import { LoginDto } from './dto/misc';

/** 10 attempts / 15 minutes per address - no human admin ever hits this. */
const loginAttempts = createRateLimiter({ max: 10, windowMs: 15 * 60 * 1000 });

export const login = command(dtoSchema(LoginDto), async ({ password }) => {
	const { cookies } = getRequestEvent();

	if (!loginAttempts.consume(clientAddress())) {
		error(HttpStatus.TOO_MANY_REQUESTS, { message: 'api.errors.TOO_MANY_REQUESTS' });
	}

	if (!verifyAdminPassword(password, ADMIN_PASSWORD_HASH)) {
		error(HttpStatus.UNAUTHORIZED, { message: 'api.errors.UNAUTHORIZED' });
	}

	setAdminAuthCookie(cookies);
});

export const logout = command(async () => {
	clearAdminAuthCookie(getRequestEvent().cookies);
});

/** Not every adapter can resolve the caller's address - fall back to a shared bucket. */
function clientAddress(): string {
	try {
		return getRequestEvent().getClientAddress();
	} catch {
		return 'unknown';
	}
}
