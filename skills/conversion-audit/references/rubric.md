# Rubric

Score every lens on every step of the funnel. The anchors are the same for all eight:

| Score | Meaning |
|---|---|
| 0 | Missing or broken. The visitor cannot get an answer to this lens's question. |
| 1 | Present but weak. The answer is there if they look for it, or it is vague. |
| 2 | Sound. A visitor scanning the page gets the answer. |
| 3 | Strong. Specific, provable and placed where the visitor needs it. |
| `UNKNOWN` | Could not be seen: the step was not reachable, or the evidence is HTML only. |
| `n/a` | The lens does not apply to this step, such as Hook on the second screen of a form. |

A step's audit score is the sum of its scored lenses, out of 3 for each lens that applies (24 when all eight apply). `UNKNOWN` lenses count toward neither the score nor the maximum, and the report says how many there were. The report may convert it to a score out of 100 for the summary, labelled as a heuristic summary, never as a predicted conversion rate. The ranked fix list matters more than the total.

Each lens below lists what to check, what a 3 looks like, and the failures that turn up most often.

## 1. Match

*Did I land where I meant to?*

The visitor clicked because of a promise. If the first screen does not repeat it, they assume they are in the wrong place.

Check:
- The promise from intake (ad headline, offer, search query, email subject) appears on the first screen in the same words, not a paraphrase. "Same-day" and "fast service" are not a match.
- The page speaks to the visitor's awareness stage. Cold social traffic is usually problem-aware and needs the problem named first. Branded search traffic is product-aware and wants the offer and the price.
- Each ad or audience lands on a page made for it, not one page for everyone.
- The visual continuity holds: the ad's image, colour or product reappears.

A 3: the ad's exact promise is the headline or sits directly under it, and the page opens at the visitor's awareness stage.

Common failures: every ad sends traffic to the homepage. The offer in the ad ("free quote", "20% off") is missing or buried. A broad brand headline greets visitors who clicked on a specific problem.

## 2. Clarity

*What is this, who is it for, and what do I do here?*

Run a five-second test on the phone screenshot. Look for five seconds, look away, and answer: what is offered, for whom, and what is the next step? If any answer is a guess, clarity scores 1 or lower.

Check:
- The headline says what the visitor gets, in their words, not the company's internal language.
- One primary action is visually dominant. Secondary actions look secondary.
- The first screen on a phone holds the headline, the value and the action without scrolling.
- Visual hierarchy reads in the right order: headline, support, proof, action.
- Images show the product, the result or the person, rather than decorating.
- Jargon, clever wordplay and abstract claims ("solutions", "elevate", "next-level") are absent.

A 3: a stranger passes the five-second test on the phone screenshot, and the primary button is the most visible element after the headline.

Common failures: the hero is a full-screen image or video with the value below it. Three buttons of equal weight. The headline names a category ("Digital marketing agency") instead of a result.

## 3. Hook

*Why should I keep reading?*

Clarity tells visitors what this is; the hook makes them care. Brunson's rule: if visitors think they already know what they will get, they leave.

Check:
- The headline leads with a result they want, a question they are asking themselves, or the doubt they hold ("even if you've tried ads before").
- The subheadline promises the result rather than listing contents.
- Something on the first screen is specific: a number, a timeframe, a named outcome, a surprising fact.
- The hook is true and can be backed by the page.

A 3: the headline opens a gap the visitor wants closed and the page closes it with proof.

Common failures: "Welcome to [brand]". A headline that is a list of services. A clever line that needs explaining.

## 4. Desire

*Do I want this, and is it for someone like me?*

Desire comes from the visitor seeing their own situation and the result they want. This is where Brunson's story and the false belief sit.

Check:
- The page describes the visitor's problem in the words customers use (reviews, sales calls, Reddit threads), before describing the product.
- Benefits come before features, and each feature is tied to the result it creates.
- The doubt from intake is named and answered by a specific section with facts.
- The page says who it is not for. A filter line raises lead quality and makes the right visitor feel picked.
- The result is shown: a before and after, a demo, a case, a product in use.
- Objections are answered where they come up, not only in a FAQ at the bottom.

A 3: a visitor in the target segment sees their situation described, their doubt answered with evidence, and a clear picture of the result.

Common failures: the page is about the company ("we are passionate about..."). Features with no benefit. The real objection (price, time, "will it work for me") never appears.

## 5. Offer

*What do I get for what I give, and is it worth it now?*

The offer is the trade at each step: a tap, an email, a booking, money. Hormozi's value equation is a good test: value rises with the dream outcome and the likelihood of getting it, and falls with the time it takes and the effort or sacrifice it costs.

