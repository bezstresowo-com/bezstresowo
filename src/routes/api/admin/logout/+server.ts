import { HttpStatus } from '$shared/enums/http-status.js';
import { clearAdminAuthCookie } from '$shared/server/functions/admin-auth';
import type { HttpStatusResponse } from '$shared/types/http.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ cookies }) {
	// Clear the admin auth cookie
	clearAdminAuthCookie(cookies);
	return json({ status: 'ok' } satisfies HttpStatusResponse, {
		status: HttpStatus.OK
	});
}
