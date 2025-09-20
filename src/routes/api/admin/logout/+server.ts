import { clearAdminAuthCookie } from '$shared/server/functions/admin-auth';
import { json } from '@sveltejs/kit';

export async function DELETE({ cookies }) {
	// Clear the admin auth cookie
	clearAdminAuthCookie(cookies);
	return json({ success: true, message: 'Logout successful' });
}
