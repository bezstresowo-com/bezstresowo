import { isServiceSlug } from '$lib/ServicesSection/model';

import type { ParamMatcher } from '@sveltejs/kit';

/** Restricts the dynamic service route to the six public service pages. */
export const match: ParamMatcher = (param) => isServiceSlug(param);
