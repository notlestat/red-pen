# Orion

Orion (Paradigm Machines) reads a site's session replays and predicts where each visitor looked, with a model trained on eye-tracking data. Its MCP server is `orion` at `https://app.paradigmmachines.ai/mcp`, signed in with Google. Tool names below are as listed on 17 November 2026. The tool list your agent shows is the current source; if a name below is missing there, Orion has changed it.

Use it for owner and client sites only, with the owner's agreement. It does not work on a prospect's site, because that site does not send Orion its replays.

## Read first

Call `describe_data` once per audit before quoting any Orion number. It defines the friction score and its parts, the gaze model and its limits, and the file formats.

## What counts as what

| Orion output | Evidence kind | Status |
|---|---|---|
| Page views, clicks, rage clicks, dead clicks, errors, scroll-backs, how far down the page visits got (`get_events`, `list_sessions`, `get_breakdown`) | `recordings` | OBSERVATION |
| Gaze, dwell, gaze maps, snapshots, the friction score (`get_gaze_*`, `get_page_attention`, `get_session`) | `predicted-attention` | INFERENCE |
| Orion's recommendations (`get_recommendations`) | A lead, not evidence | Check it on the page and in the replay before it becomes a finding |

`get_recommendations` comes from AI models watching each replay with the predicted gaze, with two more models confirming each problem. It is a strong lead and saves time, but it is still a model's judgement on a model's prediction. A finding built from it cites what the screenshot and the recorded events show, and lists the evidence kinds you checked.

Check `get_session` warnings before using a visit: a phone, little pointer input, low confidence, one element holding all the gaze, screens that are one picture. On phones there is no cursor, so gaze rests on scrolls and taps alone and deserves less weight. Most paid traffic is on phones, so say in the report how many of the visits behind a finding were desktop.

## By audit phase

| Phase | Call | For |
|---|---|---|
| Set up | `list_sites`, then `add_site` with the domain | Gives the one-line tag and where it goes on Shopify, WordPress, Webflow, Wix, Squarespace or Tag Manager. Installing it on the site is the owner's job |
| Set up | `check_site` | Whether the tag loads (or is held back by a cookie banner or the security policy) and whether visits arrive |
| Set up, no tag | `upload_recordings` with `check_only: true` first | Scores existing replays from PostHog, Sentry, Mixpanel, Amplitude, Highlight or rrweb without installing anything. Owner of the workspace only |
| Intake | `get_overview`, `list_pages`, `get_breakdown` (`by: page`, `device`, `source`, `utm_campaign`) | Visits, friction and gaze per page, device and traffic source. Feeds the funnel math in Phase 4 |
| Bottleneck | `list_pages` (share of high friction), `get_breakdown` `by: page`, `get_recommendations` | Which page and which problem cost the most visits |
| Score | `get_page_attention` with the landing page | Each element's share of the gaze, gaze by kind (images, copy, buttons, links, fields), how far down visits got. Confirms or challenges the Match, Clarity, Desire and Trust scores |
| Score | `get_page_attention` with `element` | That element's gaze in each visit beside each visit's friction. Shows whether visits that saw the proof or the promise went better |
| Score | `list_sessions` with `page`, `has: rage` or `dead`, or `sort: score` | The worst visits, to watch and cite |
| Evidence | `get_session`, `get_events` (`kind: marks`), `get_friction_timeline` | What happened in one visit, second by second, and the element behind its friction |
| Evidence | `get_gaze_snapshot` with `session_id` and `element` and `page` | A picture of the moment that element held the most gaze, with gaze drawn on. Save it into `screens/` and cite it |
| Evidence | `get_gaze_map` | The gaze as a text grid with each element's share, for reading without a picture |
| Measure | `compare` with two date ranges, or `url_param` for an A/B test | Before and after a change, element by element: gaze share, click share, how far down visits got, friction |
| Data | `get_download_links` | The raw replay, events, gaze frames and element boxes for your own analysis |

Orion's selectors and our `capture_page` selectors both point at page elements. Match them when a finding cites both, and store ours in the finding's `element`.

## Limits

- Orion keeps data for 90 days.
- A site needs real visits before Orion has anything to say. Plan the audit around the traffic the site already gets.
- Recommendations are off until the site owner turns them on in Orion's dashboard.
- Never call a delete tool (`delete_upload`, `delete_site` or any other) unless the user asks for that exact deletion. The sign-in grants delete access.
- Pictures uploaded through `upload_recordings` are kept as sent; Orion masks text, not pictures. Blur anything private before uploading.
