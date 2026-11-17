// Where audits live: <root>/<slug>/audit.json, report.md and screens/.
// Every path a tool accepts is resolved inside the audit's own folder.
import { existsSync, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function auditsRoot() {
	return path.resolve(process.env.AUDITS_DIR ?? path.join(process.cwd(), 'audits'));
}

export function auditDir(slug: string, root = auditsRoot()) {
	if (!SLUG.test(slug)) throw new Error(`Not a valid audit slug: "${slug}". Use lowercase letters, numbers and hyphens.`);
	return path.join(root, slug);
}

// Resolve a relative path inside an audit folder. Refuses absolute paths and "..".
export function inside(dir: string, relative: string) {
	const full = path.resolve(dir, relative);
	if (path.isAbsolute(relative) || (full !== dir && !full.startsWith(dir + path.sep)))
		throw new Error(`Path "${relative}" must stay inside the audit folder.`);
	return full;
}

export function fileExists(dir: string) {
	return (relative: string) => {
		try {
			const full = inside(dir, relative);
			return existsSync(full) && statSync(full).isFile();
		} catch {
			return false;
		}
	};
}

export async function readAuditFile(dir: string): Promise<unknown> {
	return JSON.parse(await readFile(path.join(dir, 'audit.json'), 'utf8'));
}

export async function writeAuditFile(dir: string, audit: unknown) {
	await mkdir(dir, { recursive: true });
	await writeFile(path.join(dir, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');
}