Check:
- What the visitor gets for this step is concrete. "Get a free 15-minute roof photo report", not "Contact us".
- The first ask is the smallest useful yes for this traffic. Cold traffic gets a tap, a quiz question or a free resource before a call or a payment.
- The offer stack lists what is included, and each item solves a problem the last one creates.
- Risk is reversed where honest: a guarantee, a free trial, cancel anytime, "no obligation". A guarantee states its terms and how to claim. Match the guarantee to the fear: money back for "it won't work", a results guarantee for "it won't work for me", a service guarantee ("on time or it's free") for "they'll mess me around".
- Price is shown or framed where buyers expect it, with the anchor visible (the cost of the problem, the alternative, the plan comparison).
- There is a second yes after the first: an upsell, a booking after the opt-in, a referral.

A 3: the trade is concrete, low risk, sized to the traffic's temperature, and worth more than it costs on the face of it.

Common failures: "Book a call" as the only ask for cold traffic. A free resource nobody wants. Price hidden behind a form for a product buyers expect to see priced.

## 6. Trust

*Can I believe it, and what if it goes wrong?*

Trust removes anxiety. It works best next to the ask, where the anxiety peaks.

Check:
- Proof sits next to every ask: a rating by the button, logos under the form, a testimonial beside the price.
- Proof is specific and attributed: full name, role or town, photo, the result in numbers. "Great service! - J." is weak proof.
- Proof matches the visitor. A local plumber needs Google reviews; a B2B tool needs logos and case studies.
- The proof the business already has reaches the page: a 4.8 rating from 300 reviews, years trading, licences, press, awards.
- Real people and contact details are visible: who runs this, an address, a phone number.
- Security and privacy cues sit at the point of payment or data entry. Say what happens to an email address.
- Nothing looks fake: stock photos of "customers", a perfect 5.0 hardcoded into structured data, testimonials without names.

A 3: specific, attributed proof that matches the audience sits next to every ask, and the business's real identity is visible.

Common failures: a strong Google rating that never appears on the site. Testimonials on a separate page. A form asking for a phone number with no word on how it is used.

## 7. Friction

*How much effort is this?*

Every field, step, second of loading and moment of doubt costs yeses. Friction is the lens where the fix is usually certain.

