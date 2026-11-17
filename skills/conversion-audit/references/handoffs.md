# Hand-offs

This skill finishes an audit on its own. When another skill is installed, it goes deeper on one kind of finding. Load the skill when the finding calls for it, not by default. Skills from the Boring Marketing plugin are called as `boring-marketing:<name>`.

## By phase

| Phase | Situation | Load | What it adds |
|---|---|---|---|
| Intake | `full` mode and no customer words on file | `boring-marketing:audience-research`, `customer-research` | A voice-of-customer bank: pains, desires, objections, switching triggers and exact phrases, each with a source and an ID |
| Intake | No positioning on file | `product-marketing`, `boring-marketing:positioning-angles` | What is sold, to whom, and the angle. Its "Not yet true" list keeps unproven claims off the page |
| Capture | A funnel built on a page builder, or a niche to compare | `funnel-first` (scanner) | Code-only scans: first ask, headline type, block sequence, forms, proof, tracking |
| Capture | Local service page | `boring-marketing:first-screen-check` | The eight phone checks and `page_facts.py` for HTML-only facts |
| Capture | Owner or client site with traffic, Orion connected | `orion` MCP server (Paradigm Machines); tool map in `orion.md` | Recorded clicks, rage and dead clicks and scroll depth (OBSERVATION), predicted gaze per element and friction per visit (INFERENCE), Orion's own ranked recommendations as leads, gaze snapshots, and before-and-after comparisons |
| Capture | Any audit, with the `conversion-audit` MCP server in this repo connected | `capture_page`, `annotate_screen`, `save_audit`, `compare_audits` | Screenshots and page facts with element selectors, numbered finding boxes on screenshots, a checked `audit.json`, and re-audit deltas |
| Benchmark | Rivals to compare | `boring-marketing:competitive-intel` | Rivals' promises, prices, offers and ads. Shows which promises are saturated in the niche |
| Score | Copy reads weak and you need to say why | `boring-marketing:direct-response-copy` | Its seven copy dimensions and calibration anchors, so copy scores do not drift toward flattery |
| Score | Sections in the wrong order, or too many | `boring-marketing:landing-page` (teardown) | Page job by traffic, keep and cut per page job, one job per section |
| Score | Hook, story or offer weak on a funnel step | `brunson-pass` | Hook, story and offer for every step, curiosity headlines, the doubt and the offer stack |
| Score | Explaining why a finding costs yeses | `marketing-psychology` | The mental model behind it (see the table in `rubric.md`) |
| Score | Form or signup friction | `cro` (`references/form.md`), `signup` | Field-by-field rules, multi-step forms, errors |
| Score | Popup, banner or chat widget | `popups` | Trigger timing, frequency, mobile rules |
| Score | Visual hierarchy, spacing, phone layout | `better-interface`, `improve-ui`, `baseline-ui`, `viewports` | A ranked UI review and fixes at real breakpoints |
| Score | Keyboard, labels, contrast | `better-accessibility`, `fixing-accessibility` | WCAG 2.2 fixes |
| Score | Share previews for social traffic | `fixing-metadata` | Open Graph and title fixes, because a broken preview loses the click before the page |
| Bottleneck | Real numbers exist | `boring-marketing:performance-review` | Funnel math (sessions to leads to sales), small-sample honesty, one bottleneck |
| Bottleneck | Leads arrive but few become customers, phone-led business | `boring-marketing:speed-to-lead` | Missed calls, callback times and form reply times from the business's own logs |
| Bottleneck | The page converts but traffic is thin or wrong | `boring-marketing:site-audit`, `boring-marketing:keyword-research`, `boring-marketing:paid-ads` | Not a conversion problem. Hand off and say so |
| Rewrite | Writing replacement copy | `boring-marketing:direct-response-copy`, `copy-editing` | Customer-words-first copy and the claim gate |
| Rewrite | Offer is weak | `offers` (`value-equation.md`, `guarantee-design.md`, `scarcity-urgency.md`, `bonus-stacking.md`) | The value equation, eight guarantee types, honest scarcity formats |
| Rewrite | Pricing page or price framing | `pricing` | Packaging, anchors, value metric |
| Rewrite | The ad breaks the promise, not the page | `ad-creative` | New ad copy that matches what the business can keep |
| Rewrite | Thank-you page and follow-up | `boring-marketing:email-sequences`, `referrals` | The confirmation and nurture emails, the second yes |
| Rewrite | Final words | `unslop`, `boring-marketing:brand-voice` | No AI tells, and the brand's own voice |
| Measure | Tracking missing or wrong | `analytics`, `boring-marketing:google-ads-tracking` | Event plan, and an ads account that counts real calls and forms |
| Measure | Ads may take credit for leads that would come anyway | `boring-marketing:ads-incrementality-check` | A planned pause read against the business's own log |
| Measure | Designing a test | `ab-testing` | Sample size, test templates |
| Measure | Numbers disagree across tools | `attribution` | Which number to trust |
| Report | A prospect audit becomes a pitch | `boring-marketing:pitch-the-fix`, `cold-email` | One problem, the evidence and one fix in a short email. Nothing is sent without approval |
| Report | Local business with more than a page problem | `boring-marketing:google-business-profile`, `boring-marketing:reviews` | The Google profile and the review flow against the top three in the map pack |

## By page type

| Page type | Skills |
|---|---|
| Lead-generation funnel | `funnel-first`, `brunson-pass`, `boring-marketing:lead-magnet`, `boring-marketing:landing-page` |
| Local service | `boring-marketing:first-screen-check`, `boring-marketing:speed-to-lead`, `boring-marketing:google-business-profile`, `boring-marketing:reviews` |
| Ecommerce | `cro`, `offers`, `popups`, `boring-marketing:email-sequences` (abandoned cart) |
| SaaS | `signup`, `onboarding`, `pricing`, `paywalls` |
| Sales page | `offers`, `brunson-pass`, `boring-marketing:direct-response-copy` |
| Agency and portfolio | `boring-marketing:positioning-angles`, `offers`, `design-engineering` for changes to the look |

## Finding prospects to audit

For agencies: `prospecting` or `boring-marketing:find-local-clients` builds a ranked list, `conversion-audit` in `quick` mode checks each site, and `boring-marketing:pitch-the-fix` turns the top finding into one email for review.
