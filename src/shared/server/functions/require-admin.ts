import { getRequestEvent } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { error } from '@sveltejs/kit';

import { isAdminAuthenticated } from './admin-auth';

/**
 * Guard for admin-only remote functions.
 *
 * Remote functions are all served from the same `/_app/remote/...` prefix, so
 * they cannot be protected by a path check in `hooks.server.ts` the way the old
 * `/api/admin/*` endpoints were - every admin remote function calls this instead.
 */
export function requireAdmin() {
	const event = getRequestEvent();

	if (!isAdminAuthenticated(event.cookies)) {
		error(HttpStatus.UNAUTHORIZED, { message: 'api.errors.UNAUTHORIZED' });
	}

	return event;
}
