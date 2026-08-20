import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline/promises';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

/**
 * Interactive helper for managing Vercel environment variables via `npx vercel`.
 *
 * Actions:
 * 1. Remove ALL variables from a chosen Vercel environment
 * 2. Push all variables from a local .env.* file into one or more Vercel
 *    environments (optionally marked as sensitive, default yes)
 * 3. Pull all variables from a Vercel environment into a local file
 *
 * Run with: npm run manage:vercel:envs  (or: npx tsx scripts/manage-vercel-envs.ts)
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const ENVIRONMENTS = [
	{ label: 'Production', slug: 'production' },
	{ label: 'Preview', slug: 'preview' },
	{ label: 'Development', slug: 'development' },
] as const;

type EnvSlug = (typeof ENVIRONMENTS)[number]['slug'];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/** rl.question that aborts loudly when stdin closes (Ctrl+D/Ctrl+Z, EOF). */
async function ask(prompt: string): Promise<string> {
	let onClose!: () => void;
	try {
		return await Promise.race([
			rl.question(prompt),
			new Promise<never>((_, reject) => {
				onClose = () => reject(new Error('Input stream closed, aborting.'));
				rl.once('close', onClose);
			}),
		]);
	} finally {
		rl.removeListener('close', onClose);
	}
}

interface RunResult {
	ok: boolean;
	stdout: string;
	stderr: string;
}

/** Quote an argument so it survives shell: true (needed for npx on Windows). */
function quoteArg(arg: string): string {
	if (/^[A-Za-z0-9_.\-=/\\:@]+$/.test(arg)) return arg;
	return `"${arg.replace(/"/g, '\\"')}"`;
}

/**
 * Run `npx vercel <args>`. Variable values are always passed via stdin
 * (never argv), so they can't leak into shell history or be mangled by
 * shell quoting.
 */
function runVercel(args: string[], input?: string): RunResult {
	// Single command string (not an args array) because shell: true is
	// needed to run npx on Windows and args arrays trigger DEP0190 there
	const command = ['npx', 'vercel', ...args].map(quoteArg).join(' ');
	const result = spawnSync(command, {
		cwd: ROOT_DIR,
		encoding: 'utf-8',
		shell: true,
		windowsHide: true,
		input,
	});
	return {
		ok: result.status === 0,
		stdout: result.stdout ?? '',
		stderr: result.stderr ?? '',
	};
}

function formatCliError(result: RunResult): string {
	return (result.stderr || result.stdout)
		.trim()
		.split('\n')
		.map((line) => `    ${line}`)
		.join('\n');
}

/** Verify the Vercel CLI runs, is authenticated and the repo is linked. */
function preflight(): void {
	const version = runVercel(['--version']);
	if (!version.ok) {
		console.error('✗ Could not run `npx vercel`. Install dependencies first:');
		console.error('    npm install');
		process.exit(1);
	}

	const whoami = runVercel(['whoami']);
	if (!whoami.ok) {
		console.error('✗ Vercel CLI is not authenticated. Log in first:');
		console.error('    npx vercel login');
		console.error('  and link this repo to the Vercel project if needed:');
		console.error('    npx vercel link');
		process.exit(1);
	}

	const isLinked =
		fs.existsSync(path.join(ROOT_DIR, '.vercel', 'project.json')) ||
		fs.existsSync(path.join(ROOT_DIR, '.vercel', 'repo.json'));
	if (!isLinked) {
		console.error('✗ This repo is not linked to a Vercel project. Link it:');
		console.error('    npx vercel link');
		process.exit(1);
	}

	console.log(
		`✓ Vercel CLI ${version.stdout.trim()}, logged in as ${whoami.stdout.trim()}`
	);
}

async function choose(title: string, options: string[]): Promise<number> {
	console.log(`\n${title}`);
	options.forEach((option, i) => console.log(`  [${i + 1}] ${option}`));
	for (;;) {
		const answer = (await ask('> ')).trim();
		const index = Number(answer) - 1;
		if (Number.isInteger(index) && index >= 0 && index < options.length) {
			return index;
		}
		console.log(`Enter a number between 1 and ${options.length}.`);
	}
}

