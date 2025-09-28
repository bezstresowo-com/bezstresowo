import { isAdminAuthenticated } from '$shared/server/functions/admin-auth.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const isAuthenticated = isAdminAuthenticated(cookies);

	// If not authenticated and not on login page, redirect to login
	if (!isAuthenticated && url.pathname !== resolve('/(admin)/admin/login')) {
		throw redirect(302, resolve('/(admin)/admin/login'));
	}

	// If authenticated and on login page, redirect to admin dashboard
	if (isAuthenticated && url.pathname === resolve('/(admin)/admin/login')) {
		throw redirect(302, resolve('/(admin)/admin'));
	}

	return {
		isAuthenticated
	};
};
