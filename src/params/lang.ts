import { isLocalePrefix } from '$i18n';

import type { ParamMatcher } from '@sveltejs/kit';

/** Restricts the `[lang]` segment to the supported language prefixes. */
export const match: ParamMatcher = (param) => isLocalePrefix(param);