async function chooseMany(title: string, options: string[]): Promise<number[]> {
	console.log(`\n${title} (comma-separated numbers, or "all")`);
	options.forEach((option, i) => console.log(`  [${i + 1}] ${option}`));
	for (;;) {
		const answer = (await ask('> ')).trim().toLowerCase();
		if (answer === 'all') return options.map((_, i) => i);
		const indexes = answer.split(',').map((part) => Number(part.trim()) - 1);
		const valid =
			indexes.length > 0 &&
			indexes.every((i) => Number.isInteger(i) && i >= 0 && i < options.length);
		if (valid) return [...new Set(indexes)];
		console.log(
			`Enter numbers between 1 and ${options.length} (e.g. "1,2") or "all".`
		);
	}
}

async function confirm(
	question: string,
	defaultYes: boolean
): Promise<boolean> {
	const suffix = defaultYes ? '(Y/n)' : '(y/N)';
	const answer = (await ask(`${question} ${suffix} `)).trim().toLowerCase();
	if (answer === '') return defaultYes;
	return answer === 'y' || answer === 'yes';
}

/** Parse variable names out of the `vercel env ls <env>` table output. */
function listEnvVarNames(env: EnvSlug): string[] {
	const result = runVercel(['env', 'ls', env]);
	if (!result.ok) {
		throw new Error(
			`Failed to list variables for ${env}:\n${formatCliError(result)}`
		);
	}
	const names = new Set<string>();
	for (const line of result.stdout.split('\n')) {
		const match = line.match(/^\s+([A-Za-z_][A-Za-z0-9_]*)\s+\S/);
		if (match && match[1] !== 'name') names.add(match[1]);
	}
	return [...names];
}

async function removeAllAction(): Promise<void> {
	const envIndex = await choose(
		'Remove ALL variables from which environment?',
		ENVIRONMENTS.map((e) => e.label)
	);
	const env = ENVIRONMENTS[envIndex];

	console.log(`\nFetching variables in ${env.label}...`);
	const names = listEnvVarNames(env.slug);
	if (names.length === 0) {
		console.log(`✓ No variables found in ${env.label}, nothing to remove.`);
		return;
	}

	console.log(`Found ${names.length} variable(s) in ${env.label}:`);
	names.forEach((name) => console.log(`  - ${name}`));
	const confirmation = (
		await ask(
			`\nThis permanently deletes all of them from ${env.label}. ` +
				`Type "${env.slug}" to confirm: `
		)
	).trim();
	if (confirmation !== env.slug) {
		console.log('Aborted, nothing was removed.');
		return;
	}

	const failed: string[] = [];
	for (const name of names) {
		process.stdout.write(`Removing ${name}... `);
		const result = runVercel(['env', 'rm', name, env.slug, '--yes']);
		console.log(result.ok ? '✓' : '✗');
		if (!result.ok) {
			failed.push(name);
			console.error(formatCliError(result));
		}
	}

	if (failed.length > 0) {
		console.error(
			`\n✗ Removed ${names.length - failed.length}/${names.length}, ` +
				`failed: ${failed.join(', ')}`
		);
		process.exitCode = 1;
	} else {
		console.log(
			`\n✓ Removed all ${names.length} variable(s) from ${env.label}`
		);
	}
}

