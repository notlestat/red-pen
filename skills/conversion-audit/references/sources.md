# Sources and how the method was chosen

Research done on 17 November 2026 to choose this skill's method. Each source is labelled with how it was checked. "Search" means confirmed from search results that day. "Known" means established background knowledge that was not re-checked that day. Re-check a "known" item before quoting it to a client.

## Frameworks compared

| Framework | What it is | Strength | Gap | Used here as |
|---|---|---|---|---|
| CXL ResearchXL | A conversion research process: heuristic review, technical checks, analytics, recordings, surveys and user tests, grouped into themes and turned into tests (search) | Ranks evidence. Heuristic review sits at the bottom because it rests on one or two reviewers and little data (search) | Needs data and time most small sites lack. Its authors call prioritisation its weakest part (search) | The evidence ladder, and the buckets in `prioritise.md` |
| CXL PXL | Test prioritisation with yes-or-no questions: above the fold, noticeable in five seconds, adds or removes an element, backed by data, ease (search). Sources disagree on the exact weights (search) | Harder to fudge than 1 to 10 scores | Built for teams already testing | The priority score, adapted |
| LIFT model | Chris Goward's six factors, 2009, WiderFunnel: value proposition, relevance, clarity, anxiety, distraction, urgency (search) | Simple and page-focused | No offer design, no funnel steps, no technical floor | Lenses 1, 2, 6, 7 and 8 |
| MECLABS conversion sequence | C = 4m + 3v + 2(i − f) − 2a: motivation, value proposition, incentive, friction, anxiety (known; verify weights against MECLABS before quoting) | Shows that motivation and value matter more than design detail | The weights are a heuristic, not a measurement | The lens order: who and what before polish |
| Brunson hook, story, offer | Every funnel step has a hook, a story and an offer. When a step fails, one of the three is wrong (known; in the `brunson-pass` skill) | Diagnoses one step at a time, ad to result | Not a page usability check | Lenses 3, 4 and 5, and the bottleneck rule |
| Hormozi value equation | Value rises with dream outcome and perceived likelihood, falls with time delay and effort (known; in the `offers` skill) | Turns a weak offer into specific changes | Says nothing about the page | Lens 5 |
| Schwartz awareness stages | Unaware, problem-aware, solution-aware, product-aware, most aware (known) | Explains why one page cannot serve every visitor | | Lens 1 |
| Baymard checkout research | Large-scale ecommerce usability research. 2024 checkout benchmark: average 11.3 form fields when most sites need about 8; field count affects usability more than step count (search) | Measured from usability testing | Ecommerce only, mostly behind a paywall | The ecommerce module |
| Local first-screen check | The `first-screen-check` skill: eight phone checks for local service pages, from a self-selected sample of local sites | Specific and fast | Local service only | The local service module |
| Google Core Web Vitals | Good thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (known) | Public, measurable | Speed is one lens of eight | The technical floor |
| WCAG 2.2 AA | Contrast 4.5:1 for body text, 3:1 for large text, keyboard access, labels (known) | A legal and usability floor | | The technical floor |

## Why one combined method

No single framework covers a whole audit. ResearchXL ranks evidence but assumes data. LIFT and MECLABS judge a page but not an offer or a funnel. Brunson diagnoses funnel steps but not usability or speed. Baymard covers checkout only.

This skill keeps the parts that do not overlap:

1. The visitor's question order from LIFT and MECLABS, extended with Brunson's hook and offer, gives eight lenses.
2. A pass-or-fail technical floor catches the problems that make copy irrelevant.
3. Brunson's rule finds one bottleneck instead of a long list.
4. ResearchXL's buckets and evidence ladder keep findings honest.
5. PXL's yes-or-no scoring ranks the fixes.
6. Page-type modules add what only applies to some pages.

## Installed skills the method draws on

Reviewed on 17 November 2026 from the Skills Room catalogue. Each idea below was folded into this skill in its own words, so the skill still works without them.

| Skill | Idea taken |
|---|---|
| `boring-marketing:landing-page` | Page job by traffic, keep and cut per job, one job per section, the deletion test |
| `boring-marketing:direct-response-copy` | Customer words first, the claim gate and the To make this true list, fix the ad when the business cannot keep its promise |
| `boring-marketing:performance-review` | Funnel math to find whether the leak is traffic, conversion or offer, and honest reporting of small samples |
| `boring-marketing:audience-research` | Voice-of-customer bank with IDs, rivals' one-star reviews as switching triggers |
| `boring-marketing:competitive-intel` | Benchmark three rivals and find saturated promises |
| `boring-marketing:speed-to-lead` | Missed calls and slow replies as the hidden lead-to-sale leak |
| `boring-marketing:first-screen-check` | The local phone checks and the ranking by lost calls |
| `brunson-pass`, `funnel-first` | Hook, story and offer per step, funnel types, the code-only scanner |
| `offers` | Guarantee types and honest scarcity formats |
| `marketing-psychology` | The models behind each lens |
| `cro` | Page-type frameworks and form rules |

## Legal limits on persuasion

- US: the FTC's rule banning fake reviews and testimonials took effect in October 2024 (known).
- UK: the Digital Markets, Competition and Consumers Act 2024 bans fake reviews and drip pricing, with consumer provisions in force from April 2025 (known).

Check the market the business sells in before recommending urgency, pricing display or review tactics.

## Links

- LIFT model: https://victorious.com/blog/lift-model-cro/ and https://umbrex.com/resources/frameworks/marketing-frameworks/lift-model-for-conversion-value-relevance-clarity-anxiety-distraction-urgency/
- ResearchXL and AI: https://cxl.com/blog/ai-cro-research/ (blocked to automated fetch on 17 November 2026; summarised from search results)
- PXL: https://cxl.com/blog/better-way-prioritize-ab-tests/ and https://www.growthmethod.com/pxl-framework/
- Baymard checkout fields: https://baymard.com/blog/checkout-flow-average-form-fields
- Baymard checkout research: https://baymard.com/research/checkout-usability
