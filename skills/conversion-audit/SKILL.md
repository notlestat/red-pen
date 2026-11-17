---
name: conversion-audit
description: Red Pen. Audit a live website, landing page or funnel that already exists and say exactly what to change so more of the right people say yes. Walks every step from the ad or search result to the thank-you page on a phone and on desktop, scores each step on eight lenses (match, clarity, hook, desire, offer, trust, friction, action), checks the technical floor (speed, broken forms, tracking, accessibility), finds the one bottleneck, ranks fixes by impact and effort, rewrites the weak copy, and writes a test plan and a client-ready report. Use for "run Red Pen", a CRO audit, conversion audit, funnel audit, landing page review, "why isn't this page converting", "audit my website", "review this funnel", sizing up a prospect's site before a pitch, or re-auditing after fixes. For building a new funnel use funnel-first; for technical SEO use site-audit.
---

# Conversion audit (Red Pen)

Red Pen is this tool's name in reports and conversation. When the user says "run Red Pen on" a site, run this skill.

A page converts when the right visitor, arriving with a promise in their head, finds that promise on the first screen, believes it, wants what is offered, and can say yes without effort. Every audit question in this skill is a version of: where in that chain does this page lose people, and what is the cheapest change that wins them back?

This skill is a complete method on its own. When other skills are installed it hands depth to them (listed in each phase), but it never needs them to finish.

An expert review finds likely problems and fixes the obvious ones. Only traffic proves that a change worked. Say so in every report, and never promise a conversion lift.

## Modes

Ask for nothing the user already gave. Pick the mode from the request.

| Mode | When | Covers | Output |
|---|---|---|---|
| `quick` | A prospect, a first look, "what's wrong with this page" | The landing page's first screen and the top five fixes | A short report and one fix-first item |
| `full` | An owner or client audit | Every step from the traffic source to the thank-you page and follow-up | The full report, rewrites and a test plan |
| `re-audit` | After fixes shipped | The same steps as a saved audit | What changed, score by score |

**Whose site.** For the user's own or a client's site, ask for data access (analytics, recordings, form and call logs). For a prospect's site, use public evidence only. Never submit their forms, never create accounts, never try to get past a bot check, and never save their details into brand files. A prospect audit can feed `pitch-the-fix`. Nothing is sent without the user's approval.

## Phase 1. Intake

Write these down before looking at the page. Missing facts stay `UNKNOWN` and become questions for the owner. Never guess them.

| Field | Question |
|---|---|
| `url` | Which page do visitors actually land on? The ad's final URL beats "the homepage". |
| `goal` | What is the one yes: a call, a booking, an email, a purchase, a signup? |
| `traffic` | Where do visitors come from (paid social, search ads, organic, email, referral, Google profile), and what share is on phones? |
| `promise` | What did they read before the click? The ad text, the search snippet, the email subject, word for word. |
| `customer` | Who is the dream customer, and what stage of awareness are they at (unaware, problem-aware, solution-aware, product-aware, most aware)? |
| `doubt` | What belief stops them buying? |
| `numbers` | Visitors, conversion rate and lead quality per step, if any exist. |
| `tried` | What has already been changed or tested? |

Free sources for the promise: the user's ad account, Google's Ads Transparency Center, Meta's Ad Library viewed by a person in a browser, and the search result itself. Read Meta's Ad Library by hand; never scrape it.

**Customer words.** In `full` mode, collect what customers actually say before judging the page, because the best headline is usually a phrase a customer already wrote. Read the business's reviews, one or two threads where its buyers talk (Reddit, forums, YouTube comments), and the one-star reviews of its rivals, which hold the reasons people switch. Save each quote word for word with its URL and an ID: `VOC-P` for pains, `VOC-D` desires, `VOC-O` objections, `VOC-S` switching triggers, `VOC-V` repeated phrases. If a voice-of-customer file already exists, read it instead. The Desire lens and the rewrites cite these IDs.

## Phase 2. Capture the funnel

