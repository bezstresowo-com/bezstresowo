import { HttpStatus } from '$shared/global/enums/http-status.js';
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(HttpStatus.PERMANENT_REDIRECT, '/home');
}
