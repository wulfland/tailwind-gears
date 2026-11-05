# Chapter 20: optional transformation exercise and templates

The chapter can be read without doing this activity or using the templates. This guide keeps the activity's starting point, instructions, expected result, and reading-resumption point together, and it holds the two templates and the checklist the chapter's sections mention. All scenarios use fictional sample data, the Tailwind Gears company whose transformation the chapter describes is constructed, and nothing here authorizes changes in the author's repository.

A transformation does not run in a solo fork, which is why this chapter has one activity: a read-only scorecard of the foundations and the flow of one repository, the smallest form of the playbook's first stage. The canvas, the ledger, and the checklist are for your own organization.

Use **your fork** for the activity. It works on the unfixed baseline as well as on a fork that completed earlier chapters, and the two score differently on purpose; do not repeat the search fix or implement the unresolved category feature for this chapter.

- [Scoring your fork's foundations and flow before scaling AI](#scoring-your-forks-foundations-and-flow-before-scaling-ai)
- [Transformation templates](#transformation-templates): the transformation canvas, the ROI ledger, and the AI theater checklist

GitHub product instructions were checked against official documentation on November 4, 2026. The activity is free and read-only: it needs no Copilot plan, starts no workflow or agent, and creates nothing on GitHub. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`foundations.sh`](foundations.sh), [`transformation-canvas.md`](transformation-canvas.md), and [`roi-ledger.md`](roi-ledger.md). The outputs quoted below were observed on the author's machine on November 4, 2026, against the public sample `wulfland/tailwind-gears` with the GitHub CLI 2.102; a fresh fork shows the same foundations and an empty flow table, and a fork that completed earlier chapters shows its own history. Treat every expected result as an expectation to confirm.

## Scoring your fork's foundations and flow before scaling AI

**Starting point:** your fork of [wulfland/tailwind-gears](https://github.com/wulfland/tailwind-gears), a clone of it, and the [GitHub CLI](https://cli.github.com/) signed in to the account that owns the fork (`gh auth status` shows it). Plan about fifteen minutes. If your fork predates this guide, copy `docs/chapter-20/foundations.sh` from the sample into your clone; nothing else is needed.

### What the script reads

The script asks the GitHub REST API twelve questions about the repository's foundations and a few about its recent flow, all read-only (see the [REST API documentation](https://docs.github.com/en/rest)). Table 1 lists every call so that you can check there is nothing in it you would not run against your own repository.

| Row in the output | Endpoint | Notes |
| --- | --- | --- |
| Rules active on the default branch | `GET /repos/{owner}/{repo}/rules/branches/{branch}` | Counts rulesets and classic protection that apply to the branch |
| Workflow files | `GET /repos/{owner}/{repo}/actions/workflows` | Files under `.github/workflows/` |
| Test files | `GET /repos/{owner}/{repo}/contents/tests` and `/contents/e2e` | Counts `*.test.ts` and `*.spec.ts` |
| Code scanning default setup | `GET /repos/{owner}/{repo}/code-scanning/default-setup` | Needs admin access to the repository; prints `not visible` otherwise |
| Secret scanning push protection | `GET /repos/{owner}/{repo}` | From the `security_and_analysis` field |
| Dependabot, code owners, instructions, agents file, flag registry | `GET /repos/{owner}/{repo}/contents/{path}` | `yes` when the file exists |
| Deployment environments | `GET /repos/{owner}/{repo}/environments` | Count |
| Discussions enabled | `GET /repos/{owner}/{repo}` | The `has_discussions` field |
| Flow of pull requests by who opened them | `GET /repos/{owner}/{repo}/pulls?state=closed`, then `/pulls/{number}` and `/pulls/{number}/reviews` for the last 30 closed ones | People, the Copilot agent (author `Copilot`), and other automation; merged, hours to merge, changed lines, and whether a person (not a bot) reviewed |
| Workflow runs on the default branch | `GET /repos/{owner}/{repo}/actions/runs?branch={branch}` | The last 30 runs: success share and duration |

*Table 1: The API calls the scorecard makes, all read-only*

The script writes nothing, needs no `jq` (it uses the CLI's built-in `--jq` filter), and takes about twenty seconds on the public sample. A review by Copilot code review is a bot review and does not count in the last column; the chapter's question is whether a person read the change.

### Running the scorecard

1. In your clone, run the script against your fork, replacing `YOUR-USERNAME`:

   ```sh
   sh docs/chapter-20/foundations.sh YOUR-USERNAME/tailwind-gears
   ```

2. Read the foundations table. Against the public sample on November 4, 2026, it looked like this, and an unmodified fork shows the same values apart from code scanning, which an owner sees as `not-configured` and a non-owner as `not visible`:

   ```text
   | Foundation | In this repository | Chapter |
   | --- | --- | --- |
   | Rules active on the default branch | 0 | 12 |
   | Workflow files | 1 | 11 |
   | Unit and API test files; browser test files | 3; 1 | 13 |
   | Code scanning default setup | not-configured | 15 |
   | Secret scanning push protection | enabled | 15 |
   | Dependabot configuration (.github/dependabot.yml) | no | 15 |
   | Code owners (.github/CODEOWNERS) | no | 3 |
   | Repository instructions for assistants (.github/copilot-instructions.md) | yes | 7 |
   | Agents file (AGENTS.md) | no | 8 |
   | Feature flag registry (server/flags.ts) | no | 12 |
   | Deployment environments | 1 | 11 |
   | Discussions enabled | false | 4 |
   ```

   The baseline has a workflow, tests, push protection, one environment, and an instructions file, and nothing else: no rules on `main`, no code scanning, no Dependabot, no code owners, no agents file, no flags. That is a repository on which an assistant can help a person and an agent should not yet be left alone, which is the chapter's point about foundations preceding scale-out. A fork that completed Chapters 11 to 15 shows rules, scanning, Dependabot, and more environments; one that completed Chapter 12 shows the flag registry.

3. Read the flow table, which splits the last 30 closed pull requests by who opened them, and the run table underneath. On a fresh fork both say that there is nothing yet, because a fork starts with the sample's files and none of its history. On a fork with the exercises of Chapters 3, 11, 12, and 16 behind it, the rows for people and for the Copilot agent sit side by side with how many merged, the median hours to merge, the median changed lines, and how many a person reviewed. Against the public sample on November 4, 2026, it read:

   ```text
   | Opened by | Closed | Merged | Median hours to merge | Median changed lines | Reviewed by a person |
   | --- | --- | --- | --- | --- | --- |
   | People | 10 | 10 | 0.15 | 356 | 1 of 10 |
   | The Copilot agent | 3 | 0 | n/a | 19 | 0 of 3 |
   ```

   The people's row is the author merging guide branches without a second reviewer; the agent's row is three demonstration pull requests that the cloud agent opened and that were closed without merging. Fourteen of fourteen runs on `main` were green at a median of 0.8 minutes. Those numbers describe a documentation repository maintained by one person, and the chapter's rule applies: compare a repository with its own earlier baseline, never with another team's. What the split is for is the chapter's third theater signal: when your fork has agent pull requests, you can see whether they were larger, faster to merge, or less often read by a person than your own, which is the adoption-versus-outcome question on the smallest data set that can answer it.
4. Write the two tables into the [transformation canvas](transformation-canvas.md) as the baseline of this repository, under *Metrics that say whether* and *The first constraint*. On the baseline, the first constraint is not review but the absence of the gates that make review trustworthy.
5. Pick the one missing foundation you would add before giving this repository to an agent, add it from the chapter the row names, and run the script again. The ruleset of Chapter 12 changes the first row from `0` to the number of rules; a `.github/dependabot.yml` from Chapter 15 changes its row to `yes`; an `AGENTS.md` from Chapter 8 changes its row to `yes`. The second run is the system answering, and the difference between the two runs is a line in the canvas with a date on it.

### Letting the agent add the foundation (optional)

6. If you have a Copilot plan that includes the cloud agent, let the agent add the foundation instead of adding it yourself, so that the third run also shows an agent pull request that a person reviewed and merged. Open an issue in your fork with this text (see [Using the Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent); the activity in Chapter 12 shows the assignment step):

   ```text
   Title: Add an AGENTS.md for this repository

   Add an AGENTS.md at the repository root that tells a coding agent how to
   work here: the commands to install, check, and test (npm ci, npm run check,
   and npm run test:e2e after a build), a pointer to the working agreement in
   .github/copilot-instructions.md, and the two rules that must not change:
   the search in server/catalog.ts stays as it is unless an issue asks for
   case-insensitive search, and category filtering is not implemented.
   Do not change any other file.
   ```

7. Assign the issue to __Copilot__. The agent opens a draft pull request on a branch of its own; read the file it wrote as Chapter 3 described, request changes if it altered anything else, mark the pull request ready, and merge it into your fork's `main`. Then run the script a third time: the agents file row says `yes`, and the agent row of the flow table shows one more pull request, merged, with a person's review. An agent session consumes AI credits from your plan; check who pays before assigning, and skip this step if you have no plan.

Do not add foundations to make the table look complete. Each row is a chapter's worth of practice, and a code owners file naming a team that does not review is theater on a smaller scale.

**Expected result:** a scorecard of one repository's foundations and flow before an AI wave touches it, with the agent's pull requests and the people's side by side where the fork has both, written into the canvas with a date, and a second run that shows one foundation added, by you or by an agent whose pull request you reviewed; not a measurement of productivity, and not a judgment of anyone's work. **Return to the book:** continue with *Avoiding AI theater*.

## Transformation templates

The chapter's other sections do not run in a fork, so they end in templates for your own organization. Nothing changes anywhere until you copy one into a repository your transformation team owns.

- [`transformation-canvas.md`](transformation-canvas.md), for the sections *Recognizing why transformations fail* and *Putting the pieces together*: the why, how, and what, the urgencies at each level, the metrics that say whether, the first constraint with the five focusing steps, and the phase boundaries with the measure that opens each one. One page.
- [`roi-ledger.md`](roi-ledger.md), for the sections *Running the AI-adoption playbook* and *Avoiding AI theater*: the decision the ledger informs, the cost lines, the dip with its recovery dates, the returns against the same services' baseline, the adoption signals kept apart from returns, the ROI line with its range, and the decision with observations separated from conclusions. One page per wave.

The AI theater checklist is short enough to live here. Before an AI result goes on a slide, ask:

1. Which decision does this number inform, and was the comparison defined before the number existed?
2. Does it measure the same services and people as the baseline, or adopters against non-adopters?
3. Is it an adoption signal (seats, active days, acceptance rate, lines, agent pull requests) presented as value?
4. If it is a dip, what is the lowest point, and what is the date by which it must have recovered?
5. If it is a vendor's figure, what task, company, or population did the vendor measure?
6. If it is a pilot, what was its go or no-go date, and has that date passed?
7. Could the person who owns the number stop the wave on the strength of it? If not, it is decoration.

A "no" on any line is not a reason to hide the number; it is the sentence to write under it.