Walk it like a visitor, step by step: source, landing page, every question or form screen, thank-you page, confirmation email, and the second offer if there is one. Capture each step at 390 by 664 (a phone inside its browser bars) and at 1440 wide, first screen and full page. Wait three seconds before each capture, because popups, chat widgets and cookie banners load late and visitors see them too.

Use the best route available, and say in the report which one the audit rests on.

1. **The `conversion-audit` MCP server** from this skill's repo, if connected: `capture_page` saves the phone and desktop screenshots and returns the page facts, including a selector and box for every heading, button, link and field. Store a finding's selector and box in `audit.json` so `annotate_screen` can number it on the screenshot and a coding agent knows which element to change. Save the finished record through `save_audit`, which refuses a record that breaks the evidence rules.
2. **The conversion-system scanner**, if the repo is installed: `npm run scan -- <url>` returns tokens, the first ask, headline type, block sequence, forms, proof, builder and tracking for each page; `npm run extract -- <url>` returns the design system. These are code, not AI, so they cost nothing per page.
3. **Playwright**: `npx playwright screenshot --viewport-size "390,664" --wait-for-timeout 3000 <url> step-01-phone.png`, then again with `--full-page`, then at `1440,900`.
4. **A browser tool** (agent-browser, chrome-devtools): set the viewport, load, wait, capture, then read the accessibility snapshot for headings, links, buttons and form fields.
5. **HTML only**: fetch the page and read it in order. Say that popups and JavaScript-built content could not be seen.

Then collect the technical facts:

- Speed: PageSpeed Insights (pagespeed.web.dev, mobile tab) for LCP, INP and CLS, and the byte weight of the hero image.
- Tracking: which analytics, pixel and tag manager scripts load, and whether the conversion itself fires an event. On the owner's site, submit a test lead and check it arrives. On a prospect's site, only read the page source.
- Forms: number of fields, required fields, input types (`tel`, `email`), labels, error messages.
- Links: the main buttons and the links from ads and the Google profile resolve without a 404 or a redirect chain.

Look at every screenshot before writing about it. Labels from a scan are heuristics from one page load.

**Behaviour evidence** (owner or client sites with traffic). Screenshots show what the page offers. Session replays show what visitors did with it. If the Orion MCP server is connected (`orion`, from Paradigm Machines) and the site sends it replays, load [references/orion.md](references/orion.md). It maps Orion's tools to each phase. In short:

1. `describe_data` once, then `list_sites`. With no site yet, `add_site` gives the owner a one-line tag, and `check_site` confirms visits arrive.
2. `get_overview`, `list_pages` and `get_breakdown` give visits and friction per page, device and source for the funnel math.
3. `get_page_attention` on the landing page gives each element's share of the predicted gaze and how far down visits got. Use it to confirm or challenge lens scores.
4. `get_recommendations` gives Orion's own ranked problems. Treat each as a lead and check it on the screenshot and in the replay before it becomes a finding.
5. `get_gaze_snapshot` saves the moment an element held the most gaze into `screens/`, to cite.
6. `compare` with two date ranges or a URL parameter gives the before and after for the re-audit.

Clicks, rage clicks, dead clicks, errors and scroll depth are recorded events: evidence kind `recordings`, status OBSERVATION. Gaze, dwell and the friction score are model predictions: evidence kind `predicted-attention`, status INFERENCE, never "where visitors looked". Gaze on phones rests on scrolls and taps alone, so give phone-heavy findings less weight and say how many of the visits were desktop. Use Orion only with the owner's agreement, because it processes their visitors' replays and typing rhythm. Never call its delete tools unless the user asks. On a prospect's site Orion is not available, and the audit runs on screenshots alone. Without Orion, the same tier comes from any replay or heatmap tool the owner already has, recorded as evidence kind `recordings`.

**Benchmark** (`full` mode). Capture the first phone screen of the three rivals the visitor most likely compares against: the other ads on the same search, or the top three in the map pack for a local business. Note each one's promise, offer, price and proof. Two things come out of it: the promises every rival already makes (a headline that repeats them reads as noise), and the gaps none of them fill. Benchmarks are observations of what rivals do, not evidence of what converts.

## Phase 3. Score every step

