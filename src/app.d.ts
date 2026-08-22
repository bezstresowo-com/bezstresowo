// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Locale } from '$i18n';

declare global {
	namespace App {
		interface Error {
			/** Translation key (see `src/i18n/translations`), never a user facing string. */
			message: string;
			/** Present when a remote function rejected its input. */
			issues?: {
				field: string;
				messages: string[];
			}[];
		}

		interface Locals {
			locale: Locale;
			isAdmin: boolean;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
