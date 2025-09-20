import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_SECRET = 'admin_authenticated'; // In production, this should be a proper signed JWT or encrypted token

/**
 * Sets the admin authentication cookie
 */
export function setAdminAuthCookie(cookies: Cookies) {
	cookies.set(ADMIN_SESSION_COOKIE, SESSION_SECRET, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

/**
 * Clears the admin authentication cookie
 */
export function clearAdminAuthCookie(cookies: Cookies) {
	cookies.delete(ADMIN_SESSION_COOKIE, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict'
	});
}

/**
 * Checks if the user is authenticated as admin
 */
export function isAdminAuthenticated(cookies: Cookies) {
	const sessionCookie = cookies.get(ADMIN_SESSION_COOKIE);
	return sessionCookie === SESSION_SECRET;
}

/**
 * Redirects to login if not authenticated
 */
export function requireAdminAuth(cookies: Cookies) {
	if (!isAdminAuthenticated(cookies)) {
		throw new Response(null, {
			status: 302,
			headers: {
				location: '/admin/login'
			}
		});
	}
}
