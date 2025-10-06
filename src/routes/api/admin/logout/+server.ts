import { clearAdminAuthCookie } from '$shared/server/functions/admin-auth';
import { buildOkResponse } from '$shared/server/functions/build-response.js';

export async function DELETE({ cookies }) {
	// Clear the admin auth cookie
	clearAdminAuthCookie(cookies);
	return buildOkResponse();
}
