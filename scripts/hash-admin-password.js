#!/usr/bin/env node
/**
 * Prints an `ADMIN_PASSWORD_HASH` value in the `scrypt:<salt>:<hash>` format
 * expected by `src/shared/server/functions/verify-admin-password.ts`:
 *
 *   node scripts/hash-admin-password.js <password>
 */

import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];

if (!password) {
	console.error('Usage: node scripts/hash-admin-password.js <password>');
	process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`);
