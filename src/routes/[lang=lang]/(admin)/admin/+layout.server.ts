import { HttpStatus } from '$shared/global/enums/http-status';
import { isAdminAuthenticated } from '$shared/server/functions/admin-auth.js';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url, params }) => {
	const isAuthenticated = isAdminAuthenticated(cookies);
	// The panel lives under the language prefix like every other page.
	const loginPath = `/${params.lang}/admin/login`;

	// If not authenticated and not on login page, redirect to login
	if (!isAuthenticated && url.pathname !== loginPath) {
		throw redirect(HttpStatus.FOUND, loginPath);
	}

	// If authenticated and on login page, redirect to admin dashboard
	if (isAuthenticated && url.pathname === loginPath) {
		throw redirect(HttpStatus.FOUND, `/${params.lang}/admin/blog`);
	}

	return {
		isAuthenticated
	};
};
