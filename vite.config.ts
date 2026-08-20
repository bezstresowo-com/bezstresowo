import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const prismaClientDir = fileURLToPath(
	new URL('./src/shared/server/generated/prisma', import.meta.url)
);

/**
 * Vite bundles the generated Prisma client's JS into the SvelteKit server
 * chunks, but the native query-engine binary (`libquery_engine*.node`) sits
 * next to the generated client and is loaded by path at runtime, not imported -
 * so it is left behind. On Vercel that leaves the serverless function without an
 * engine ("could not locate the Query Engine for runtime rhel-openssl-3.0.x").
 *
 * Copy every engine binary into the server build's `chunks/` dir (the first
 * location Prisma searches at runtime) and the server root (its fallback).
 * `writeBundle` runs after the server files are written but before the Vercel
 * adapter's `closeBundle` packages the function, so the binary ships with it.
 * The Linux engine only exists when `prisma generate` ran with the
 * `rhel-openssl-3.0.x` binary target (see prisma/schema.prisma).
 */
function copyPrismaQueryEngine(): Plugin {
	return {
		name: 'copy-prisma-query-engine',
		apply: 'build',
		writeBundle(options) {
			const outDir = options.dir;
			if (!outDir || !outDir.replace(/\\/g, '/').endsWith('/output/server')) return;
			if (!existsSync(prismaClientDir)) return;

			const engines = readdirSync(prismaClientDir).filter(
				(file) => file.startsWith('libquery_engine') && file.endsWith('.node')
			);
			if (engines.length === 0) {
				this.warn(`No Prisma query engine found in ${prismaClientDir}`);
				return;
			}

			const chunksDir = join(outDir, 'chunks');
			mkdirSync(chunksDir, { recursive: true });
			for (const engine of engines) {
				const from = join(prismaClientDir, engine);
				copyFileSync(from, join(chunksDir, engine));
				copyFileSync(from, join(outDir, engine));
			}
			this.info(`Copied Prisma query engine(s) into server build: ${engines.join(', ')}`);
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), copyPrismaQueryEngine()],
	ssr: {
		noExternal: ['class-validator', 'class-transformer']
	},
	optimizeDeps: {
		exclude: ['class-validator', 'class-transformer']
	}
});