Check:
- Form fields: count them and justify each. Lead forms rarely need more than name, email or phone, and one qualifying question. Ecommerce checkouts can usually work with 8 fields; Baymard's 2024 benchmark found an average of 11.3.
- Multi-step forms ask easy, qualifying questions first and contact details last, with progress shown.
- Inputs use the right type (`tel`, `email`), autocomplete and visible labels. Errors say what to fix, beside the field, without wiping what was typed.
- The page loads fast on a phone: LCP under 2.5 seconds, INP under 200 milliseconds, CLS under 0.1 (Google's "good" thresholds). A hero image over 1 MB is a fix.
- Distraction: on a dedicated landing page, the main navigation, footer links and competing calls to action are removed or quietened.
- Popups, chat bubbles and cookie banners do not cover the headline or the button on a phone.
- Tap targets are at least 44 by 44 points, and nothing requires hovering.
- Account creation is not forced before a purchase.

A 3: the fewest fields this goal allows, a fast phone load, nothing covering the action and nothing leading away from it.

Common failures: a 9-field contact form. A cookie banner over the button. A 4 MB hero video on a phone. A required "company size" field for a consumer.

## 8. Action

*What exactly do I do next, and what happens after?*

Check:
- The button says what the visitor gets: "Get my quote", "Show me my plan", not "Submit" or "Learn more".
- The line under the button removes the last doubt: "Takes 60 seconds", "No card needed", "We reply within 2 hours".
- The ask repeats down the page at natural decision points, for visitors who needed the whole argument.
- Urgency is real or absent. Honest forms: limited capacity ("we take 4 new clients a month", when true), cohort start dates, real stock counts, seasonal deadlines, a dated price rise, a bonus that really expires. A countdown that resets, "only 3 left" that never changes, or a "last chance" that is not the last counts as 0 and goes in the report as a risk. Many offers need no urgency at all; a quiet line on the cost of waiting is enough.
- On a phone, the action stays reachable: a sticky call bar for local services, a sticky button on long pages.
- The thank-you page confirms what happened, says what comes next and when, and offers the second yes.
- Follow-up happens: a confirmation email arrives, and leads get a reply fast. Leads cool within minutes. On the owner's site, test the response time; on a prospect's site, note it as `UNKNOWN`.

A 3: a specific button with a doubt-removing line, repeated where needed, and a thank-you page and follow-up that keep the momentum.

Common failures: "Submit". A thank-you page that only says "Thanks". A form that sends leads to an inbox nobody reads.

## Technical floor

Pass or fail. A failure on a high-traffic step goes to the Fix now bucket and usually outranks copy work.

| Check | Pass |
|---|---|
| Loads on a phone | The page renders at 390 wide without horizontal scroll or broken layout |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on mobile, from field data where available, lab data otherwise (say which) |
| Primary action works | The main button and form work. On the owner's site a test submission arrives; on a prospect's site, mark `UNKNOWN` |
| Links resolve | Ad URLs, profile links and main buttons return 200 without a redirect chain or a 404 |
| Conversion tracked | An analytics or pixel event fires on the conversion itself, not only on page view |
| Tap and call | Phone numbers are `tel:` links where calls matter |
| Contrast | Body text, muted text and button text meet WCAG AA (4.5:1 for body text, 3:1 for large text) |
| Keyboard | The form and the primary button can be reached and used with a keyboard, with visible focus |
| Labels | Every form field has a programmatic label, not only a placeholder |
| Nothing covers the action | No popup, banner or widget covers the headline or button on the first phone screen |
| Honest data | Structured data, prices and ratings on the page match reality |
| HTTPS | The page and the form submit over HTTPS |

## Behaviour signals and the lenses

When replay evidence exists (Orion, or another replay or heatmap tool), use it to confirm or challenge a lens score. With Orion, `get_page_attention` gives the gaze shares and scroll depth, and `get_events` gives the clicks behind each row below. It never replaces the screenshot: a score still cites what the page shows, and the behaviour signal is added as a second kind of evidence.

| Signal | Usually points at | Check on the screenshot |
|---|---|---|
| Little or no gaze on the headline or promise | Match, Clarity | Is the promise above a large image, below a banner, or too small? |
| Long gaze on a promo banner, slider or nav | Friction (distraction) | Does it compete with the main action? |
| Long looks at a form field or button | Friction, Clarity | Is the label vague, the field unexpected, the button text unclear? |
| Going back to the price, proof or guarantee | Trust, Offer | Is the proof next to the ask? Is the price framed? |
| Looking away just before the click | Trust, Action | What did they go back to check? What does the line under the button say? |
| Eyes and pointer far apart | Clarity, Friction | Is something drawing the eye away from where the hand must go? |
| Proof or offer sections rarely reached | Desire, Offer | Is the argument stalling earlier? Is the section in the right order? |
| Converting visits look at an element non-converting visits miss | Any | Can that element move higher or be made larger? |

Treat predicted gaze as an inference. Treat clicks, scrolls and form events from replays as observations.

## Why a finding costs yeses

Use one of these models in a finding's `why` line when it explains the mechanism in plain words. Name the effect only if the owner would find the name useful. The `marketing-psychology` skill holds the full list.

| Lens | Model | What it explains |
|---|---|---|
| Match | Confirmation bias | Visitors look for the words they clicked on and read anything else as the wrong place |
| Clarity | Curse of knowledge | The business forgets visitors do not share its words, so internal language stays on the page |
| Clarity, Friction | Paradox of choice | Three plans or five buttons of equal weight slow the decision, and some people make none |
| Hook | Zeigarnik effect | An open question pulls people forward until it is answered |
| Desire | Status quo bias | Doing nothing feels safe, so the cost of the current situation has to be shown |
| Desire, Trust | Social proof | People like the visitor doing it lowers the risk of doing it |
| Offer | Zero-price effect | Free changes behaviour more than any small price, for better and worse lead quality |
| Offer | Default effect | The pre-selected plan or option is the one most people take |
| Trust | Pratfall effect | One honest limitation makes the rest of the claims more believable |
| Friction | Goal-gradient effect | People speed up as they near the end, so progress bars and "last step" framing help |
| Action | Hyperbolic discounting | A benefit now beats a bigger one later, so say what they get today |
| Action | Peak-end rule | The thank-you page and first follow-up shape how the whole experience is remembered |

## Writing a finding

Each finding the report uses has these parts:

```
lens:      friction
step:      02 landing page (phone)
see:       "Form asks for 9 fields including company size and budget" (screens/step-02-phone-full.png)
why:       Every extra field costs completions, and consumers have no company size.
fix:       Cut to name, phone and one question: "What do you need help with?" (3 options)
evidence:  heuristic + technical
bucket:    fix-now
effort:    under an hour
```
