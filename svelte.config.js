import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	compilerOptions: {
		// `await` directly inside components (used together with remote functions)
		experimental: {
			async: true
		}
	},

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		// Note: adapter-auto accepts no options - for per-function control
		// (runtime, split) switch to an explicit `@sveltejs/adapter-vercel`.
		adapter: adapter(),
		experimental: {
			// `*.remote.ts` files replace the old `/api` + `fetch-methods` pairs
			remoteFunctions: true
		},
		paths: {
			// Pages are nested (`/pl/blog/<slug>`), so relative asset URLs would
			// resolve against the wrong directory.
			relative: false
		},
		alias: {
			$shared: './src/shared',
			$i18n: './src/i18n',
			$remote: './src/remote'
		}
	}
};

export default config;