Load [references/rubric.md](references/rubric.md). It holds the eight lenses, what scores 0 to 3 on each, and the checks for each.

The lenses follow the order a visitor thinks in:

| # | Lens | The visitor's question |
|---|---|---|
| 1 | Match | Did I land where I meant to? |
| 2 | Clarity | What is this, who is it for, and what do I do here? |
| 3 | Hook | Why should I keep reading? |
| 4 | Desire | Do I want this, and is it for someone like me? |
| 5 | Offer | What do I get for what I give, and is it worth it now? |
| 6 | Trust | Can I believe it, and what if it goes wrong? |
| 7 | Friction | How much effort is this? |
| 8 | Action | What exactly do I do next, and what happens after? |

Score each lens on each step. Every score cites what the screenshot or page shows, quoted or pointed at. A score you could not see is `UNKNOWN`, not a guess.

Then run the technical floor in the same file: pass or fail checks for speed, broken elements, tracking, accessibility and the phone layout. A floor failure on a high-traffic step usually outranks every copy change.

Then map the sections. List every section of the landing page in order, and write the one visitor question each section answers. A skeptic asks in this order: what is this, is it for me, does it work, what's the catch, what now. Mark sections that answer nothing, answer two questions, or answer out of order. Apply the deletion test: if removing a section does not break the argument, it should go. Pages fail from too many sections more often than from too few.

Then load [references/page-types.md](references/page-types.md) and apply the module for this page: lead-generation funnel, local service, ecommerce, SaaS, sales page, or agency and portfolio site.

## Phase 4. Find the bottleneck

One weak lens on one step loses most of the yeses. Find it before listing fixes.

**Check the page job first.** A page that fails is often the wrong kind of page for its traffic: a nine-section sales page for people who clicked "free checklist", a "book a call" page for cold social traffic, one homepage for three different ad promises. The keep-and-cut table in `page-types.md` gives the page job for each kind of traffic. A wrong page job outranks every section-level fix, so report it first.

**Then check that the page is the problem.** With numbers, walk the funnel: visitors, then leads, then customers. Compare each stage with what is normal for it and name the stage that leaks worst against normal, not the smallest number.

| Worst leak | What it means | Where the fix lives |
|---|---|---|
| Few visitors | A traffic problem | SEO, ads or distribution, not this audit |
| Visitors to leads | A conversion problem | This audit |
| Leads to customers | An offer, sales or follow-up problem | The offer, the price, the sales call, the follow-up emails |
| Leads to customers, phone-led business | Often missed calls and slow callbacks that look like weak leads | The call log, before the offer |

When the leak is not on the page, say so plainly and hand off. An honest "the page is not your problem" is worth more than a list of page tweaks.

**Then find the weakest lens.**

- **With numbers**: the weakest lens on the step with the worst leak.
- **Without numbers**: the weakest lens on the step that the most visitors see, usually the landing page's first screen.

Write it as one sentence: "Most visitors leave at [step] because [lens finding], shown by [evidence]." Brunson's rule applies: when a step fails, its hook, story or offer is wrong. Fix that one, not the whole page.

## Phase 5. Prioritise

Load [references/prioritise.md](references/prioritise.md). Put every finding in one bucket:

- **Fix now.** Broken, missing or plainly wrong: a dead button, a 404 from an ad, no phone number, the ad's promise missing. No test needed.
- **Instrument.** The conversion is not measured, or not measured correctly. Fix tracking before anything else is judged.
- **Test.** A real improvement that could go either way. It becomes a hypothesis.
- **Investigate.** The audit cannot settle it without user words, recordings or numbers.

Score Fix now and Test items with the priority score in that file. Keep the final list to five to seven items. Name one **fix first**: the change that wins the most yeses per hour of work, with the reason in one sentence.

## Phase 6. Rewrite and redesign

Words are the cheapest change with the largest effect. For each top item that involves copy, write the replacement, not advice about it:

- Three headline options: one result-led, one curiosity-led, one in the visitor's own doubt.
- The subheadline, the primary button text, and the line under the button.
- The doubt, answered in the owner's facts, and the section it belongs in.
- The offer stack, with each item marked `confirmed` or `ask-owner`.
- Form changes: which fields to cut, reorder or make optional.

