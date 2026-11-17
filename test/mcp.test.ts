// Talk to the real server over stdio, the way an agent does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ROOT, template, tempAuditDir } from './helpers.ts';

type TextResult = { content: { type: string; text: string }[]; isError?: boolean };

async function connect(auditsDir: string) {
	const client = new Client({ name: 'test', version: '0.0.0' });
	await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(ROOT, 'mcp/server.ts')], env: { ...process.env, AUDITS_DIR: auditsDir } as Record<string, string> }));
	return client;
}

const body = (r: unknown) => JSON.parse((r as TextResult).content[0].text);

test('the server lists its tools and enforces the rules on save', async () => {
	const audits = await tempAuditDir([]);
	const client = await connect(audits);
	try {
		const tools = (await client.listTools()).tools.map((t) => t.name).sort();
		assert.deepEqual(tools, ['annotate_screen', 'audit_overview', 'capture_page', 'compare_audits', 'get_audit', 'list_audits', 'save_audit']);

		const audit = template();
		const refused = await client.callTool({ name: 'save_audit', arguments: { slug: audit.slug, audit } });
		assert.equal((refused as TextResult).isError, true);
		assert.match(JSON.stringify(body(refused).problems), /No file at screens\/step-01-phone.png/);

		const mismatch = await client.callTool({ name: 'save_audit', arguments: { slug: 'other-slug', audit } });
		assert.match(body(mismatch).message, /does not match "other-slug"/);

		const traversal = await client.callTool({ name: 'get_audit', arguments: { slug: '../etc' } });
		assert.equal((traversal as TextResult).isError, true);
	} finally {
		await client.close();
	}
});

test('a valid record saves with computed scores and reads back', async () => {
	const audits = await tempAuditDir([]);
	const audit = template();
	const files = ['screens/step-01-phone.png', 'screens/step-01-phone-full.png', 'screens/step-01-desktop.png', 'screens/rival-01-phone.png'];
	await tempAuditDirAt(path.join(audits, audit.slug), files);
	const client = await connect(audits);
	try {
		const saved = body(await client.callTool({ name: 'save_audit', arguments: { slug: audit.slug, audit } }));
		assert.equal(saved.ok, true);
		assert.equal(saved.summary.audit_score, 42);
		assert.deepEqual(saved.ranked.map((r: { id: string; score: number }) => [r.id, r.score]), [['F1', 11]]);

		const listed = body(await client.callTool({ name: 'list_audits', arguments: {} }));
		assert.deepEqual(listed.audits, [{ slug: audit.slug, site: audit.site, date: audit.date, mode: audit.mode, audit_score: 42 }]);
	} finally {
		await client.close();
	}
});

async function tempAuditDirAt(dir: string, files: string[]) {
	const { mkdir, writeFile } = await import('node:fs/promises');
	for (const f of files) {
		await mkdir(path.dirname(path.join(dir, f)), { recursive: true });
		await writeFile(path.join(dir, f), '');
	}
}
