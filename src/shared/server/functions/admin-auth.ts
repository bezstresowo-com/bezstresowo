import { dev } from '$app/environment';
import { COOKIE_MAX_AGE_S, JWT_EXP_INTERVAL_MS, JWT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { isNil } from 'lodash-es';

/**
 * Bumped whenever the token format changes - tokens without the current
 * version are rejected. v2: `exp`/`iat` moved from milliseconds to the RFC
 * 7519 seconds, so the standard `jwt.verify` expiry check finally applies;
 * the version gate also invalidates old millisecond tokens, which would
 * otherwise pass verification with an absurdly distant expiry.
 */
const TOKEN_VERSION = 2;

interface AdminTokenPayload {
	v?: number;
}

const ADMIN_SESSION_COOKIE = 'admin_session';

/**
 * Sets the admin authentication cookie
 */
export function setAdminAuthCookie(cookies: Cookies) {
	const cookieMaxAge = Number(COOKIE_MAX_AGE_S.replaceAll('_', ''));
	const tokenExpIntervalMs = Number(JWT_EXP_INTERVAL_MS.replaceAll('_', ''));

	const token = jwt.sign({ v: TOKEN_VERSION }, JWT_SECRET, {
		algorithm: 'HS512',
		// `jsonwebtoken` fills in the seconds based `iat` and `exp` itself.
		expiresIn: Math.floor(tokenExpIntervalMs / 1000)
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

	try {
		// Signature and expiry are both enforced by `jwt.verify`.
		const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] }) as AdminTokenPayload;

		return payload.v === TOKEN_VERSION;
	} catch {
		// tampered / expired / malformed token - simply not authenticated
		return false;
	}
}
