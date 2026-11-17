# Prioritise and test

## Buckets

Every finding goes in one bucket. The buckets come from CXL's ResearchXL process, simplified.

| Bucket | Put a finding here when | What happens |
|---|---|---|
| `fix-now` | Something is broken, missing or plainly wrong, and the fix carries no real risk | Ship it. No test |
| `instrument` | The conversion or a step is not measured, or measured wrongly | Fix tracking first, because nothing else can be judged without it |
| `test` | A real improvement that could go either way | Write a hypothesis and test it if traffic allows |
| `investigate` | The audit cannot settle it without customer words, recordings or numbers | Name the research that would settle it |

Examples of `fix-now`: an ad landing on a 404, no phone number on a local service page, the ad's promise missing from the first screen, a broken form, text failing contrast, a cookie banner covering the button, a required field nobody needs. Examples of `test`: a new headline, a quiz in place of a form, a different offer, moving the price up the page.

## Priority score

Score every `fix-now` and `test` finding. It is adapted from CXL's PXL model, which uses yes-or-no questions instead of gut-feel 1 to 10 ratings, because yes or no is harder to fudge.

| Question | Yes | No |
|---|---|---|
| Is it on the step that most visitors see? | 2 | 0 |
| Is it on the first phone screen? | 1 | 0 |
| Would a visitor notice the change within 5 seconds? | 2 | 0 |
| Does it touch the bottleneck lens from Phase 4? | 2 | 0 |
| Does it add or remove an element, rather than restyle one? | 1 | 0 |
| Is it backed by evidence beyond heuristic review? One point per extra kind (technical, analytics, recordings, customer words), up to 2 | 0 to 2 | |
| Effort: under an hour = 3, under a day = 2, under a week = 1, more = 0 | 0 to 3 | |

The maximum is 13. Sort by score. On a tie, the cheaper fix goes first.

Weight by money. A fault on the page every paid click lands on outranks the same fault on the About page. Move a finding up and say why when the business argues for it, such as a legal risk or a fault customers complain about.

Keep the final list to five to seven items. A longer list gets nothing fixed. Put the rest in an appendix.

## Fix first

One item, from the top of the list. Choose the change that wins the most yeses per hour of work, usually a `fix-now` item on the landing page's first screen. State the reason in one sentence.

## Test plan

For each `test` item:

```
hypothesis:  Because [evidence], changing [element] to [new version] for [audience]
             will increase [primary metric], shown by [measure].
primary:     The one metric that decides it (qualified leads, bookings attended, revenue
             per visitor). Form completions are a diagnostic when lead quality matters.
guardrail:   A metric that must not get worse (lead quality, refund rate, show rate).
sample:      Visitors per variant needed, from baseline rate and minimum detectable effect.
stop:        A date or sample size fixed in advance. Never stop early on a good day.
```

### Rough sample sizes

Visitors per variant at 95% confidence and 80% power, two variants:

| Baseline conversion | To detect a 10% relative lift | 20% relative lift | 30% relative lift |
|---|---|---|---|
| 1% | about 160,000 | about 43,000 | about 20,000 |
| 3% | about 53,000 | about 14,000 | about 6,500 |
| 5% | about 31,000 | about 8,200 | about 3,800 |
| 10% | about 15,000 | about 3,800 | about 1,700 |

Use a calculator (`ab-testing` has one in its references) for exact numbers.

### When traffic is too low to test

Most small sites cannot reach these numbers in a month. Then:

1. Ship the `fix-now` items. They are not bets.
2. Ship the strongest `test` items one at a time, logging the date of each change.
3. Compare the same length of time before and after, and check for seasonality, campaign changes and outages in that window.
4. Label the result an observation, not a proven win, and say so in the report.
5. Use qualitative checks instead: a five-second test with five people from the target audience, or watching five session recordings.

## Re-audit

Read the previous `audit.json`. Score the same steps with the same rubric. Report each lens as before → after, the fixes that shipped, and the conversion numbers before and after with dates. A higher audit score is not a higher conversion rate; report both and keep them apart.
