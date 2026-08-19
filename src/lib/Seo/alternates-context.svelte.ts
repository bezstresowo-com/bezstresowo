import { getContext, setContext } from 'svelte';

import type { SeoAlternate } from './model';

/**
 * Bridge between `<Seo>` and `<LanguageSelect>`: pages that pass explicit
 * `alternates` (blog articles, whose slug differs per language) publish them
 * here, so the language switcher can navigate to the translated slug instead
 * of naively swapping the URL prefix - which 404s on articles.
 */
export interface PageAlternates {
	/** Pathname the alternates were published for - a stale entry never matches. */
	path: string | undefined;
	alternates: SeoAlternate[] | undefined;
}

const KEY = Symbol('page-alternates');

/** Called once by the `[lang]` layout - the ancestor of both `<Seo>` and the switcher. */
export function providePageAlternates(): PageAlternates {
	const holder = $state<PageAlternates>({ path: undefined, alternates: undefined });

	setContext(KEY, holder);

	return holder;
}

export function getPageAlternates(): PageAlternates | undefined {
	return getContext<PageAlternates | undefined>(KEY);
}
