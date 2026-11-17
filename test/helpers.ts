import { readFileSync } from 'node:fs';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import type { Audit } from '../src/schema.ts';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function template(): Audit {
	return JSON.parse(readFileSync(path.join(ROOT, 'skills/conversion-audit/assets/audit.template.json'), 'utf8')) as Audit;
}

// A temporary audit folder holding empty files at the paths the template cites.
export async function tempAuditDir(files: string[]) {
	const dir = await mkdtemp(path.join(tmpdir(), 'conversion-audit-'));
	for (const f of files) {
		await mkdir(path.dirname(path.join(dir, f)), { recursive: true });
		await writeFile(path.join(dir, f), '');
	}
	return dir;
}

export async function chromeAvailable() {
	try {
		const browser = await chromium.launch({ channel: 'chrome', headless: true });
		await browser.close();
		return true;
	} catch {
		return false;
	}
}
