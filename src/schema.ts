// The audit record (audit.json). The skill describes these rules in words; this file
// enforces them. Field names are the contract: add fields, never rename them.
import { z } from 'zod';

export const SCHEMA = 'conversion-audit/1';

export const lenses = ['match', 'clarity', 'hook', 'desire', 'offer', 'trust', 'friction', 'action'] as const;
export type Lens = (typeof lenses)[number];

export const evidenceKinds = [
	'heuristic',
	'technical',
	'predicted-attention',
	'analytics',
	'recordings',
	'customer-words',
	'test',
] as const;
export type EvidenceKind = (typeof evidenceKinds)[number];

// Evidence that cannot make a finding a FACT on its own.
const weakEvidence: ReadonlySet<EvidenceKind> = new Set(['heuristic', 'predicted-attention']);

export const floorChecks = [
	'loads_on_phone',
	'core_web_vitals',
	'primary_action_works',
	'links_resolve',
	'conversion_tracked',
	'tap_to_call',
	'contrast',
	'keyboard',
	'labels',
	'nothing_covers_action',
	'honest_data',
	'https',
] as const;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase letters, numbers and single hyphens');
const stepId = z.string().regex(/^\d{2}$/, 'two digits, like "01"');
const findingId = z.string().regex(/^F\d+$/, 'F followed by a number, like "F1"');
const relPath = z.string().min(1);

const lensScore = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal('UNKNOWN'), z.literal('n/a')]);
export type LensScore = z.infer<typeof lensScore>;

const status = z.enum(['FACT', 'OBSERVATION', 'INFERENCE', 'HYPOTHESIS', 'UNKNOWN']);
const device = z.enum(['phone', 'desktop']);

export const boxSchema = z.object({
	x: z.number().min(0),
	y: z.number().min(0),
	width: z.number().positive(),
	height: z.number().positive(),
});
export type Box = z.infer<typeof boxSchema>;

const elementSchema = z.object({
	selector: z.string().min(1),
	box: boxSchema,
	device,
});

const effort = z.enum(['hour', 'day', 'week', 'more']);

// The yes-or-no priority questions from references/prioritise.md. The server computes the score.
const prioritySchema = z.object({
	most_traffic: z.boolean(),
	first_screen: z.boolean(),
	noticeable: z.boolean(),
	bottleneck: z.boolean(),
	adds_or_removes: z.boolean(),
	extra_evidence: z.union([z.literal(0), z.literal(1), z.literal(2)]),
	effort,
});
export type Priority = z.infer<typeof prioritySchema>;

const findingSchema = z.object({
	id: findingId,
	lens: z.union([z.enum(lenses), z.literal('floor')]),
	step: stepId,
	see: z.string().min(1),
	screen: relPath,
	why: z.string().min(1),
	fix: z.string().min(1),
	evidence: z.array(z.enum(evidenceKinds)).min(1),
	bucket: z.enum(['fix-now', 'instrument', 'test', 'investigate']),
	status,
	priority: prioritySchema.optional(),
	score: z.number().optional(),
	element: elementSchema.optional(),
});
export type Finding = z.infer<typeof findingSchema>;

const stepSchema = z.object({
	id: stepId,
	name: z.string().min(1),
	url: z.string().url().optional(),
	screens: z.array(relPath),
	scores: z.object(Object.fromEntries(lenses.map((l) => [l, lensScore])) as Record<Lens, typeof lensScore>),
});
export type Step = z.infer<typeof stepSchema>;

const floorValue = z.enum(['pass', 'fail', 'unknown']);

export const auditSchema = z.object({
	schema: z.literal(SCHEMA),
	site: z.string().min(1),
	slug,
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	mode: z.enum(['quick', 'full', 're-audit']),
	owner: z.enum(['own', 'client', 'prospect']),
	intake: z.object({
		url: z.string().url(),
		goal: z.string(),
		traffic: z.string(),
		promise: z.string(),
		customer: z.string(),
		doubt: z.string(),
		numbers: z.string(),
		tried: z.string(),
	}),
	evidence: z.object({
		capture: z.enum(['screenshots', 'html-only']),
		analytics: z.boolean(),
		recordings: z.boolean(),
		predicted_attention: z.boolean(),
		customer_words: z.array(z.string()),
	}),
	voc: z.array(z.object({ id: z.string().regex(/^VOC-[PDOSV]\d+$/), quote: z.string(), source: z.string(), date: z.string() })),
	benchmark: z.array(z.object({ rival: z.string(), promise: z.string(), offer: z.string(), proof: z.string(), screen: relPath.optional() })),
	page_job: z.object({ traffic: z.string(), job: z.string(), fits: z.boolean(), note: z.string() }),
	steps: z.array(stepSchema).min(1),
	sections: z.array(z.object({ order: z.number().int().positive(), name: z.string(), answers: z.string(), keep: z.boolean() })),
	floor: z.object(Object.fromEntries(floorChecks.map((c) => [c, floorValue])) as Record<(typeof floorChecks)[number], typeof floorValue>),
	bottleneck: z.string().min(1),
	findings: z.array(findingSchema),
	fix_first: findingId.nullable(),
	rewrites: z.object({
		headlines: z.array(z.string()),
		subheadline: z.string(),
		button: z.string(),
		under_button: z.string(),
		doubt_answer: z.string(),
		offer_stack: z.array(z.object({ item: z.string(), status: z.enum(['confirmed', 'ask-owner']) })),
		form: z.string(),
	}),
	to_make_true: z.array(z.object({ idea: z.string(), unlocks: z.string(), needs: z.string() })),
	tests: z.array(
		z.object({
			finding: findingId,
			hypothesis: z.string(),
			primary: z.string(),
			guardrail: z.string(),
			sample_per_variant: z.number().int().positive().nullable(),
			stop: z.string(),
		}),
	),
	questions: z.array(z.string()),
	limits: z.array(z.string()),
	// Written by save_audit. Anything the agent puts here is replaced.
	summary: z
		.object({
			audit_score: z.number().nullable(),
			steps: z.array(z.object({ id: stepId, score: z.number(), max: z.number(), unknown: z.number() })),
			floor: z.object({ pass: z.number(), fail: z.number(), unknown: z.number() }),
		})
		.optional(),
});
export type Audit = z.infer<typeof auditSchema>;

