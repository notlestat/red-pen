// Capture one funnel step: phone and desktop screenshots plus the page facts an audit needs.
// Read-only. It never clicks, types or submits, so it is safe on a prospect's site.
import { chromium, devices as playwrightDevices, type Browser, type Response } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inside } from './store.ts';
import type { Box } from './schema.ts';

export const deviceNames = ['phone', 'desktop'] as const;
export type DeviceName = (typeof deviceNames)[number];

const phone = playwrightDevices['iPhone 13'];
const deviceSettings = {
	phone: { viewport: { width: 390, height: 664 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: phone.userAgent },
	desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, userAgent: undefined },
} as const;

export interface PageElement {
	kind: 'heading' | 'link' | 'button' | 'field';
	text: string;
	selector: string;
	box: Box;
	first_screen: boolean;
	href?: string;
	level?: number;
}

export interface FormField {
	type: string;
	name: string;
	label: string;
	required: boolean;
	autocomplete: string;
	selector: string;
}

export interface PageFacts {
	title: string;
	description: string;
	lang: string;
	h1: string[];
	first_screen_text: string;
	elements: PageElement[];
	forms: { selector: string; submit: string; fields: FormField[] }[];
	tel_links: string[];
	overlays: { selector: string; text: string; coverage: number }[];
	horizontal_overflow: boolean;
	page_height_screens: number;
	structured_data_types: string[];
	globals: string[];
}

export interface DeviceCapture {
	device: DeviceName;
	viewport: { width: number; height: number };
	scale: number;
	screens: { first: string; full: string };
	timing: { load_ms: number; lcp_ms: number | null; cls: number | null; source: 'lab' };
	images: { total_bytes: number; largest: { url: string; bytes: number } | null };
	tracking: string[];
	facts: PageFacts;
}

export type CaptureResult =
	| { kind: 'ok'; url: string; final_url: string; status: number | null; redirects: number; captured_at: string; devices: DeviceCapture[]; record: string }
	| { kind: 'blocked'; url: string; reason: string; captured_at: string };

export function checkUrl(raw: string) {
	let u: URL;
	try {
		u = new URL(raw);
	} catch {
		throw new Error(`Not a URL: ${raw}`);
	}
	if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error(`Only http and https pages can be captured: ${raw}`);
	return u.href;
}

const trackingPatterns: [string, RegExp][] = [
	['Google Analytics 4', /googletagmanager\.com\/gtag\/js|google-analytics\.com\/(g\/collect|analytics\.js)/],
	['Google Tag Manager', /googletagmanager\.com\/gtm\.js/],
	['Google Ads', /googleadservices\.com|googlesyndication\.com\/pagead|gtag\/js\?id=AW-/],
	['Meta Pixel', /connect\.facebook\.net\/.*fbevents\.js|facebook\.com\/tr/],
	['TikTok Pixel', /analytics\.tiktok\.com/],
	['LinkedIn Insight', /snap\.licdn\.com/],
	['PostHog', /posthog/],
	['Hotjar', /hotjar\.com/],
	['Microsoft Clarity', /clarity\.ms/],
	['Segment', /cdn\.segment\.com/],
	['Plausible', /plausible\.io/],
	['Klaviyo', /klaviyo\.com/],
	['Orion', /paradigmmachines\.ai/],
];

const globalNames: Record<string, string> = {
	gtag: 'Google Analytics 4',
	dataLayer: 'Google Tag Manager',
	fbq: 'Meta Pixel',
	ttq: 'TikTok Pixel',
	posthog: 'PostHog',
	hj: 'Hotjar',
	clarity: 'Microsoft Clarity',
	analytics: 'Segment',
	plausible: 'Plausible',
};

const blockedTitle = /just a moment|attention required|access denied|are you a robot|captcha|verify you are human/i;

