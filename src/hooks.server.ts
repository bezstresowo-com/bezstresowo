import { resolve } from '$app/paths';
import { HttpStatus } from '$shared/global/enums/http-status';
import type { HttpErrorResponse } from '$shared/global/types/http';
import { isAdminAuthenticated } from '$shared/server/functions/admin-auth';
import { json, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve: resolveEvent }) => {
	// Protect all /api/admin routes
	if (event.route.id?.startsWith(resolve('/api/admin'))) {
		const isLoggedIn = isAdminAuthenticated(event.cookies);
		if (!isLoggedIn) {
			return json(
				{
					message: 'api.admin.errors.notLoggedIn'
				} satisfies HttpErrorResponse,
				{ status: HttpStatus.UNAUTHORIZED }
			);
		}
	}

	return resolveEvent(event);
};
