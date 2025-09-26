import { isAdminAuthenticated } from '$shared/server/functions/admin-auth.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const isAuthenticated = isAdminAuthenticated(cookies);

	console.log({ isAuthenticated });

	// If not authenticated and not on login page, redirect to login
	if (!isAuthenticated && url.pathname !== '/admin/login') {
		throw redirect(302, '/admin/login');
	}

	// If authenticated and on login page, redirect to admin dashboard
	if (isAuthenticated && url.pathname === '/admin/login') {
		throw redirect(302, '/admin');
	}

	return {
		isAuthenticated
	};
};
