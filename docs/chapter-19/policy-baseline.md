# AI policy baseline

For the Chapter 19 subsection *Governing AI policy at scale*. One row per control an enterprise administrator sets for GitHub Copilot and the agents that run through it. The starting values are a conservative baseline for the first wave of a rollout, not GitHub defaults and not a recommendation for every company; change them with your security and legal teams and record who decided. Setting names follow GitHub's documentation on November 4, 2026 and move; check the current pages before you rely on one.

| Control | Where it is set | Starting value for wave 0 | Who may change it | Review |
| --- | --- | --- | --- | --- |
| Copilot enablement per organization | Enterprise, __AI controls__, __Copilot__ | Specific organizations, added per wave | Enterprise owner | Each wave |
| Seat assignment | Organization, or enterprise teams | Selected members and teams, with the last-activity report read monthly | Organization owner, AI manager | Monthly |
| Suggestions matching public code | Enterprise policy | Blocked, unless legal decides otherwise in writing | Enterprise owner with legal | Yearly |
| Copilot in the cloud (cloud agent, cloud sandboxes) | Enterprise policy, then organization | Let organizations decide; pilot organizations on | Enterprise owner | Each wave |
| Third-party agents (Claude, Codex, agent apps) | Enterprise, then organization | Off until the team's review budget (Chapter 17) and the agent rules (Chapter 12) are written | Enterprise owner | Quarterly |
| MCP servers | Enterprise policy, plus the allowlist in managed settings | Allowlist of servers the platform team vetted; nothing else, failing closed | Enterprise owner, security | Quarterly |
| Models | Enterprise __AI controls__ | The default models; previews off | Enterprise owner | When a model ships |
| Editor preview features | Enterprise policy | Off, except in the pilot organization | Enterprise owner | Each wave |
| Content exclusion | Repository, organization, enterprise | Paths with credentials, customer exports, and files under legal hold | Organization owner, security | On change |
| AI credits paid usage and budgets | Enterprise and organization billing | Paid usage on, a budget per cost center with alerts; stop at the limit for the pilot | Billing manager | Monthly |
| Usage metrics | Enterprise policy | Enabled everywhere, so that the dashboards and the metrics API work | Enterprise owner | Once |
| Audit log | Enterprise audit log, streamed to your monitoring tool | `action:copilot` and `actor:Copilot` reviewed weekly during a wave | Security | Weekly |
| Organization custom instructions | Organization | The working agreement's AI section (Chapter 5), nothing repository-specific | Platform team | Quarterly |
| AI manager role | Enterprise custom role | The platform team, not every organization owner | Enterprise owner | When people change |

## How to use the table

1. Fill the last two columns first. A control without an owner and a review date is a setting someone will forget.
2. Walk the rows with security and legal once, before the first seat. The three rows they usually care about are the public-code filter, content exclusion, and the data handling terms of the plan you bought.
3. Keep the table next to the rollout plan and change both in one pull request when a wave opens a control.
4. Chapter 10 holds the policy content, what AI may and may not do in your code; this table holds only where each switch is and who holds it.
