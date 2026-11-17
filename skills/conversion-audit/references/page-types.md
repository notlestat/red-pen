# Page types

Apply the module that fits the page after scoring the eight lenses. Each module adds the checks that matter most for that kind of page and says which lens usually holds the bottleneck. A site can need two modules, for example a SaaS homepage and its pricing page.

## Page job comes from the traffic

Check this before the modules. The same offer needs a different page for different traffic. When traffic is mixed, judge the page for the coldest traffic someone pays for: warm visitors skip what they already know, but cold visitors cannot skip what is missing.

| Page job | Traffic | Should keep | Should cut |
|---|---|---|---|
| Cold-traffic offer | Paid social or display, visitors who did not ask to be here | Problem-led hero, the problem, how it works, proof, offer, objection FAQ, closing ask | Main navigation and footer link lists, because every link is an exit |
| Warm-list page | Email or newsletter clicks, already sold on the problem | Offer-led hero, what you get, proof, FAQ, ask | Problem education they already believe |
| Lead magnet opt-in | A trade, not a sale | Hero, what is inside, one field | Nearly everything else. Every section delays the trade |
| High-ticket or book-a-call | Qualifying matters more than volume | Hero, heavy proof, who it is not for, calendar | Countdown timers and discount banners, which cheapen a considered purchase |
| Waitlist or pre-launch | No product proof exists yet | Vision-led hero, why it will work, founder story, one field | Testimonials nobody has given, pricing, a long FAQ |
| Local service | Search, map or ad clicks comparing three businesses on a phone | Promise headline, tap-to-call, one proof line, what we fix, real prices, recent reviews, service area | Navigation exits, sliders, stock photos, long forms |

A page built for the wrong row is the first finding in the report, ahead of every section-level fix.

Source: the `landing-page` skill's architecture rules (Boring Marketing). These are design rules from practice, not measured results.

## Lead-generation funnel

Lead magnets, appointment funnels, quizzes, VSLs and webinar registrations. The `funnel-first` skill defines these types; this module audits them.

Bottleneck is usually in: **Offer** (the first ask is too big for the traffic) or **Hook**.

- The funnel type fits the traffic. Cold social traffic on phones does better with a one-tap first question (quiz or appointment) than with a long form. Warm email traffic can take a lead magnet with a one-field form.
- On multi-step funnels, the first question sits in the hero and reads at a glance. Two to six answers per question, one question per screen, progress shown.
- Qualifying questions come before contact details. Contact details come last, framed as the final step, with two fields at most.
- A VSL has captions, a visible play control and a reason to watch in the headline. Note where the call to action appears relative to the video.
- A webinar page names the date, time and time zone on the button or beside it, and the thank-you page adds the calendar invite.
- The lead magnet itself is worth having. A generic "ultimate guide" scores low on Offer.
- Write the Brunson pass as findings: for each step, which of hook, story or offer is weakest. Load `brunson-pass` when installed.

## Local service

Plumbers, dentists, clinics, roofers, salons, trades. Phone first.

Bottleneck is usually in: **Match** (the ad's promise is missing) and **Trust** (a strong rating that never appears).

- The first phone screen holds the service and the area in plain words, a tap-to-call number, and the ad's exact promise ("24/7", "same-day", "free estimate").
- The Google rating and review count sit under the headline when they are strong (around 4.5 or better with a real volume of reviews). When they are weak, the fix is in getting reviews, not in the page.
- A sticky call bar stays visible on scroll.
- A booking link or short form is reachable from the first screen. This matters more for routine work (dental, cleaning, servicing) than for emergencies.
- Licences, insurance, years trading and a guarantee are visible.
- The phone number is the same on the site, the structured data and the Google profile.
- Load `first-screen-check` when installed. It holds the full local checklist and ranking.

## Ecommerce

Product pages, collections, cart and checkout.

Bottleneck is usually in: **Friction** (checkout) or **Trust** (product page proof and returns).

Product page:
- Images show the product at scale, in use and in detail, and zoom works on a phone.
- Price, delivery cost or threshold, delivery time and returns policy are visible near the add-to-cart button, before the cart.
- Reviews show near the price, with the count, and can be filtered. Some negative reviews increase trust.
- Variant selection (size, colour) is clear, out-of-stock states are honest, and a size guide sits beside the size picker.
- The add-to-cart button stays reachable on a phone.

Cart and checkout:
- Guest checkout is offered, and is the default option or an equal one.
- Count the fields. Baymard's 2024 checkout benchmark found an average of 11.3 fields when most sites need about 8, and found that field count affects usability more than step count.
- Total cost, including delivery and taxes, appears before the payment step. Unexpected costs at the end are a leading cause of abandonment.
- Express payment options (Apple Pay, Google Pay, PayPal, Shop Pay) appear early.
- Address lookup, correct keyboards on phones, inline validation, and no lost data on error.
- Trust cues sit at the payment fields: secure payment, returns, contact.
- Discount code fields do not send people away to search for codes. A collapsed link is better than an open box.

## SaaS and software

Homepage, feature pages, pricing, trial and demo signup.

Bottleneck is usually in: **Clarity** (what it does) or **Offer** (trial versus demo, pricing clarity).

- The homepage headline says what the product does and for whom in plain words. A product screenshot or short demo appears on the first screen.
- Both kinds of visitor have a path: ready-to-try (start free) and still researching (see how it works, pricing).
- The pricing page has a recommended plan, a plain comparison, the billing period stated, the annual saving shown, and the "which plan is right for me" question answered.
- "Free trial" says whether a card is needed and what happens when it ends.
- Demo request forms ask only what sales needs to route the lead. Offer instant booking where possible.
- Proof matches the buyer: logos of similar companies, case studies with numbers, security and compliance badges for enterprise buyers.
- For signup and activation beyond the page, hand to `signup` and `onboarding` when installed.

## Sales page

Courses, coaching, info products, high-ticket offers, long-form direct response.

Bottleneck is usually in: **Desire** (the doubt is not answered) or **Offer** (the stack and guarantee).

- The headline speaks to the reader's awareness stage. Long-form pages for unaware traffic open with the problem or a story, not the product.
- The page answers the false belief with a story or proof, then presents the offer stack, the price anchor, the guarantee and the call to action.
- The offer stack is concrete. Each item has a reason to exist. Bonuses are real.
- The guarantee is specific about terms and how to claim.
- A FAQ answers the real objections in the customer's words.
- The call to action repeats after each major section.
- Every income claim, result and testimonial has a source. Results claims carry more legal risk here than anywhere else.

## Agency, studio and portfolio

Creative studios, consultants, freelancers and service businesses selling expertise.

Bottleneck is usually in: **Clarity** (what they do and for whom) and **Action** (a vague "get in touch").

- The first screen says what the studio does, for whom, and the result, not only a reel or a logo wall.
- Work is presented as cases: the client, the problem, the decision, the result. A gallery of images with no context scores low on Trust.
- A fit filter says who the studio works with (budget range, sector, project type). This raises lead quality and saves calls.
- The enquiry path is specific: book a call with a calendar, or a short brief form with a budget question. "Say hello" with an email address scores low on Action.
- Process and timeline are visible, so buyers can picture working together.
- Prices or starting prices, where the business is willing to show them, filter out poor-fit leads.
- Keep the work's look intact. Recommend changes to the path, words and order around the work, not a generic template that flattens it.
