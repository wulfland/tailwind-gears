# AI-adoption ROI ledger

For the Chapter 20 sections *Running the AI-adoption playbook* and *Avoiding AI theater*. One page per wave, kept next to the rollout plan of Chapter 19 and updated monthly by the person who owns the rollout. Replace every value in italics. The example rows are constructed for the fictional Tailwind Gears company and are not a forecast for yours.

Two rules keep the ledger honest. Every line names its source and the date it was read, and the benefit lines are measured on the same services and the same people as the baseline; a comparison between the developers who adopted a tool and the developers who did not compares two populations, not one population over time.

## The decision this ledger informs

- Decision: _(example: "Extend Copilot from the two pilot teams to the web services division in wave 1, or hold")_
- Who decides, by when: _(name, date)_
- Comparison: _(the pilot services against their own baseline from `transformation-canvas.md`, over the same number of weeks)_

## Costs

| Line | Amount per month | Source | Read on |
| --- | --- | --- | --- |
| Seats | _(count x price)_ | Billing, Chapter 19 | |
| AI credits beyond the pooled allowance | _(amount)_ | Budgets and usage report | |
| Agent sessions and unattended loops | _(amount, share of the credits)_ | Usage metrics per client | |
| Enablement time: champions, office hours, workshops | _(hours x loaded rate)_ | Calendar, time records | |
| Learning time granted to the teams | _(hours per developer)_ | The rollout plan | |
| Review time: hours reading agent pull requests | _(hours x loaded rate)_ | Chapter 17's review budget | |
| Platform work: instruction files, Spaces, MCP servers, policy | _(hours x loaded rate)_ | Platform team backlog | |
| Rework attributed to generated changes | _(reverted or rewritten pull requests)_ | Deployment rework rate, churn | |

## The dip

| Measure | Baseline | Lowest point | Date it recovered | Still below baseline? |
| --- | --- | --- | --- | --- |
| Change lead time | | | | |
| Change failure rate | | | | |
| Review waiting time | | | | |
| Deployment rework rate | | | | |

The dip is expected; DORA's 2026 report calls it the tuition cost of the transformation. What is not expected is a dip without a recovery date. Write the date by which each measure must be back at baseline when the wave starts, not when it ends: _(date)_.

## Returns

| Line | Baseline | Now | Change | Source | Read on |
| --- | --- | --- | --- | --- | --- |
| Change lead time for the pilot services | | | | Chapter 1's measurement | |
| Deployment frequency | | | | | |
| Change failure rate | | | | | |
| Failed deployment recovery time | | | | | |
| Deployment rework rate | | | | | |
| Median pull request size and review waiting time | | | | Chapter 3's review data | |
| One developer-experience statement | | | | Chapter 1's survey | |
| One product outcome the pilot teams own | | | | Chapter 18's key result | |
| Security debt: open alerts past their service level | | | | Chapter 15 | |

## Adoption, kept apart from returns

| Signal | Value | Why it is here |
| --- | --- | --- |
| Active and engaged users per cohort (passive, code first, agent first, multi-agent) | | Says whether the seats are used, not whether they helped |
| Acceptance rate and lines kept | | A diagnostic for enablement, never a productivity claim |
| Pull requests opened by agents, and their merge rate and time to merge | | Tells you what the review queue is carrying |

## The ROI line

- Value this period: _(the returns above, priced only where the price is defensible: hours of rework avoided, incidents avoided, revenue from the product outcome)_
- Investment this period: _(the sum of the cost lines)_
- Return on investment: _(value minus investment, divided by investment)_, with the range from a conservative and an optimistic reading: _(low to high)_
- What this number cannot say: _(example: whether the lead time would have improved without the tool, because the pilot had no control group)_

## The decision

- Observations (what the numbers show): _(three lines)_
- Conclusions (what we think they mean, and what else could explain them): _(three lines)_
- Decision: _(extend, hold, or roll back, with the rollback switch from the rollout plan)_
- Next review: _(date)_
