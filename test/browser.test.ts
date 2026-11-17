// Real Chrome against a local fixture page. Skips when Chrome is not installed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { capturePage } from '../src/capture.ts';
import { annotateScreen, pngSize } from '../src/annotate.ts';
import { ROOT, chromeAvailable, tempAuditDir } from './helpers.ts';

const hasChrome = await chromeAvailable();
let server: Server;
let base = '';

before(async () => {
	const html = await readFile(path.join(ROOT, 'test/fixtures/landing.html'));
	server = createServer((_req, res) => {
		res.writeHead(200, { 'content-type': 'text/html' });
		res.end(html);
	});
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
});

after(() => server.close());

test('capture reads the facts an audit needs, then annotate draws on the screenshot', { skip: !hasChrome && 'Chrome not installed' }, async () => {
	const dir = await tempAuditDir([]);
	const result = await capturePage({ url: base, dir, step: '01', waitMs: 200 });
	assert.equal(result.kind, 'ok');
	if (result.kind !== 'ok') return;
	assert.equal(result.devices.length, 2);

	const phone = result.devices.find((d) => d.device === 'phone');
	assert.ok(phone);
	assert.deepEqual(phone.facts.h1, ['Quality plumbing since 1998']);
	assert.deepEqual(phone.facts.tel_links, ['tel:+15550100']);
	assert.ok(phone.tracking.includes('Google Tag Manager'));
	assert.ok(phone.facts.structured_data_types.includes('Plumber'));
	assert.match(phone.facts.first_screen_text, /Quality plumbing since 1998/);

	const form = phone.facts.forms.find((f) => f.selector === '#quote');
	assert.ok(form);
	assert.equal(form.fields.length, 3);
	assert.equal(form.submit, 'Submit');
	assert.equal(form.fields.find((f) => f.name === 'company')?.label, '', 'an unlabelled field shows an empty label');
	assert.equal(form.fields.find((f) => f.name === 'phone')?.label, 'Phone');

	assert.ok(phone.facts.overlays.some((o) => /cookies/.test(o.text)), 'the fixed cookie banner is reported');
	assert.equal(phone.facts.horizontal_overflow, false);

	const h1 = phone.facts.elements.find((e) => e.kind === 'heading' && e.level === 1);
	assert.ok(h1?.first_screen);

	// Every selector must point at exactly one element, or a coding agent edits the wrong thing.
	const { chromium } = await import('playwright-core');
	const browser = await chromium.launch({ channel: 'chrome', headless: true });
	try {
		const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
		await page.goto(base);
		const selectors = [...phone.facts.elements.map((e) => e.selector), ...phone.facts.overlays.map((o) => o.selector)];
		for (const selector of selectors) assert.equal(await page.locator(selector).count(), 1, `selector ${selector} should match one element`);
	} finally {
		await browser.close();
	}

	const source = await readFile(path.join(dir, phone.screens.first));
	assert.deepEqual(pngSize(source), { width: 780, height: 1328 }, 'phone screenshot is 390x664 at 2x');

	const drawn = await annotateScreen({ dir, screen: phone.screens.first, marks: [{ label: '1', box: h1.box }, { label: '2', box: { x: 0, y: 5000, width: 10, height: 10 } }], scale: phone.scale });
	assert.deepEqual(drawn.drawn, ['1']);
	assert.deepEqual(drawn.outside, ['2']);
	assert.deepEqual(pngSize(await readFile(path.join(dir, drawn.out))), { width: 780, height: 1328 });
});

test('capture refuses non-web URLs and bad step ids', async () => {
	const dir = await tempAuditDir([]);
	await assert.rejects(capturePage({ url: 'file:///etc/passwd', dir, step: '01' }), /Only http and https/);
	await assert.rejects(capturePage({ url: base, dir, step: '1' }), /two digits/);
});