export async function capturePage(opts: {
	url: string;
	dir: string;
	step: string;
	devices?: readonly DeviceName[];
	waitMs?: number;
	timeoutMs?: number;
}): Promise<CaptureResult> {
	const url = checkUrl(opts.url);
	if (!/^\d{2}$/.test(opts.step)) throw new Error('step must be two digits, like "01".');
	const screensDir = inside(opts.dir, 'screens');
	await mkdir(screensDir, { recursive: true });
	const capturedAt = new Date().toISOString();

	const browser = await chromium.launch({ channel: 'chrome', headless: true });
	try {
		const results: DeviceCapture[] = [];
		let finalUrl = url;
		let status: number | null = null;
		let redirects = 0;
		for (const device of opts.devices ?? deviceNames) {
			const r = await captureDevice(browser, { url, dir: opts.dir, step: opts.step, device, waitMs: opts.waitMs ?? 3000, timeoutMs: opts.timeoutMs ?? 45000 });
			if (r.kind === 'blocked') return { kind: 'blocked', url, reason: r.reason, captured_at: capturedAt };
			results.push(r.capture);
			finalUrl = r.finalUrl;
			status = r.status;
			redirects = r.redirects;
		}
		const record = `captures/step-${opts.step}.json`;
		const full = { url, final_url: finalUrl, status, redirects, captured_at: capturedAt, devices: results };
		await mkdir(inside(opts.dir, 'captures'), { recursive: true });
		await writeFile(inside(opts.dir, record), JSON.stringify(full, null, 2) + '\n');
		return { kind: 'ok', ...full, record };
	} finally {
		await browser.close();
	}
}

async function captureDevice(
	browser: Browser,
	o: { url: string; dir: string; step: string; device: DeviceName; waitMs: number; timeoutMs: number },
): Promise<{ kind: 'ok'; capture: DeviceCapture; finalUrl: string; status: number | null; redirects: number } | { kind: 'blocked'; reason: string }> {
	const settings = deviceSettings[o.device];
	const context = await browser.newContext({
		viewport: settings.viewport,
		deviceScaleFactor: settings.deviceScaleFactor,
		isMobile: settings.isMobile,
		hasTouch: settings.hasTouch,
		...(settings.userAgent ? { userAgent: settings.userAgent } : {}),
	});
	try {
		const page = await context.newPage();
		await page.addInitScript(() => {
			const store = { lcp: null as number | null, cls: 0 };
			(window as unknown as { __auditVitals: typeof store }).__auditVitals = store;
			try {
				new PerformanceObserver((list) => {
					const last = list.getEntries().at(-1);
					if (last) store.lcp = last.startTime;
				}).observe({ type: 'largest-contentful-paint', buffered: true });
				new PerformanceObserver((list) => {
					for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) store.cls += e.value;
				}).observe({ type: 'layout-shift', buffered: true });
			} catch {
				// Older engines without these entry types: vitals stay null.
			}
		});

		const scripts = new Set<string>();
		const images: { url: string; bytes: number }[] = [];
		page.on('response', (res: Response) => {
			const type = res.request().resourceType();
			if (type === 'script') scripts.add(res.url());
			if (type === 'image') {
				const bytes = Number(res.headers()['content-length'] ?? 0);
				if (bytes > 0) images.push({ url: res.url(), bytes });
			}
		});

		const started = Date.now();
		const response = await page.goto(o.url, { waitUntil: 'load', timeout: o.timeoutMs });
		const loadMs = Date.now() - started;
		await page.waitForTimeout(o.waitMs);

		const title = await page.title();
		if (blockedTitle.test(title)) return { kind: 'blocked', reason: `The page shows a bot check ("${title}"). It was not bypassed.` };

		let redirects = 0;
		for (let req = response?.request().redirectedFrom(); req; req = req.redirectedFrom()) redirects += 1;

		const first = `screens/step-${o.step}-${o.device}.png`;
		const full = `screens/step-${o.step}-${o.device}-full.png`;
		await page.screenshot({ path: inside(o.dir, first) });
		await page.screenshot({ path: inside(o.dir, full), fullPage: true });

		const facts = await page.evaluate(readFacts);
		const vitals = await page.evaluate(() => (window as unknown as { __auditVitals?: { lcp: number | null; cls: number } }).__auditVitals ?? null);

		const tracking = new Set<string>();
		for (const src of scripts) for (const [name, re] of trackingPatterns) if (re.test(src)) tracking.add(name);
		for (const g of facts.globals) if (globalNames[g]) tracking.add(globalNames[g]);

		images.sort((a, b) => b.bytes - a.bytes);
		return {
			kind: 'ok',
			finalUrl: page.url(),
			status: response?.status() ?? null,
			redirects,
			capture: {
				device: o.device,
				viewport: settings.viewport,
				scale: settings.deviceScaleFactor,
				screens: { first, full },
				timing: { load_ms: loadMs, lcp_ms: vitals?.lcp == null ? null : Math.round(vitals.lcp), cls: vitals ? Math.round(vitals.cls * 1000) / 1000 : null, source: 'lab' },
				images: { total_bytes: images.reduce((s, i) => s + i.bytes, 0), largest: images[0] ?? null },
				tracking: [...tracking].sort(),
				facts,
			},
		};
	} finally {
		await context.close();
	}
}