Use the customer's own words from reviews, sales calls and support emails wherever they exist, and cite the `VOC` ID or source for each phrase.

**The claim gate.** Every claim in the rewritten copy traces to a fact the business has today: a number, a review, a policy, a feature. Keep facts exact. "Most jobs" never becomes "every job", and a 4.8 stays a 4.8. Never invent a number, a testimonial, a client logo, a deadline, a method or a guarantee. When the strongest copy needs something that is not true yet, write the copy from the facts, then add a **To make this true** list: the idea, the line it would unlock, and what it takes (a new policy, a number to check, the owner's sign-off). This keeps bold ideas in the report without putting false claims on the page.

**Fix the ad, not the page,** when the business cannot keep the ad's promise. If the ad says "24/7" and nobody answers at 2am, changing the page to match makes things worse.

For structure, describe the fixed first screen and the section order as a wireframe list. If the owner wants the page rebuilt and the conversion system is installed, hand the strategy to `funnel-first` and its `brunson-pass`.

Depth when installed: `brunson-pass` for hook, story and offer on every step, `offers` for the value equation and guarantees, `marketing-psychology` for the mental model behind a finding, `copy-editing` and `unslop` for the final words.

## Phase 7. Measure

Write the test plan from [references/prioritise.md](references/prioritise.md): for each Test item, the hypothesis, the primary metric, a quality guardrail, the sample needed and a stop date.

Be honest about traffic. Detecting a 20% relative lift on a 3% conversion rate takes roughly 14,000 visitors per variant. Below that, ship the Fix now items, compare before and after with the date of each change logged, and label the result as an observation, not a proven win.

Report small numbers by direction, not decimals. Say "roughly double" or "about the same", never "+23.7%" on two-digit counts. Compare counts of conversions, not rates: a gap built on 8 against 6 conversions is no gap. The honest verdicts are *clear win*, *leaning*, and *can't tell yet*, with the sample that would tell.

Depth when installed: `analytics` for the tracking plan, `ab-testing` for test design, `attribution` when numbers disagree across tools.

## Phase 8. Report

Load [references/report.md](references/report.md) and follow its template. Save:

```
audits/<site-slug>-<YYYY-MM-DD>/
  report.md          the report for the owner
  audit.json         the structured record (shape in assets/audit.template.json)
  screens/           every capture, named step-NN-<device>[-full].png
```

Write the report for the owner in plain words, screenshot first. It leads with the bottleneck and the fix first, then the ranked list, the rewrites, the test plan, the owner's questions, and a short sources-and-limits section. A re-audit reads the previous `audit.json` and reports the change on every lens.

Apply the `unslop` skill to the report before handing it over, if it is installed.

## Evidence rules

- Keep FACT, OBSERVATION, INFERENCE, HYPOTHESIS and UNKNOWN apart. A screenshot is an observation. "This headline is why they leave" is a hypothesis until data supports it.
- Tag every finding with its evidence basis, weakest to strongest: `heuristic` review, `technical` check, `predicted-attention` (a gaze model such as Orion), `analytics`, `recordings` or heatmaps, `customer-words`, a controlled `test`. A finding backed by two kinds of evidence outranks a finding backed by one. A finding that rests on predicted attention alone stays an INFERENCE.
- A vendor's benchmark, a template and a competitor's page are claims or observations, not proof that a pattern converts.
- Never recommend dark patterns: fake scarcity, fake countdowns, confirmshaming, hidden costs, pre-ticked boxes, fake reviews. They are against the law in many markets (the US FTC rule on fake reviews, the UK DMCC Act 2024), and they raise refunds and complaints.
- Accessibility failures are conversion failures. A button a keyboard cannot reach, or text that fails contrast, loses real buyers.
- The audit is a recommendation. The owner decides what ships.

## Hand-offs

[references/handoffs.md](references/handoffs.md) maps each kind of finding to the installed skill that goes deeper on it, by phase and by page type. Load a skill when a finding calls for it, not by default.
