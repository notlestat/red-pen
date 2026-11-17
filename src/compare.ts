// Re-audit: compare two audits of the same site, step by step and lens by lens.
// The audit score is a rubric sum. It is reported apart from real conversion numbers.
import { lenses, stepScore, type Audit, type LensScore } from './schema.ts';

export interface LensChange {
	lens: string;
	before: LensScore;
	after: LensScore;
	delta: number | null;
}

export function compareAudits(before: Audit, after: Audit) {
	const steps = after.steps.map((step) => {
		const old = before.steps.find((s) => s.id === step.id);
		if (!old) return { id: step.id, name: step.name, status: 'new' as const, changes: [] as LensChange[] };
		const changes = lenses.map((lens) => {
			const b = old.scores[lens];
			const a = step.scores[lens];
			return { lens, before: b, after: a, delta: typeof a === 'number' && typeof b === 'number' ? a - b : null };
		});
		const s0 = stepScore(old);
		const s1 = stepScore(step);
		return { id: step.id, name: step.name, status: 'compared' as const, before: `${s0.score}/${s0.max}`, after: `${s1.score}/${s1.max}`, changes };
	});
	const removed = before.steps.filter((s) => !after.steps.some((a) => a.id === s.id)).map((s) => s.id);

	const floor = Object.keys(after.floor)
		.map((check) => {
			const key = check as keyof Audit['floor'];
			return { check, before: before.floor[key], after: after.floor[key] };
		})
		.filter((f) => f.before !== f.after);

	const openBefore = new Set(before.findings.map((f) => f.id));
	const openAfter = new Set(after.findings.map((f) => f.id));
	return {
		sites: { before: `${before.site} ${before.date}`, after: `${after.site} ${after.date}` },
		audit_score: { before: before.summary?.audit_score ?? null, after: after.summary?.audit_score ?? null },
		steps,
		removed_steps: removed,
		floor_changes: floor,
		findings: {
			gone: [...openBefore].filter((id) => !openAfter.has(id)),
			new: [...openAfter].filter((id) => !openBefore.has(id)),
			still_open: [...openAfter].filter((id) => openBefore.has(id)),
		},
		note: 'A higher audit score is not a higher conversion rate. Report the conversion numbers for the same dates separately.',
	};
}
