# Transformation canvas

For the Chapter 20 sections *Recognizing why transformations fail* and *Putting the pieces together*. One page, written once by the people who lead the transformation and revised at every phase boundary. Replace every value in italics. The example answers are constructed for the fictional Tailwind Gears company of Chapter 1 and are not a recommendation for yours.

## Why

- The reason this transformation exists, in one sentence a new hire would understand: _(example: "Our customers compare us with the fastest product in our market, and our release cycle is measured in quarters.")_
- The sense of urgency, and where it is felt: _(management: the market; engineering: the technical debt and the hiring problem; both named, so the stories pull in one direction)_
- What happens if nothing changes, by when: _(date, consequence)_

## How

- The three capabilities we build first, in order, and the chapter of the book that describes each: _(example: a delivery baseline, Chapter 1; trunk-based delivery with a protected default branch, Chapter 12; a test pyramid with a coverage gate, Chapter 13)_
- The obstacle we expect most, and the regulation or structure behind it: _(example: a V-model reading of ISO 26262 in the embedded division; the counter-move is the audit evidence the pipeline already produces)_
- Who helps from outside, with what, until when: _(coach, scope, end date)_

## What

- The platform decision: _(GitHub Enterprise Cloud on github.com, GHE.com, or Enterprise Server; who decided; Chapter 19)_
- The pilot teams and the service each one owns: _(team, service, division)_
- What we do not change in the first year: _(organizational chart, job titles, procurement)_

## Metrics that say whether

| Measure | Baseline | Target after the pilot phase | Source |
| --- | --- | --- | --- |
| Change lead time | _(days)_ | _(days)_ | _(Chapter 1's measurement)_ |
| Deployment frequency | _(per week)_ | | |
| Change failure rate | _(percent)_ | | |
| Failed deployment recovery time | _(hours)_ | | |
| Deployment rework rate | _(percent)_ | | |
| One developer-experience measure | _(survey statement, score)_ | | _(Chapter 1's SPACE survey)_ |
| One product outcome | _(key result)_ | | _(Chapter 18)_ |

## The first constraint

- Where work waits longest today, with the number that shows it: _(example: review, median 2.4 days from ready to approved)_
- How we exploit it this quarter without new budget: _(example: changes under 200 lines, Copilot code review as the first pass, a review rota)_
- What we subordinate to it: _(example: no agent tasks beyond the review budget; no new feature flags without an owner)_
- What would elevate it, and what that costs: _(example: a platform team of four that owns the pipeline and the test harness)_

## Phase boundaries

| Phase | Begins when | Ends when the metrics show | Owner |
| --- | --- | --- | --- |
| Measure and decide | _(date)_ | A baseline exists for each pilot service | |
| Pilot teams | The baseline exists | Lead time and rework improved for the pilot services | |
| Engineering practices | The pilot teams release weekly | Change failure rate stable or lower at the higher frequency | |
| Scale and optimize | Two further divisions ask to join | The next constraint is named with a number | |
| AI scale-out | The foundations above hold in the target repositories | Chapter 20's playbook: the wave's exit criteria | |

The stories we tell at each boundary, with the number behind each, go in a shared repository next to this canvas; a transformation is remembered through its stories, and a story without a number becomes theater within a year.
