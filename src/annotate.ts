// Draw numbered finding boxes on a screenshot. Uses Chrome to composite, so there is
// no image library to install. Boxes are in CSS pixels; `scale` is the screenshot's
// device scale factor (2 for phone captures, 1 for desktop).
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { inside } from './store.ts';
import type { Box } from './schema.ts';

export interface Mark {
	label: string;
	box: Box;
}

export function pngSize(buf: Buffer) {
	const signature = '89504e470d0a1a0a';
	if (buf.subarray(0, 8).toString('hex') !== signature) throw new Error('Not a PNG file.');
	return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export async function annotateScreen(opts: { dir: string; screen: string; marks: Mark[]; scale: number; out?: string }) {
	if (opts.marks.length === 0) throw new Error('Give at least one mark to draw.');
	const source = inside(opts.dir, opts.screen);
	const outRel = opts.out ?? opts.screen.replace(/\.png$/, '') + '-annotated.png';
	const out = inside(opts.dir, outRel);
	const png = await readFile(source);
	const { width, height } = pngSize(png);

	const drawn: string[] = [];
	const outside: string[] = [];
	const boxes = opts.marks
		.map((m) => {
			const b = { x: m.box.x * opts.scale, y: m.box.y * opts.scale, w: m.box.width * opts.scale, h: m.box.height * opts.scale };
			if (b.x >= width || b.y >= height) {
				outside.push(m.label);
				return '';
			}
			drawn.push(m.label);
			const stroke = Math.max(3, Math.round(2 * opts.scale));
			const badge = Math.round(26 * opts.scale);
			return `<div class="box" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-width:${stroke}px"></div>
<div class="badge" style="left:${Math.max(0, b.x - badge / 2)}px;top:${Math.max(0, b.y - badge / 2)}px;width:${badge}px;height:${badge}px;font-size:${Math.round(badge * 0.55)}px">${escapeHtml(m.label)}</div>`;
		})
		.join('\n');

	const html = `<!doctype html><html><head><style>
html,body{margin:0;padding:0}
.wrap{position:relative;width:${width}px;height:${height}px}
img{display:block;width:${width}px;height:${height}px}
.box{position:absolute;box-sizing:border-box;border-style:solid;border-color:#d4183d;box-shadow:0 0 0 2px #fff}
.badge{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#d4183d;color:#fff;font:700 14px/1 system-ui,sans-serif;box-shadow:0 0 0 2px #fff}
</style></head><body><div class="wrap"><img src="data:image/png;base64,${png.toString('base64')}">${boxes}</div></body></html>`;

	const browser = await chromium.launch({ channel: 'chrome', headless: true });
	try {
		const page = await browser.newPage({ viewport: { width, height: Math.min(height, 16000) }, deviceScaleFactor: 1 });
		await page.setContent(html, { waitUntil: 'load' });
		await page.locator('.wrap').screenshot({ path: out });
	} finally {
		await browser.close();
	}
	return { out: path.relative(opts.dir, out), drawn, outside };
}

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}
