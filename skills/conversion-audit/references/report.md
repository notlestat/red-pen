# Report

Write for the owner, not for a marketer. Plain words, the screenshot first, the most important thing at the top. A `quick` audit uses the header, the bottleneck, fix first, the top-fixes table and sources. A `full` audit uses every section.

Aim for a report the owner can act on the same day. Five to seven fixes. Say each thing once.

## Template

```markdown
# Red Pen audit: <site or page>

<date> · <mode> · <pages and steps covered> · <devices>
Evidence: <screenshots / HTML only> · <analytics: yes or no> · <recordings: yes or no>

![First phone screen](screens/step-01-phone.png)

## The bottleneck

One or two sentences. Where most visitors are lost, which lens, and what shows it.
If the page is the wrong kind of page for its traffic, or the leak is not on the page
at all (traffic, follow-up, the offer), say that here first.

## Fix first

**<The change>.** What the visitor sees now (quote it or point at the screenshot), why
it costs yeses, the exact fix (the words or element to add or remove), and the effort.
One sentence on why this one goes first.

## Scorecard

| Step | Match | Clarity | Hook | Desire | Offer | Trust | Friction | Action | Total |
|---|---|---|---|---|---|---|---|---|---|
| 01 Ad → landing | 1 | 2 | 1 | 2 | 1 | 0 | 2 | 1 | 10/24 |
| 02 Form | n/a | 2 | n/a | n/a | 1 | 1 | 0 | 1 | 5/15 |

Audit score <n>/100. This sums the rubric and is not a predicted conversion rate.
Technical floor: <passes>/<checks>. Failures: <list>.

## Top fixes

| # | Fix | Lens | Step | Bucket | Evidence | Effort | Score |
|---|---|---|---|---|---|---|---|
| 1 | ... | match | 01 | fix-now | heuristic + technical | 1 h | 11 |

Then one short paragraph per fix, in the same order: see, why, fix.

## Rewrites

Headline options:
1. Result-led: "..."
2. Curiosity-led: "..."
3. The visitor's doubt: "..."

Subheadline: "..."
Button: "..."  Under the button: "..."
The doubt, answered: "..." (belongs in the <section> section)
Offer stack: item (confirmed) · item (ask-owner)
Form: keep <fields>, cut <fields>, make <field> optional.

Where each phrase came from: <VOC IDs, review, sales call, site, ad>.

## To make this true

| Idea | The line it unlocks | What it takes |
|---|---|---|
| ... | "..." | A policy, a number to check, your sign-off |

## How you compare

Three rivals' first screens: their promise, offer and proof. Which promises everyone
makes, and the gap none of them fills.

## Proposed first screen

1. <element>
2. <element>
3. <element>

## Test plan

| Hypothesis | Primary metric | Guardrail | Sample per variant | Stop |
|---|---|---|---|---|

<Say plainly whether the traffic supports testing, and what to do if not.>

## Questions for you

Short, answerable questions: offer terms, proof with permission, numbers, who answers leads.

## Sources and limits

At most ten lines. What the audit rests on (pages, date, device, screenshot or HTML),
what could not be checked (forms on a prospect site, logged-in steps, follow-up speed),
and what the owner should confirm. Nothing here is a measured conversion result.
```

## Rules for the writing

- Name what the visitor sees, then why it costs yeses, then the fix. In that order.
- A fix is a change someone can make today: the words, the field, the element, the position. "Improve trust signals" is not a fix.
- Quote the page exactly, and point to the screenshot file.
- No invented numbers. No "this will increase conversions by 30%". Say "likely to help because..." and name the evidence.
- Sentence-case headings, no emoji, no hype.
- Apply `unslop` when installed.

## Prospect version

For a prospect, the report is the evidence behind one pitch, not a document to send. Keep it in `audits/`. Pick the one fix that passes these tests, then hand to `pitch-the-fix` when installed:

1. The owner can see it in ten seconds on their own phone.
2. It loses customers in a way the owner would agree with.
3. It can be fixed in days.
4. Its effect can be seen within about a month in a number the owner already trusts.

Nothing is sent without the user's approval.
