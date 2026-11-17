<img src="assets/icon.svg" width="64" height="64" alt="">

# Red Pen

Red Pen audits websites, landing pages and funnels that already exist, and says what to change so more of the right visitors say yes. It covers conversion rate optimisation from the ad to the thank-you page. Each audit returns the page marked up: numbered boxes on the screenshots, rewritten copy and a ranked list of fixes.

Red Pen is the tool's name. Its skill and MCP server keep the technical name `conversion-audit`, because agents find a skill by matching words like "conversion audit" to its name and description.

It has two parts:

- **The `conversion-audit` skill** holds the method. An agent such as Claude Code or Codex reads it and does the judging.
- **The `conversion-audit` MCP server** captures the evidence and enforces the audit rules. It makes no AI calls and needs no API keys.

## Requirements

- Node.js 23.6 or later. The server runs TypeScript files directly.
- Google Chrome, for page capture and annotation.

## Set up

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Link the skill into your agent's skills folder:

   ```sh
   ln -s "$PWD/skills/conversion-audit" ~/.claude/skills/conversion-audit
   ln -s "$PWD/skills/conversion-audit" ~/.codex/skills/conversion-audit
   ```

3. Open this folder in Claude Code. `.mcp.json` registers two servers, and Claude Code asks before connecting to each:
   - `conversion-audit`, the local server in `mcp/server.ts`.
   - `orion`, an optional third-party server for session-replay evidence. See [Behaviour evidence from Orion](#behaviour-evidence-from-orion).

   For Codex, add the local server with `codex mcp add conversion-audit -- node "$PWD/mcp/server.ts"`.

4. Give your agent a page:

   > Run a conversion audit on https://example.com/offer. Traffic is Meta ads, mostly phones. The ad says "Free 15-minute roof check".

## What an audit does

1. Records the goal, the traffic, the ad's promise and the customer's main doubt. Missing facts become questions for the owner.
2. Walks every step of the funnel on a 390-pixel phone screen and on desktop, and saves screenshots.
3. Scores each step from 0 to 3 on eight lenses: match, clarity, hook, desire, offer, trust, friction and action.
4. Runs a pass-or-fail technical check: speed, broken forms, tracking, accessibility and links.
5. Finds the one step and lens that lose most visitors, or says the leak is not on the page.
6. Sorts every finding into fix now, instrument, test or investigate, and ranks the fixes by impact and effort.
7. Writes replacement headlines, buttons and form changes, plus a test plan sized to the site's traffic.
8. Saves a report for the owner and a structured record for re-audits.

The skill has three modes. `quick` covers the first screen and the top five fixes. `full` covers the whole funnel. `re-audit` compares a new audit with a saved one.

## MCP server tools

| Tool | What it does |
| --- | --- |
| `audit_overview` | Returns the lenses, evidence kinds, floor checks, priority questions and the rules `save_audit` enforces |
| `capture_page` | Takes phone and desktop screenshots of one step and returns page facts: headline, first-screen text, every heading, button, link and field with a CSS selector and box, forms and labels, `tel:` links, overlays, tracking scripts, image weight, and lab LCP and CLS |
| `save_audit` | Validates `audit.json`, refuses a record that breaks a rule, computes priority scores and the audit score, and sorts findings |
| `get_audit`, `list_audits` | Read saved audits |
| `annotate_screen` | Draws numbered finding boxes on a screenshot from the element boxes stored in `audit.json` |
| `compare_audits` | Compares two audits lens by lens for a re-audit |

`capture_page` is read-only. It never clicks, types or submits, and it stops at a bot check instead of bypassing it.

`save_audit` refuses a record when:

- a step has scores but no screenshot, or a cited screenshot is not a real file;
- a fix-now or test finding has no priority answers;
- a finding rests only on heuristic review or predicted attention and claims to be a FACT;
- predicted attention alone is labelled an OBSERVATION instead of an INFERENCE;
- a prospect audit claims replay evidence.

Audits are written to `audits/<slug>/` in the current folder: `audit.json`, `report.md`, `screens/` and `captures/`. Set `AUDITS_DIR` to write them somewhere else.

## Behaviour evidence from Orion

[Orion](https://app.paradigmmachines.ai/) from Paradigm Machines reads a site's session replays, through its own tag or from PostHog, and predicts where visitors looked with a model trained on eye-tracking data. Its MCP server gives an agent gaze time per element, friction scores per visit with the elements behind them, and frames with the gaze drawn on them.

The skill uses Orion for owner and client sites that have traffic. It records Orion's output as evidence kind `predicted-attention` with status INFERENCE, because Orion predicts gaze and does not track eyes. Orion processes visitors' replays and typing rhythm, so connect a site only with its owner's agreement. Prospect audits cannot use it.

To connect Orion, approve the `orion` server when Claude Code asks, or run `claude mcp add --scope user --transport http orion https://app.paradigmmachines.ai/mcp` and then `claude mcp login orion` in a terminal. Sign in with Google. Orion's pricing and accuracy figures were not published on its public pages on 17 November 2026.

`skills/conversion-audit/references/orion.md` maps Orion's tools, as listed on that date, to each audit phase.

## Where things live

| Path | Contents |
| --- | --- |
| `skills/conversion-audit/SKILL.md` | The workflow the agent follows |
| `skills/conversion-audit/references/` | The rubric, page-type checks, prioritisation, report template, hand-offs to other skills and sources |
| `skills/conversion-audit/assets/audit.template.json` | An example `audit.json` that passes every rule |
| `mcp/server.ts` | The MCP server |
| `src/schema.ts` | The `audit.json` schema and rules |
| `src/capture.ts` | Page capture |
| `src/annotate.ts` | Finding boxes on screenshots |
| `src/compare.ts` | Re-audit comparison |
| `src/store.ts` | Audit folders and path checks |
| `test/` | Tests, including a real Chrome run against `test/fixtures/landing.html` |

## Commands

| Command | What it does |
| --- | --- |
| `npm run mcp` | Start the MCP server on stdio |
| `npm test` | Run the tests. The browser test skips when Chrome is not installed |
| `npm run check` | Type-check the project |

## Limits

- An audit is an expert review. Only real traffic shows whether a change raised conversions, so the report never predicts a conversion rate.
- Image weight counts only responses that send a `Content-Length` header, so it can undercount.
- LCP and CLS come from one headless page load. They are lab figures, not the field data Google uses. INP needs real interaction and is not measured.
- Very tall pages can exceed Chrome's screenshot height limit when annotated.
