# Copilot rollout plan

For the Chapter 19 section *Rolling out Copilot and managing AI policy at scale*. One page, kept in a repository your platform team owns. Replace every value in italics; the example rows are constructed for a fictional catalog company and are not a recommendation for yours.

## Scope and owner

- Enterprise and organizations in scope: _(names)_
- Plan: _Copilot Business or Copilot Enterprise; who decided and why_
- Owner of the rollout: _(name, team)_; AI manager role holders: _(names)_
- Security and legal sign-off on the policy baseline: _(date, link to `policy-baseline.md`)_

## Baseline before the first seat

Measure before the first wave, as Chapter 1 describes, so that the later numbers mean something.

| Measure | Value before | Source | Date |
| --- | --- | --- | --- |
| Lead time for changes | _(days)_ | _(Pulse, Insights, or your dashboard)_ | |
| Deployment frequency | _(per week)_ | | |
| Change failure rate | _(percent)_ | | |
| Median pull request size and review waiting time | _(lines, hours)_ | Chapter 1's measurement | |
| Seats already in use outside the plan (individual subscriptions, other tools) | _(count)_ | Survey | |

## Waves

| Wave | Who | Seats | Entry criteria | Exit criteria | Date |
| --- | --- | --- | --- | --- | --- |
| 0 | Platform team and two volunteers from the catalog team | 6 | Policy baseline approved; instructions file in the pilot repositories | Metrics dashboard read for 4 weeks; no open policy question | _(date)_ |
| 1 | The catalog organization | 40 | Wave 0 exit; review budget written (Chapter 17) | Acceptance rate and change failure rate reviewed; content exclusions confirmed | _(date)_ |
| 2 | Every organization with a working agreement | _(count)_ | Wave 1 exit; cost per wave within budget | | _(date)_ |

## Access path

- Enterprise: Copilot enabled for _specific organizations_, added per wave in __AI controls__.
- Organization: seats assigned to _selected members and teams_ (or to _enterprise teams_), never to all members in the first two waves.
- Removal: seats of people without activity for _60_ days are reviewed monthly from the last-activity report and removed by hand; GitHub does not remove them for you.

## Cost and who pays

- Seats: _(count)_ x _(price per seat)_ per month, charged to cost center _(name)_.
- AI credits: _(included credits per seat)_ pooled per billing entity; paid usage policy _(on or off)_; budget _(amount)_ per cost center with alerts at 75, 90, and 100 percent and _(stop at limit: yes or no)_.
- Agent sessions and cloud sandboxes draw on the same pool; who pays for unattended runs: _(cost center)_.

## Enablement

- Repository custom instructions and `AGENTS.md` in every pilot repository (Chapters 7 and 8).
- Organization custom instructions carrying the working agreement's AI section (Chapter 5).
- A Space per product area with the architecture notes and the team API (Chapters 5 and 17).
- Office hours: _(weekday, time)_ for the first eight weeks.

## Review and rollback

- Weekly during a wave: usage dashboard, audit log filtered by `action:copilot` and `actor:Copilot`, budget consumption.
- Monthly: seat activity, policy baseline changes, incidents involving AI-generated changes (Chapter 10).
- Rollback switches, in order: the paid usage policy, the cloud and third-party agent policies for the affected organization, the organization's seats. Document who may flip each one.