// Runs inside the page. Must be self-contained: no imports, no outer variables.
function readFacts(): PageFacts {
	const vh = window.innerHeight;
	const clean = (s: string | null | undefined, max = 140) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

	const visible = (el: Element) => {
		const r = el.getBoundingClientRect();
		if (r.width < 1 || r.height < 1) return false;
		const cs = getComputedStyle(el);
		return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0;
	};

	const selectorOf = (el: Element): string => {
		if (el.id && document.querySelectorAll(`#${CSS.escape(el.id)}`).length === 1) return `#${CSS.escape(el.id)}`;
		const parts: string[] = [];
		let node: Element | null = el;
		while (node && node !== document.body && parts.length < 10) {
			if (node.id && document.querySelectorAll(`#${CSS.escape(node.id)}`).length === 1) {
				parts.unshift(`#${CSS.escape(node.id)}`);
				break;
			}
			const tag = node.tagName.toLowerCase();
			const parent: Element | null = node.parentElement;
			const same = parent ? Array.from(parent.children).filter((c) => c.tagName === node!.tagName) : [];
			parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
			node = parent;
		}
		// Anchor at body so a short path such as "div:nth-of-type(2)" cannot match nested elements too.
		if (node === document.body) parts.unshift('body');
		return parts.join(' > ');
	};

	const boxOf = (el: Element) => {
		const r = el.getBoundingClientRect();
		return { x: Math.max(0, Math.round(r.left + scrollX)), y: Math.max(0, Math.round(r.top + scrollY)), width: Math.round(r.width), height: Math.round(r.height) };
	};

	const labelOf = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
		if (el.id) {
			const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
			if (l) return clean(l.textContent, 80);
		}
		const wrap = el.closest('label');
		if (wrap) return clean(wrap.textContent, 80);
		const aria = el.getAttribute('aria-label');
		if (aria) return clean(aria, 80);
		const by = el.getAttribute('aria-labelledby');
		if (by) return clean(by.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' '), 80);
		return '';
	};

	const elements: PageElement[] = [];
	const push = (el: Element, kind: PageElement['kind'], extra: Partial<PageElement> = {}) => {
		if (elements.length >= 200 || !visible(el)) return;
		const box = boxOf(el);
		const text = clean(kind === 'field' ? labelOf(el as HTMLInputElement) || (el as HTMLInputElement).placeholder : (el as HTMLElement).innerText || el.getAttribute('aria-label') || (el as HTMLInputElement).value);
		elements.push({ kind, text, selector: selectorOf(el), box, first_screen: box.y < vh, ...extra });
	};
	document.querySelectorAll('h1, h2, h3').forEach((el) => push(el, 'heading', { level: Number(el.tagName[1]) }));
	document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]').forEach((el) => push(el, 'button'));
	document.querySelectorAll('a[href]').forEach((el) => push(el, 'link', { href: (el as HTMLAnchorElement).getAttribute('href') ?? '' }));
	document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea').forEach((el) => push(el, 'field'));
	elements.sort((a, b) => a.box.y - b.box.y || a.box.x - b.box.x);

	const fieldsIn = (root: ParentNode) =>
		Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea'))
			.filter(visible)
			.map((f) => ({
				type: f instanceof HTMLInputElement ? f.type : f.tagName.toLowerCase(),
				name: f.name,
				label: labelOf(f),
				required: f.required || f.getAttribute('aria-required') === 'true',
				autocomplete: f.getAttribute('autocomplete') ?? '',
				selector: selectorOf(f),
			}));
	const forms = Array.from(document.forms)
		.filter(visible)
		.map((form) => {
			const submit = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
			return { selector: selectorOf(form), submit: clean((submit as HTMLElement | null)?.innerText || (submit as HTMLInputElement | null)?.value, 60), fields: fieldsIn(form) };
		});
	const loose = fieldsIn(document).filter((f) => !document.querySelector(f.selector)?.closest('form'));
	if (loose.length) forms.push({ selector: '(fields outside a form element)', submit: '', fields: loose });

	const firstScreen: string[] = [];
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	for (let n = walker.nextNode(); n && firstScreen.join(' ').split(' ').length < 120; n = walker.nextNode()) {
		const parent = n.parentElement;
		const text = clean(n.textContent, 300);
		if (!parent || !text || parent.closest('script, style, noscript, nav')) continue;
		const r = parent.getBoundingClientRect();
		if (r.top + scrollY < vh && r.width > 0 && r.height > 0 && visible(parent)) firstScreen.push(text);
	}

	const overlays: PageFacts['overlays'] = [];
	document.querySelectorAll('body *').forEach((el) => {
		if (overlays.length >= 10) return;
		const cs = getComputedStyle(el);
		if ((cs.position !== 'fixed' && cs.position !== 'sticky') || !visible(el)) return;
		const r = el.getBoundingClientRect();
		const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
		const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
		const coverage = (w * h) / (innerWidth * vh);
		if (coverage >= 0.08) overlays.push({ selector: selectorOf(el), text: clean((el as HTMLElement).innerText, 100), coverage: Math.round(coverage * 100) / 100 });
	});

	const types: string[] = [];
	document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
		try {
			const data: unknown = JSON.parse(s.textContent ?? '');
			const items = Array.isArray(data) ? data : [data];
			for (const item of items) {
				if (item && typeof item === 'object') {
					const t = (item as Record<string, unknown>)['@type'];
					if (typeof t === 'string') types.push(t);
					else if (Array.isArray(t)) types.push(...t.filter((x): x is string => typeof x === 'string'));
				}
			}
		} catch {
			types.push('(invalid JSON-LD)');
		}
	});

	const w = window as unknown as Record<string, unknown>;
	return {
		title: clean(document.title, 200),
		description: clean(document.querySelector('meta[name="description"]')?.getAttribute('content'), 300),
		lang: document.documentElement.lang,
		h1: Array.from(document.querySelectorAll('h1')).filter(visible).map((h) => clean((h as HTMLElement).innerText, 200)),
		first_screen_text: firstScreen.join(' ').split(' ').slice(0, 120).join(' '),
		elements,
		forms,
		tel_links: Array.from(document.querySelectorAll('a[href^="tel:"]')).map((a) => a.getAttribute('href') ?? ''),
		overlays,
		horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1,
		page_height_screens: Math.round((document.documentElement.scrollHeight / vh) * 10) / 10,
		structured_data_types: [...new Set(types)],
		globals: ['gtag', 'dataLayer', 'fbq', 'ttq', 'posthog', 'hj', 'clarity', 'analytics', 'plausible'].filter((g) => w[g] !== undefined),
	};
}