const effortPoints: Record<Priority['effort'], number> = { hour: 3, day: 2, week: 1, more: 0 };

// The priority score from references/prioritise.md. Maximum 13.
export function priorityScore(p: Priority): number {
	return (
		(p.most_traffic ? 2 : 0) +
		(p.first_screen ? 1 : 0) +
		(p.noticeable ? 2 : 0) +
		(p.bottleneck ? 2 : 0) +
		(p.adds_or_removes ? 1 : 0) +
		p.extra_evidence +
		effortPoints[p.effort]
	);
}

export function stepScore(step: Step) {
	let score = 0;
	let max = 0;
	let unknown = 0;
	for (const lens of lenses) {
		const value = step.scores[lens];
		if (value === 'UNKNOWN') unknown += 1;
		else if (value !== 'n/a') {
			score += value;
			max += 3;
		}
	}
	return { id: step.id, score, max, unknown };
}

export interface Problem {
	path: string;
	message: string;
}

// Rules a schema cannot express alone. `exists` answers whether a path inside the audit
// folder is a real file, so a score or finding cannot cite a screenshot that was never taken.
export function checkRules(audit: Audit, exists: (relative: string) => boolean): Problem[] {
	const problems: Problem[] = [];
	const add = (path: string, message: string) => problems.push({ path, message });

	const stepIds = new Set<string>();
	audit.steps.forEach((step, i) => {
		if (stepIds.has(step.id)) add(`steps[${i}].id`, `Step id ${step.id} is used twice.`);
		stepIds.add(step.id);
		const scored = lenses.some((l) => typeof step.scores[l] === 'number');
		if (scored && step.screens.length === 0) add(`steps[${i}].screens`, 'A step with scores needs at least one screenshot behind them.');
		step.screens.forEach((s, j) => {
			if (!exists(s)) add(`steps[${i}].screens[${j}]`, `No file at ${s} in the audit folder.`);
		});
	});

	const findingIds = new Set<string>();
	audit.findings.forEach((f, i) => {
		const at = `findings[${i}]`;
		if (findingIds.has(f.id)) add(`${at}.id`, `Finding id ${f.id} is used twice.`);
		findingIds.add(f.id);
		if (!stepIds.has(f.step)) add(`${at}.step`, `No step ${f.step}.`);
		if (!exists(f.screen)) add(`${at}.screen`, `No file at ${f.screen} in the audit folder.`);
		if ((f.bucket === 'fix-now' || f.bucket === 'test') && !f.priority)
			add(`${at}.priority`, 'Fix-now and test findings need the priority answers, so the server can score them.');
		if (f.status === 'FACT' && f.evidence.every((e) => weakEvidence.has(e)))
			add(`${at}.status`, 'A finding resting only on heuristic review or predicted attention cannot be a FACT. Use OBSERVATION, INFERENCE or HYPOTHESIS.');
		if (f.evidence.length === 1 && f.evidence[0] === 'predicted-attention' && f.status === 'OBSERVATION')
			add(`${at}.status`, 'Predicted attention is a model output. On its own it is an INFERENCE, not an observation.');
	});

	if (audit.fix_first !== null) {
		const first = audit.findings.find((f) => f.id === audit.fix_first);
		if (!first) add('fix_first', `No finding ${audit.fix_first}.`);
		else if (first.bucket !== 'fix-now' && first.bucket !== 'test') add('fix_first', 'Fix first must be a fix-now or test finding.');
	}

	audit.tests.forEach((t, i) => {
		const f = audit.findings.find((x) => x.id === t.finding);
		if (!f) add(`tests[${i}].finding`, `No finding ${t.finding}.`);
		else if (f.bucket !== 'test') add(`tests[${i}].finding`, `Finding ${t.finding} is in the ${f.bucket} bucket, not test.`);
	});

	if (audit.owner === 'prospect' && audit.evidence.predicted_attention)
		add('evidence.predicted_attention', 'A prospect audit cannot have replay evidence. Their site does not send you replays.');

	audit.benchmark.forEach((b, i) => {
		if (b.screen && !exists(b.screen)) add(`benchmark[${i}].screen`, `No file at ${b.screen} in the audit folder.`);
	});

	return problems;
}

// Fill in everything the server computes, and sort findings by priority score.
export function withComputed(audit: Audit): Audit {
	const findings = audit.findings
		.map((f) => (f.priority ? { ...f, score: priorityScore(f.priority) } : { ...f, score: undefined }))
		.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || effortRank(a) - effortRank(b));
	const steps = audit.steps.map(stepScore);
	const total = steps.reduce((sum, s) => sum + s.score, 0);
	const max = steps.reduce((sum, s) => sum + s.max, 0);
	const values = Object.values(audit.floor);
	return {
		...audit,
		findings,
		summary: {
			audit_score: max === 0 ? null : Math.round((total / max) * 100),
			steps,
			floor: {
				pass: values.filter((v) => v === 'pass').length,
				fail: values.filter((v) => v === 'fail').length,
				unknown: values.filter((v) => v === 'unknown').length,
			},
		},
	};
}

function effortRank(f: Finding) {
	return f.priority ? 3 - effortPoints[f.priority.effort] : 4;
}