async function pushAction(): Promise<void> {
	const envFiles = fs
		.readdirSync(ROOT_DIR)
		.filter((file) => file.startsWith('.env'))
		.sort();
	if (envFiles.length === 0) {
		console.error('✗ No .env* files found in the repo root.');
		process.exitCode = 1;
		return;
	}

	const fileIndex = await choose('Push variables from which file?', envFiles);
	const file = envFiles[fileIndex];
	const vars = dotenv.parse(
		fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8')
	);
	const keys = Object.keys(vars);
	if (keys.length === 0) {
		console.error(`✗ ${file} contains no variables.`);
		process.exitCode = 1;
		return;
	}

	const targetIndexes = await chooseMany(
		'Push into which environment(s)?',
		ENVIRONMENTS.map((e) => e.label)
	);
	const selected = targetIndexes.map((i) => ENVIRONMENTS[i].slug);

	const sensitive = await confirm('Mark pushed variables as sensitive?', false);

	// Vercel rejects sensitive variables in the Development environment
	// (their values must stay readable locally for `vercel dev`/`env pull`),
	// so Development gets its own non-sensitive batch when needed.
	const batches: { targets: EnvSlug[]; sensitive: boolean }[] = [];
	if (sensitive && selected.includes('development')) {
		console.log(
			'\n⚠ Vercel does not support sensitive variables in the Development environment.'
		);
		const others = selected.filter((slug) => slug !== 'development');
		if (others.length > 0) batches.push({ targets: others, sensitive: true });
		if (await confirm('Push to Development as NON-sensitive instead?', true)) {
			batches.push({ targets: ['development'], sensitive: false });
		}
	} else {
		batches.push({ targets: selected, sensitive });
	}
	if (batches.every((batch) => batch.targets.length === 0)) {
		console.log('No environments left to push to, aborted.');
		return;
	}

	console.log(`\nAbout to push ${keys.length} variable(s) from ${file}:`);
	for (const batch of batches) {
		console.log(
			`  → ${batch.targets.join(', ')}${batch.sensitive ? ' (sensitive)' : ''}`
		);
	}
	console.log('Existing variables with the same names will be overwritten.');
	if (!(await confirm('Continue?', false))) {
		console.log('Aborted, nothing was pushed.');
		return;
	}

	const failed: string[] = [];
	for (const key of keys) {
		for (const batch of batches) {
			// Multiple targets must be one comma-separated argument, and the
			// sensitivity flag must always be explicit: since CLI v58 `env add`
			// defaults to sensitive in production/preview/custom environments,
			// so omitting --sensitive no longer means non-sensitive.
			const args = [
				'env',
				'add',
				key,
				batch.targets.join(','),
				'--force',
				batch.sensitive ? '--sensitive' : '--no-sensitive',
			];
			process.stdout.write(`Pushing ${key} → ${batch.targets.join(', ')}... `);
			const result = runVercel(args, vars[key]);
			console.log(result.ok ? '✓' : '✗');
			if (!result.ok) {
				failed.push(`${key} (${batch.targets.join(', ')})`);
				console.error(formatCliError(result));
			}
		}
	}

	if (failed.length > 0) {
		console.error(`\n✗ Some pushes failed: ${failed.join('; ')}`);
		process.exitCode = 1;
	} else {
		console.log(`\n✓ Pushed ${keys.length} variable(s) from ${file}`);
	}
}

async function pullAction(): Promise<void> {
	const envIndex = await choose(
		'Pull variables from which environment?',
		ENVIRONMENTS.map((e) => e.label)
	);
	const env = ENVIRONMENTS[envIndex];

	let fileName = '';
	while (fileName === '') {
		fileName = (await ask('Write to which file? (e.g. .env.pulled): ')).trim();
	}

	const filePath = path.join(ROOT_DIR, fileName);
	if (fs.existsSync(filePath)) {
		const overwrite = await confirm(
			`${fileName} already exists and will be overwritten. Continue?`,
			false
		);
		if (!overwrite) {
			console.log('Aborted, nothing was pulled.');
			return;
		}
	}

	console.log(`\nPulling ${env.label} variables into ${fileName}...`);
	const result = runVercel([
		'env',
		'pull',
		fileName,
		`--environment=${env.slug}`,
		'--yes',
	]);
	if (!result.ok) {
		console.error(`✗ Pull failed:\n${formatCliError(result)}`);
		process.exitCode = 1;
		return;
	}

	console.log(`✓ Pulled ${env.label} variables into ${fileName}`);
	console.log(
		'⚠ Sensitive variables cannot be decrypted, so they are not included.'
	);
	console.log(`⚠ Make sure ${fileName} is gitignored if it contains secrets.`);
}

async function main(): Promise<void> {
	console.log('Vercel env helper (manage-vercel-envs)');
	preflight();

	const action = await choose('What do you want to do?', [
		'Remove ALL variables from a Vercel environment',
		'Push variables from a local .env.* file to Vercel',
		'Pull variables from a Vercel environment into a local file',
	]);

	if (action === 0) await removeAllAction();
	else if (action === 1) await pushAction();
	else await pullAction();
}

main()
	.catch((error) => {
		console.error(`✗ ${error instanceof Error ? error.message : error}`);
		process.exitCode = 1;
	})
	.finally(() => rl.close());
