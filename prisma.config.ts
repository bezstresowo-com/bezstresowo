import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma reads env from the ambient process; it never auto-loads `.env.local`
// (only `.env`). Load it here so CLI commands (generate / db push) pick up
// DATABASE_URL; skip when it's already provided by the shell/CI.
if (!process.env.DATABASE_URL) {
	try {
		process.loadEnvFile(path.join(import.meta.dirname, '.env.local'));
	} catch {
		// no .env.local (e.g. CI) — rely on the ambient environment
	}
}

export default defineConfig({
	// Multi-file schema: recursively picks up prisma/*.prisma
	schema: path.join(import.meta.dirname, 'prisma')
});
