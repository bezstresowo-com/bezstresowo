import { resolve } from '$app/paths';
import { HttpStatus } from '$shared/global/enums/http-status';
import { isAdminAuthenticated } from '$shared/server/functions/admin-auth';
import { buildErrorResponse } from '$shared/server/functions/build-response';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve: resolveEvent }) => {
	// Protect all /api/admin routes
	if (event.route.id?.startsWith(resolve('/api/admin'))) {
		const isLoggedIn = isAdminAuthenticated(event.cookies);
		if (!isLoggedIn) {
			return buildErrorResponse(
				{ id: resolve('/api/admin/login') },
				{ method: 'POST' } as any,
				HttpStatus.UNAUTHORIZED
			);
		}
	}

	return resolveEvent(event);
};
