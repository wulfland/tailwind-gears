# Chapter 4: optional asynchronous collaboration exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data. No exercise authorizes changes in the author's repository.

Use **your fork** for issues and PRs, and **your fork's `main`** as the implementation target. Do not repeat the search fix if you already completed Chapter 3. The final activity is documentation-only and works with either the unfixed baseline or your corrected fork. Keep the category feature's product questions unresolved unless you explicitly make a practice decision and label it as such.

- [Writing an actionable handoff](#writing-an-actionable-handoff)
- [Choosing a record and sharing it](#choosing-a-record-and-sharing-it)
- [Reproducing the sample in Codespaces](#reproducing-the-sample-in-codespaces)
- [Handing off a bounded agent task](#handing-off-a-bounded-agent-task)

GitHub product instructions were checked against official documentation on October 7, 2026. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

## Writing an actionable handoff

**Starting point:** the [fictional transcript](../chapter-02/meeting-transcript.md) and category draft in [the backlog](../chapter-02/backlog.json). Reuse your category issue if you created it in Chapter 2. Otherwise, local notes are sufficient; no account is needed for this activity.

1. Read T5-T6 in the transcript. URL persistence and empty-result behavior are unanswered questions, not agreed requirements. T8 contains no release commitment.
2. Choose one question for a handoff. Identify the evidence, current state, person or role authorized to decide, and what the implementer should do afterward.
3. Include a response window only when it has been agreed. In solo practice, label a proposed owner or date as hypothetical rather than assigning a real person without agreement.
4. Ask a colleague to identify the requested action using only the note and its sources, or review it yourself later. Correct missing context without guessing the decision.

This constructed example preserves the open decision. Replace the Source line with your fork's actual issue URL when posting it:

```text
Decision needed: should the selected category survive a reload via the URL?
Source: this fork's category issue and transcript references T5-T6.
Current state: unresolved; no category implementation has started.
Options: keep the selection only in the page, or include it in URL state.
Decision owner: product-owner role in this fictional exercise.
Response window: to be agreed; no deadline has been committed.
Next action: record the choice and rationale, then update proposed checks.
The empty-result question remains unresolved too.
```

Keep the note locally or publish it only on the existing category issue in your fork, marked as exercise material. Do not create an implementation task, assign Copilot, or impersonate participants in the transcript. If you need the original issue setup, use the [Chapter 2 issue activity](../chapter-02/README.md#creating-and-organizing-the-issues).

**Expected result:** a request someone can understand without an initial meeting, with unknowns still explicit. **Return to the book:** continue with *Choosing GitHub collaboration surfaces*.

## Choosing a record and sharing it

**Starting point:** your handoff and an authorized place to discuss it. An existing fork-local issue is enough; you do not need to enable every product below.

### Keeping the question and answer discoverable

1. For the bounded category question, use the existing issue. If practicing a broader conversation, use Discussions only where it is available and you are authorized to enable it. In repository **Settings**, **General**, **Features**, enable **Discussions** if appropriate, then open **Discussions**, **New discussion**.
2. Choose an appropriate category and a title such as `Practice: sharing category-filter state`. Explain the alternatives and link the category issue in your fork. Keep it clearly fictional. Do not mark an answer simply to make the activity look complete.
3. Decide where an eventual agreement belongs. For this feature, update its issue description and link the supporting discussion. Keep one current requirement, not competing versions in both places.
4. Open the [sample README](../../README.md) and an existing guide. Consider whether an instruction needs to change in the same PR as the implementation. If so, repository documentation is a useful home.

If you want wiki practice, use a repository you control where **Wiki** is available. Check its editing permissions before choosing **New Page** or creating its initial page. Write a short page identifying the authoritative issue and source documentation, preview it, and use **Save Page** with a meaningful edit message. This saves to the wiki's separate history, not to an application PR. Do not copy an entire guide into a second authoritative location. See [editing wiki pages](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages).

### Sharing a link without duplicating the decision

Draft a short message that identifies the question, links the original record, and asks for the reply there. Send it only through an approved channel. A local unsent draft is a valid alternative.

For optional **GitHub Mobile** practice, use the official iOS or Android app, sign in to the intended account, and open the same issue. Inspect the question and notification settings. A short clarification can be posted there, but do not approve a PR that needs evidence you cannot inspect on the device. See [GitHub Mobile](https://docs.github.com/en/get-started/using-github/github-mobile).

For **Slack or Teams**, first check whether an approved GitHub integration already exists. Do not install a second app or extend repository access for practice. If installation is authorized, follow the current official [Slack](https://docs.github.com/en/integrations/how-tos/slack/integrate-github-with-slack) or [Teams](https://docs.github.com/en/integrations/how-tos/teams/integrate-github-with-teams) instructions, including account connection and app permissions. The Teams instructions currently include a client developer-preview prerequisite.

Choose a disposable channel with the intended audience, subscribe only to useful events from the practice repository, and use the installed app's help to confirm its current commands. Inspect one notification or link preview, including what information it exposes. Remove the practice subscription afterward. Do not send a task or agent mention merely to test notifications: current integrations can start agent work.

### Optional Pages publication

Skip this extension unless you are authorized to publish fictional material on the public internet. Use a **dedicated public practice repository**, such as `async-docs-practice`, with no existing application, internal files, or Pages site. Do not change this catalog's deployment settings or expose a private repository as an experiment.

1. Create that repository under your own account, with a README identifying it as disposable exercise material. Check the owner and public visibility before creation.
2. Use **Add file**, **Create new file** to add `index.md` at its root with the short text below. Commit it to the practice repository's default branch. These direct commits are confined to the disposable publication exercise, not a replacement for the team's normal review policy.

The page deliberately describes the feature as a proposal:

```markdown
# Tailwind Gears planning practice

This is fictional exercise documentation, not a running shop.
Category filtering is a proposal, not an implemented feature.
URL persistence and empty-result behavior remain open questions.
No release date, deployment, or customer acceptance is claimed.
```

Review every file in the publishing source before enabling Pages. Then complete publication and cleanup:

1. Open **Settings**, **Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the default branch and **/(root)**, and save.
2. Inspect the publishing workflow result. Open the site URL shown in Pages settings rather than guessing it. Confirm the page appears, links work, and it makes no claim that category filtering is implemented.
3. Check the public page while signed out. This is intentionally public practice content; repository visibility must not be used as evidence that a Pages site is private.
4. In Pages settings, use the menu beside the live-site message and choose **Unpublish site**. Verify the current deployment is no longer available. Do not trigger another deployment or assume unpublishing removes the repository content or all publishing settings.

See [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [access control](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site), and [unpublishing](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site). Pages hosts this static text; it does not run the catalog's Express API. Do not add billing, a custom domain, or an organizational integration to finish this extension.

**Expected result:** one clear home for the question and decision, with links from any other surface you used. Record skipped products as skipped; publication and app installation are optional. **Return to the book:** continue with *Working in cloud development environments with Codespaces*.

## Reproducing the sample in Codespaces

**Starting point:** your fork and an approved Codespaces allowance. Check who pays, allowed machine types, and organization policy before creating compute. Use the [local setup](../../README.md#run-locally) instead if unavailable; the observation and handoff can be completed locally.

### Preparing a practice branch

Inspect the fork's branch and any existing dev-container configuration. Do not replace a maintained configuration with the example. If none exists, create a branch named `practice/ch04-codespaces` from your fork's intended `main` using the branch selector. Keep it separate from an unfinished search-fix PR.

On that practice branch, add `.devcontainer/devcontainer.json` with the following content using **Add file**, **Create new file**. Check the selected branch before committing:

```json
{
  "name": "Tailwind Gears",
  "features": {
    "ghcr.io/devcontainers/features/node:2": { "version": "24" }
  },
  "postCreateCommand": "npm ci",
  "forwardPorts": [5173]
}
```

The baseline does not already contain this file. Codespaces uses its default image here, adds the Node feature, and runs the installation after creation. Review these executable setup choices and package scripts before creating an environment. Do not grant production credentials or weaken an organization image policy. The [dev-container documentation](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/introduction-to-dev-containers) explains customization and rebuild behavior.

### Creating and checking the environment

1. From the selected branch in your fork, open **Code**, **Codespaces**, then the menu's **New with options**.
2. Confirm repository, branch, configuration, machine type, and the account paying for usage. Choose a permitted small machine suitable for this sample. Do not change spending controls just to remove a restriction.
3. Choose **Create codespace** and inspect setup completion. If setup fails, read the creation log and correct the environment problem before interpreting application checks.

In the codespace terminal, confirm its runtime and repository before continuing:

```sh
node --version
git remote -v
git status --short --branch
```

The example selects Node.js 24. Confirm the remote is your fork and the branch is the one you intended. If using the local alternative, first install dependencies following the root README. These commands are run separately so an expected exercise failure does not prevent later inspection:

```sh
npm ci
npm run check
npm run test:exercise
```

Normal tests and the build should pass. On the unchanged baseline, the exercise check should fail on uppercase search. On a correctly completed search-fix branch, it should pass. Do not change the application to make this environment activity green.

Before starting the development server in the Codespaces Bash terminal, allow its exact preview hostname. Vite otherwise rejects a request carrying that forwarded hostname. These [GitHub-provided variables](https://docs.github.com/en/codespaces/developing-in-a-codespace/default-environment-variables-for-your-codespace) identify this environment; `:?` stops the setup if they are missing:

```sh
preview_host="${CODESPACE_NAME:?}-5173"
preview_host="${preview_host}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:?}"
export __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS="$preview_host"
npm run dev
```

For a local run, skip the hostname setup and use `npm run dev` normally. Do not set Vite's `allowedHosts` to `true` or allow the entire forwarding domain. If you deliberately use another port, update the exact hostname and forwarded port together. See [Vite's host controls](https://vite.dev/config/server-options#server-allowedhosts).

Open **Ports**, confirm port 5173 has **Private** visibility, and use its browser-opening control. Add the port if it is not automatically forwarded. Use the supplied remote URL, not a manually typed local address on your own machine. Never make the port public merely to avoid an access prompt. See [forwarding ports](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace).

Search for `Helmet`, then `HELMET`, and record the actual result together with your branch and command outcomes. A teammate needs that durable note, not just a temporary preview URL. This is not a deployment or a new search implementation.

### Preserving work and cleaning up

Stop the server with Ctrl+C. Check for changed files before closing the session:

```sh
git status --short --branch
git log -1 --oneline
```

The log identifies the current revision for inspection; the exercise does not require copying a hash into a separate record. If you intentionally changed a file, inspect it and commit and push it on the practice branch before relying on another environment. Do not discard uncommitted work or merge the configuration into `main` merely to finish this activity.

At [github.com/codespaces](https://github.com/codespaces), find the exact practice environment and choose **Stop codespace** from its menu. Confirm it is stopped. Closing a tab is not stopping, and stopping still retains storage. After preserving everything needed, use that environment's **Delete** action if you no longer need it. Do not delete other environments or bypass warnings about unpreserved work. See [stopping](https://docs.github.com/en/codespaces/developing-in-a-codespace/stopping-and-starting-a-codespace), [deletion](https://docs.github.com/en/codespaces/developing-in-a-codespace/deleting-a-codespace), and [billing](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces).

**Expected result:** a repeatable environment and recorded behavior for the selected branch, with the practice server stopped and cloud resources handled deliberately. **Return to the book:** continue with *Including coding agents as asynchronous contributors*.

## Handing off a bounded agent task

**Starting point:** your fork, capacity to inspect the result, and approved Copilot cloud-agent access. Codespaces and the earlier activities are not prerequisites. A manual documentation PR is a valid alternative, but should not be described as an agent run.

### Preparing the documentation issue

Search your fork's open and closed issues and PRs for `Document catalog behavior for the next maintainer` and check whether `docs/catalog-maintenance.md` already exists. Reuse suitable unfinished work. If the note is already complete, review it instead of creating a duplicate exercise or replacing the file without reason.

Otherwise, create a blank issue with that title and this description:

```markdown
## Outcome
Help the next maintainer locate catalog behavior and reproduce its checks.
## Scope
Add only docs/catalog-maintenance.md, with valid relative source links.
Describe current search, sorting, and stock behavior on the selected branch.
Use the catalog implementation, normal tests, and exercise check as evidence.
Explain normal verification versus the intentionally separate exercise check.
## Non-goals
Do not change code, tests, dependencies, workflows, or repository instructions.
Do not implement category filtering or fix the intentional search defect.
Do not merge the PR, publish a site, or claim another person's approval.
```

Add these acceptance and verification requirements beneath it before assigning anything:

```markdown
## Acceptance and verification
The note distinguishes current behavior from the desired case-insensitive fix.
Relative links open the relevant source and tests from the new note.
Run npm run check and npm run test:exercise; record actual results on the PR.
On the unfixed baseline, only the separate exercise failure is expected.
Report conflicting sources or unavailable checks instead of guessing.
Leave an open PR targeting this fork's main for human review.
```

Check the [repository instructions](../../.github/copilot-instructions.md), [catalog implementation](../../server/catalog.ts), [normal tests](../../tests/catalog.test.ts), and [exercise check](../../exercises/search.acceptance.ts). Those links show the baseline when viewed on the author's `main`; the proposed note must describe its own selected branch. Give the issue an accountable human coordinator, even if Copilot later implements it.

### Starting once and following the result

Check current [agent access](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), [billing](https://docs.github.com/en/copilot/concepts/billing-and-usage), and repository policy. Do not launch a task just to test whether a disabled control can be bypassed.

For the agent route, open the issue, choose **Assignees**, **Copilot**, and inspect the additional options. Confirm **your fork** and base **main**, review the available agent/model choices, and use this bounded optional prompt before completing assignment:

```text
Open a PR in this fork adding only docs/catalog-maintenance.md.
Describe this branch's current search, sorting, and stock behavior.
Use server/catalog.ts, tests/catalog.test.ts, and the exercise check as sources.
Explain which checks run normally and which exercise check may fail.
Link the relevant source files using valid relative paths.
Run npm run check and npm run test:exercise; report their actual results.
Do not change code, tests, dependencies, workflows, or repository instructions.
Do not implement category filtering or fix the intentional search defect.
If sources conflict or checks cannot run, report that instead of guessing.
Leave the PR open for human review; do not merge or publish a site.
```

Assignment starts execution. Mark the work In progress if you use a Project. Follow the resulting session and PR instead of launching another copy. From the [agents page](https://github.com/copilot/agents), open the session to inspect activity and results. If the task should stop, use **Stop session**; already pushed commits are preserved, so inspect them afterward. See [session management](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents).

Read proposed changes before **Approve and run workflows**, particularly workflow, dependency, or instruction-file edits that would be outside this task. Do not widen repository permissions to get a passing check. Send corrections through the existing PR's supported `@copilot` follow-up, or the session's steering control when appropriate. Later comments on the assigned issue are not automatically included; update its agreed scope as well. See [the cloud-agent workflow](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github).

For the **manual alternative**, use a clean clone of your fork. Check `git remote -v` and `git status --short --branch` first; stop if unrelated work would be displaced. Create a documentation branch from the intended `main`, write the same note, run the checks below, and commit and push only that file. Open a PR with your fork as base repository and `main` as base branch. Do not start the agent as well.

### Reviewing the current proposal

Inspect the changed-file list before running anything. For a received agent PR, verify a clean local worktree and the correct fork remote. Replace `YOUR-PR-BRANCH` with its actual head branch:

```sh
git fetch origin
git switch YOUR-PR-BRANCH
git pull --ff-only origin YOUR-PR-BRANCH
```

Stop on divergence or conflicts. A manual author already on the documentation branch does not need to switch. Check the current revision and record each command's actual result:

```sh
git status --short --branch
npm ci
npm run check
npm run test:exercise
```

The expected exercise failure on the baseline is evidence to explain, not authorization to fix search. An installation failure, normal-test failure, or build failure needs investigation. Inspect valid relative links from the proposed note and compare its claims with the actual implementation and assertions.

For an additional browser observation, run `npm run dev` locally, or use the exact-host setup in the Codespaces activity above before starting it remotely. Open the root README's local URL or the private Codespaces port, and compare the following cases. These are expectations, not recorded results from your PR:

| Input or control | Unfixed baseline | Correctly completed search fix |
| --- | --- | --- |
| `Helmet` | Ridge Helmet and Metro Helmet | Same two helmets |
| `HELMET` | No matches | Same two helmets |
| `" Helmet "` and `Hel` | Same two helmets | Same two helmets |
| Empty query, stock filter off | Eight products | Eight products |
| `Spaceship` | No matches | No matches |
| `Lock`, stock filter off then on | Loop Lock, then no matches | Same behavior |
| `Helmet`, price ascending | Metro Helmet before Ridge Helmet | Same ordering |

The quotation marks make surrounding spaces visible; do not type them. Stop the server with Ctrl+C afterward, and stop a codespace if you used one. Do not claim this observation unless you performed it.

Request corrections only for real issues. If no correction is needed, record what was checked and its limits. Follow [Chapter 3's review requirements](../chapter-03/README.md#reviewing-and-revising-a-change); author self-review is not independent approval. Leave the PR open for a deliberate merge or decline decision. If you later merge under the applicable policy, verify the rendered note and its links on the merged branch before closing the documentation task. No application deployment is part of this activity.

**Expected result:** a documented review of a bounded proposal, with actual checks, remaining questions, and the next human action recorded. **Return to the book:** continue with *Summary*.
