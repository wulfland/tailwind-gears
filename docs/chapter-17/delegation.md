# Delegation table

For the Chapter 17 delegation worksheet, *Filling in the delegation table for your team*. One row per backlog item. The first row is worked as an example; replace it if your answer differs.

| Item | Who does it | Gate before it merges | What must be written down first |
| --- | --- | --- | --- |
| 1. Search ignores case | An agent, from an issue that names `exercises/search.acceptance.ts` | The acceptance test passes, no existing test changes, a person reads the diff and the new regression tests | The failing test (exists) and the issue text |
| 2. | | | |
| 3. | | | |
| 4. | | | |
| 5. | | | |
| 6. | | | |

## Review budget

- Pull requests reviewed and merged in the last month: _(count)_
- Minutes per pull request, read properly: _(estimate)_
- Hours per month spent reviewing: _(count x minutes / 60)_
- Limit on agent tasks in flight: _(derived from the budget, not from the allowance)_
- How we check it: review waiting time and pull request size, measured as in Chapter 1

## Agents section for the team API

Copy this section into `docs/team-api.md` and fill it in.

### Agents

- What agents may do in this repository: _(for example: bugs with a failing test, documentation with cited locations, refactoring shards under a recipe, dependency updates; not features with an open product decision, not changes to tests or to the working agreement)_
- Who reviews their pull requests, and what the review checks: _(a named role; the gate from the delegation table, not "looks good")_
- Agent tasks in flight at once: _(the limit from the review budget)_
- Who pays: _(the plan or budget the credits come from; who approves exceeding it)_
- Where the agreement lives: this file and `docs/delegation.md`, changed through a reviewed pull request
