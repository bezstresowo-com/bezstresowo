import { dev } from '$app/environment';
import { resolve } from '$app/paths';
import { COOKIE_MAX_AGE_S, JWT_EXP_INTERVAL_MS, JWT_SECRET } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { isNil } from 'lodash-es';

interface JwtPayload {
	iat: number;
	exp: number;
}

const ADMIN_SESSION_COOKIE = 'admin_session';

/**
 * Sets the admin authentication cookie
 */
export function setAdminAuthCookie(cookies: Cookies) {
	const cookieMaxAge = Number(COOKIE_MAX_AGE_S.replaceAll('_', ''));
	const tokenExpInterval = Number(JWT_EXP_INTERVAL_MS.replaceAll('_', ''));
	const now = Date.now();
	const tokenExpiresAt = now + tokenExpInterval;

	const token = jwt.sign({ iat: now, exp: tokenExpiresAt } satisfies JwtPayload, JWT_SECRET, {
		algorithm: 'HS512'
	});

	cookies.set(ADMIN_SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict',
		maxAge: cookieMaxAge
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
	const token = cookies.get(ADMIN_SESSION_COOKIE);

	if (isNil(token)) {
		return false;
	}

	const tokenExpInterval = Number(JWT_EXP_INTERVAL_MS.replaceAll('_', ''));
	const { iat, exp } = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] }) as JwtPayload;

	const now = Date.now();
	if (iat > now || exp < now || Math.abs(iat - exp) !== tokenExpInterval) return false;
	return true;
}

/**
 * Redirects to login if not authenticated
 */
export function requireAdminAuth(cookies: Cookies) {
	if (!isAdminAuthenticated(cookies)) {
		throw new Response(null, {
			status: HttpStatus.FOUND,
			headers: {
				location: resolve('/(admin)/admin/login')
			}
		});
	}
}
