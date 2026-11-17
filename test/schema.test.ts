import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditSchema, checkRules, priorityScore, withComputed, type Audit } from '../src/schema.ts';
import { compareAudits } from '../src/compare.ts';
import { fileExists, inside } from '../src/store.ts';
import { template, tempAuditDir } from './helpers.ts';

const screens = ['screens/step-01-phone.png', 'screens/step-01-phone-full.png', 'screens/step-01-desktop.png', 'screens/rival-01-phone.png'];

async function problemsFor(audit: Audit) {
	const dir = await tempAuditDir(screens);
	return checkRules(auditSchema.parse(audit), fileExists(dir)).map((p) => p.message);
}

test('the template matches the schema and passes the rules', async () => {
	const parsed = auditSchema.safeParse(template());
	assert.ok(parsed.success, JSON.stringify(!parsed.success && parsed.error.issues));
	assert.deepEqual(await problemsFor(template()), []);
});

test('a step with scores but no screenshot is refused', async () => {
	const a = template();
	a.steps[0].screens = [];
	a.findings = [];
	a.fix_first = null;
	assert.match((await problemsFor(a)).join(' '), /needs at least one screenshot/);
});

test('a screenshot path that is not a real file is refused', async () => {
	const a = template();
	a.findings[0].screen = 'screens/never-taken.png';
	assert.match((await problemsFor(a)).join(' '), /No file at screens\/never-taken.png/);
});

test('heuristic review alone cannot make a FACT', async () => {
	const a = template();
	a.findings[0].evidence = ['heuristic'];
	a.findings[0].status = 'FACT';
	assert.match((await problemsFor(a)).join(' '), /cannot be a FACT/);
});

test('predicted attention alone is an inference, not an observation', async () => {
	const a = template();
	a.findings[0].evidence = ['predicted-attention'];
	a.findings[0].status = 'OBSERVATION';
	assert.match((await problemsFor(a)).join(' '), /INFERENCE, not an observation/);
});

test('a prospect audit cannot claim replay evidence', async () => {
	const a = template();
	a.owner = 'prospect';
	a.evidence.predicted_attention = true;
	assert.match((await problemsFor(a)).join(' '), /prospect audit cannot have replay evidence/);
});

test('fix-now findings need the priority answers', async () => {
	const a = template();
	delete a.findings[0].priority;
	assert.match((await problemsFor(a)).join(' '), /need the priority answers/);
});

test('the server computes priority and the audit score, replacing what was supplied', () => {
	const a = template();
	a.findings[0].score = 99;
	const saved = withComputed(a);
	assert.equal(saved.findings[0].score, 11);
	assert.equal(priorityScore({ most_traffic: true, first_screen: true, noticeable: true, bottleneck: true, adds_or_removes: true, extra_evidence: 2, effort: 'hour' }), 13);
	// Template step scores 1+2+1+2+1+0+2+1 = 10 of 24.
	assert.deepEqual(saved.summary?.steps, [{ id: '01', score: 10, max: 24, unknown: 0 }]);
	assert.equal(saved.summary?.audit_score, 42);
});

test('UNKNOWN and n/a count toward neither score nor maximum', () => {
	const a = template();
	a.steps[0].scores.hook = 'UNKNOWN';
	a.steps[0].scores.desire = 'n/a';
	const s = withComputed(a).summary?.steps[0];
	assert.deepEqual(s, { id: '01', score: 7, max: 18, unknown: 1 });
});

test('paths cannot leave the audit folder', async () => {
	const dir = await tempAuditDir([]);
	assert.throws(() => inside(dir, '../outside.png'), /inside the audit folder/);
	assert.throws(() => inside(dir, '/etc/passwd'), /inside the audit folder/);
	assert.equal(fileExists(dir)('../../etc/passwd'), false);
});

test('compare reports lens deltas, floor changes and closed findings', () => {
	const before = withComputed(template());
	const after = template();
	after.date = '2026-12-17';
	after.steps[0].scores.match = 3;
	after.floor.conversion_tracked = 'pass';
	after.findings = [];
	after.fix_first = null;
	const diff = compareAudits(before, withComputed(after));
	const step = diff.steps[0];
	assert.equal(step.status, 'compared');
	assert.deepEqual(step.changes.find((c) => c.lens === 'match'), { lens: 'match', before: 1, after: 3, delta: 2 });
	assert.deepEqual(diff.floor_changes, [{ check: 'conversion_tracked', before: 'fail', after: 'pass' }]);
	assert.deepEqual(diff.findings.gone, ['F1']);
});
