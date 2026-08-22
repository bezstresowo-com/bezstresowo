import { defineConfig } from 'prisma/config';

// Once a config file exists the Prisma CLI no longer auto-loads `.env`, but
// `db push` / `studio` still need `DATABASE_URL` from it.
try {
	process.loadEnvFile('.env');
} catch {
	// No `.env` (CI, Vercel) - the variables come from the environment itself.
}

export default defineConfig({
	// Multi-file schema: every `.prisma` file in the folder is merged.
	schema: 'prisma/schema'
});
