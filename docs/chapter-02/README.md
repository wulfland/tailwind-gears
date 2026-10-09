# Chapter 2: optional planning exercises

You can read the chapter without doing these activities. This guide provides the complete browser-side path, with starting points, steps, expected results, and places to resume reading. Product data, issue drafts, and meeting dialogue are fictional, not customer evidence.

Keep issues, branches, and pull requests in **your fork**. The implementation target is **your fork's `main`**, never the author's intentionally unfixed baseline. Copilot is optional; manual alternatives use the same requirements.

Choose the activity that matches the chapter section:

- [Forking and exploring the sample](#forking-and-exploring-the-sample)
- [Defining the workflow and WIP policy](#defining-the-workflow-and-wip-policy)
- [Creating and organizing the issues](#creating-and-organizing-the-issues)
- [Planning with a Project](#planning-with-a-project)
- [Preparing work with Copilot](#preparing-work-with-copilot)
- [Handing off the search fix](#handing-off-the-search-fix)

## Forking and exploring the sample

**Starting point:** a GitHub.com account, Git, Node.js 24 LTS, and npm. No database, cloud account, or AI subscription is needed. Use the [root README](../../README.md#run-locally) for platform-specific setup and alternate ports.

1. Open [wulfland/tailwind-gears](https://github.com/wulfland/tailwind-gears), select **Fork**, and choose your account as **Owner**. Keep the name `tailwind-gears`; copying the default branch is sufficient. Select **Create fork**.
2. In your fork, open **Settings**, **General**, and enable **Issues** under **Features** if necessary. The fork copies code and history, not the author's issues or a configured Project.
3. Open **Code** in your fork and check its clone URL. Replace `YOUR-USERNAME` below with your account, and adjust the repository name if you changed it.

Run these commands to clone your fork, inspect its remote, install dependencies, and start the sample:

```sh
git clone https://github.com/YOUR-USERNAME/tailwind-gears.git
cd tailwind-gears
git remote -v
npm ci
npm run dev
```

Confirm `origin` points to your fork. Open <http://localhost:5173>, browse the eight products, and open a product's details. Search for `Helmet`: Ridge Helmet and Metro Helmet appear. Replace it with `HELMET`: no products appear. That is the intentional defect. Stop the server with Ctrl+C when finished.

Check the baseline separately from its missing behavior:

```sh
npm run check
npm run test:exercise
```

The normal tests and production build in `check` should pass. `test:exercise` should fail on uppercase search. Do not weaken or remove it; an installation or build failure is not the intentional defect. Resolve setup problems before proceeding.

Your fork is public. Use only the fictional sample and approved notes, never credentials, customer information, company code, or real transcripts. Use an approved independent private repository if organizational policy requires private practice. A private Project does not make public issues private. GitHub's [forking guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo) covers authentication help.

**Expected result:** a working local sample with the search defect reproduced and the code unchanged. **Return to the book:** continue with *Making work visible and limiting WIP*.

## Defining the workflow and WIP policy

**Starting point:** the two sample requests: `Make product search case-insensitive` and `Filter products by category`. You can do this activity in notes without a fork or Project.

1. Write down **Backlog**, **Ready**, **In progress**, **Review**, and **Done** as the example states. Backlog holds unresolved work; Ready requires an understood result and a way to check it.
2. Define Done for the search change as reviewed, passing checks, and verified in the built application after merge. Investigations finish when their agreed result is recorded. Production deployment and acceptance require a real service's separate policy.
3. Record example team limits of two items in progress and one in review. Include blocked and agent work. Working alone, start only one implementation item at a time; limits are ceilings, not targets.
4. Decide what happens when review is full: help inspect or finish existing work before another start. A blocked item retains its state and needs a reason, a person who can help, and a next follow-up.
5. Consider a fictional interruption after implementation has started: a visitor cannot find a helmet using uppercase search. Reproduction identifies the existing bug. Decide whether a link is enough or a separately tracked investigation is needed. Do not create another implementation task or present the scenario as a real support report.

Keep these notes for the Project README. If you later track the constructed investigation separately, use `Investigate uppercase search report`, label it `unplanned`, identify it as exercise data, and link the existing bug. Its outcome is a diagnosis and link, not a second delivered fix.

**Expected result:** a short workflow policy, with readiness, completion, interruptions, and review capacity explained. No implementation has started in this activity. **Return to the book:** continue with *Working with issues, labels, and milestones*.

## Creating and organizing the issues

**Starting point:** your fork, enabled Issues, and the reproduced defect. Reuse existing practice issues. Choose manual creation below or the optional seeding method, not both; neither should assign Copilot.

### Creating the two descriptions

In your fork, choose **Issues**, **New issue**, then **Bug report**. Set the title to `Make product search case-insensitive`. Enter this text in **Observed and expected behavior**:

```markdown
## Problem
Product search gives different results depending on letter case.
## Steps to reproduce
1. Run npm run dev and open http://localhost:5173.
2. Search for Helmet. Ridge Helmet and Metro Helmet appear.
3. Replace the search text with HELMET. No products appear.
## Expected behavior
Both searches should return the same two helmets.
The fix should not add category filtering or change other catalog behavior.
```

In **Acceptance checks**, enter the behavior to preserve along with the case-insensitive requirement:

```markdown
- Helmet, HELMET, helmet, and HeLmEt find the same two helmets.
- Partial names and searches with surrounding spaces still work.
- Empty search returns all products; unknown names return none.
- Existing sorting and stock filtering still work.
```

Review the text against your observation and submit it. Assign the bug to yourself under **Assignees** to coordinate its next action; do not assign Copilot yet.

Create a second, blank issue titled `Filter products by category`. Use this description:

```markdown
## Outcome
Let visitors filter products by Protection, Accessories, or Bags.
## Proposed behavior
- Show all categories initially; let the visitor select one category.
- Keep search, sorting, and stock filtering working together.
- Update the result count and support keyboard and mobile use.
## Open questions
- Should the selected category be saved in the URL?
- Should categories with no matching results remain selectable?
## Non-goals
Do not add checkout, accounts, or category administration.
Keep the search bug separate. No release date has been agreed.
```

Submit it with the questions still open and Copilot unassigned. Record the issue URLs for the Project. GitHub assigns numbers separately in each fork; use the titles to identify them.

### Adding classification and inspecting the form

Under **Issues**, **Labels**, create `catalog` and apply it to both issues. Create `Catalog discovery` through **Issues**, **Milestones**, **New milestone**, leave the due date unset, and select it in each issue sidebar. This groups the work without committing the feature to a release date. In an organization repository, use an available issue Type; do not duplicate it in a custom Project field.

For optional form practice, inspect the existing [issue templates](../../.github/ISSUE_TEMPLATE). Open an unsent Bug report and confirm a required field prevents empty submission, then cancel it rather than creating a duplicate. The real bug already shows how completed fields become a description. Review template changes through the normal PR process; the book's short YAML example does not require another template.

### Practicing relationships when useful

A solo category change can remain one issue. For the expanded teaching example, suppose another person will perform independent keyboard and mobile acceptance review:

1. Open the feature and use **Create sub-issue**, or **Add existing issue** in the adjacent menu. Give implementation with regression tests and the independent acceptance review separate results. Do not create a separate "write tests" handoff.
2. If the product decision needs its own owner or follow-up, create `Decide category URL and empty-result behavior`. Otherwise keep the decision in the feature discussion.
3. In the implementation child's **Relationships**, choose **Mark as blocked by** and select that decision issue. Confirm implementation waits for the decision, not the reverse. Record other genuine dependencies separately from the parent relationship.
4. Label only the feature parent `outcome` if you use this expanded structure. The Project's execution view will exclude that container while counting its children. Leave unresolved implementation unstarted.

GitHub documents [sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues) and [blocking relationships](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies) separately. Do not add tracking solely to fill the board.

### Seeding instead of manual creation

The optional script uses the drafts in [backlog.json](backlog.json). After `npm ci`, replace the target below with your fork. This first command only prints drafts and the destination; it makes no GitHub requests:

```sh
npm run seed:issues -- YOUR-USERNAME/tailwind-gears
```

Inspect the output and confirm your fork. With GitHub CLI installed and authenticated with issue-write access, explicitly create the issues:

```sh
npm run seed:issues -- YOUR-USERNAME/tailwind-gears --apply
```

The script creates two unassigned issues, without launching an agent or configuring Projects. Stable markers prevent duplicates among its seeded open and closed issues; it cannot identify manually created copies without those markers. It never overwrites reader edits. After seeding, apply the metadata above and assign yourself to coordinate the bug. Never seed into the author's repository.

**Expected result:** two distinct issues with shared classification and explicit unknowns, plus only the optional relationships you chose to practice. **Return to the book:** continue with *Planning with GitHub Projects today*.

## Planning with a Project

**Starting point:** your issue URLs and workflow notes. This activity creates a private user Project; use an authorized organization Project if practicing with a team. Repository and Project permissions remain separate.

### Creating the queue and board

1. From your profile or organization page, open **Projects**, **New project**. Choose **Table** under **Start from scratch**, name it `Tailwind Gears catalog`, and leave repository-wide import off.
2. Open project **Settings**, confirm private visibility, and describe the intended catalog outcome. In its README, record your ready/done definitions, WIP policy, and who makes priority decisions. Save the changes.
3. Return to the table and paste each existing issue URL into the add-item row, pressing Return after each. Check that titles open issues in your fork, not project-local drafts. Add optional investigation, decision, or child issues only if you created them.
4. Use the plus control beside the field headers to show **Status**, **Assignees**, and **Labels**. Edit Status to contain **Backlog**, **Ready**, **In progress**, **Review**, and **Done**. Add a **Single select** field named `Priority` with High, Medium, and Low.
5. Name the table view `Backlog`, group it by Priority through **View options**, and save. Choose priorities deliberately; priority alone does not establish readiness. Put the reproduced search issue in Ready and the unresolved category feature in Backlog.
6. Create a **New view**, select **Board** through **View options**, name it `Team flow`, and set **Column by** to Status. Show assignees and labels. Leave it unfiltered for the two-issue exercise.
7. If using the expanded hierarchy, add its children by URL, label only the feature parent `outcome`, and use `-label:outcome` in Team flow. Keep the parent's true status visible in the unfiltered Backlog table. Do not hide execution children or support work.
8. Open each relevant column menu and use **Set column limit**: `2` for In progress, `1` for Review. Move search temporarily to In progress and check its table status changes too. Then put two items in Review and observe the warning; GitHub still permits the move.

Restore search to Ready and the feature to Backlog, and save the view. These moves test the interface; they do not start implementation. The limits belong to this view and do not enforce the policy. Remove temporary `assignee:@me` or `label:unplanned` filters before checking team WIP. A sort controls displayed ordering; remove it when testing manual order. See the [board controls](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout).

### Testing administrative automation

Open **Workflows** in the project menu. Disable rules that mark closed items or merged PRs Done: this lab requires later built-app verification. Leave any issue-closing rule disabled unless deliberately agreed. Use one clearly labeled disposable issue to test the remaining behavior:

1. Select **Auto-add to project**, **Edit**, and your fork. Set `is:issue is:open label:catalog`, then **Save and turn on workflow**. This does not import existing matching issues, which you added explicitly.
2. Configure **Item added to project** to set Backlog and enable it. Create an issue titled `Practice: Project automation check`, identify it as disposable exercise data, apply `catalog`, and leave Copilot unassigned. Confirm it appears once with Backlog status.
3. Close the practice issue, set its Project status to Done, and reopen it. Observe the status rather than assuming open/closed state and Project Status are the same.
4. Decide whether the available reopen workflow should return items to Backlog. Configure it if that matches your policy, repeat the close/Done/reopen check, and verify the result.
5. Close and remove the disposable item from the Project. Recheck that search is Ready and the category feature is in Backlog.

Check the documented [auto-add filters and plan allowances](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically) and [built-in rules](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations) if controls differ. If a rule is unavailable, record that limitation and perform the update manually; do not change subscriptions to complete the activity. Leave auto-archive disabled until you have a retention policy.

### Inspecting the queue and optionally adding dates

Open **Insights** from its chart control. Create and save a current item-count chart grouped by Status, with Team flow's filter: none for two issues, or `-label:outcome` for the expanded hierarchy. Check the items behind the counts. This small backlog cannot establish a trend, and archived/deleted items are excluded from Insights.

For optional scheduling practice:

1. Add an **Iteration** field named `Iteration` with a two-week duration. Assign the ready search issue to the current period, leaving the unresolved feature unassigned.
2. Create a `Current iteration` view using `iteration:@current`. Compare it with the complete board; earlier unfinished items can disappear from this filtered view without being complete.
3. Add date fields `Start date` and `Target date`. Create a roadmap view named `Delivery outlook`, select those fields under **Date fields**, and use the month scale. Add milestone markers if useful.
4. Use clearly hypothetical dates to observe how a bar changes the underlying fields. Clear them afterward; do not turn the unresolved feature into a delivery commitment.

The [roadmap documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-roadmap-layout) explains the controls. Jira and Azure Boards connections discussed in the chapter are not required for this activity; do not enable an organizational integration for practice without authorization.

**Expected result:** linked table and board views, a tested WIP warning, checked automation, and a current chart. The search issue is ready, not started; category decisions remain open. **Return to the book:** continue with *Using Copilot to draft, summarize, and break down work*.

## Preparing work with Copilot

**Starting point:** the category issue and [fictional transcript](meeting-transcript.md). Check account access, repository policy, and usage allowance before using [Copilot Chat on GitHub.com](https://github.com/copilot). You can prepare the same notes manually. No Teams subscription or real meeting is needed.

### Reviewing notes, a description, and a summary

Supply T1-T8 to Chat using approved text if the file cannot be retrieved. Start with a request that does not authorize publication:

```text
Use only T1-T8 to prepare notes for the category-filter issue.
Separate decisions, proposals, open questions, and next actions.
Cite the transcript reference supporting each statement.
Do not invent an owner, deadline, or answer to an open question.
Keep the independent search bug separate.
Return text only. Do not create issues or start implementation.
```

Compare every statement with its reference. T3 agrees on existing categories and combined controls; T4 separates search; T5-T6 leave URL persistence and empty-result behavior unresolved; T8 gives non-goals and no release date. Correct errors before the next request.

Provide the reviewed notes and the existing feature issue's URL for a description draft:

```text
Draft an updated description for this existing category-filter issue.
Use only the supplied issue and reviewed T1-T8 notes.
Separate outcome, proposed acceptance checks, unknowns, and non-goals.
Give a source reference for each requirement; identify unsupported proposals.
Keep the search bug separate and the release date unset.
Return text only; do not publish or assign work.
```

Check whether the draft invents URL persistence, disables empty categories, includes the search fix, or promises the next iteration. Reject those claims. Proposed checks remain proposals until accepted by the responsible person.

Practice a short summary using the same source, without posting fictional comments to impersonate a live discussion:

```text
Summarize the supplied T1-T8 discussion in a short planning update.
Separate decisions, proposals, open questions, and next actions.
Retain supporting T references and label this a fictional-transcript summary.
Do not describe it as the issue's complete history or publish anything.
```

For real issue threads, use links to supporting comments instead of T references, verify that they support the statements, and label excerpt-only summaries accordingly. Do not upload a real internal transcript to the public fork.

### Reviewing a breakdown and publishing an update

Use the corrected description to request a bounded proposal:

```text
Propose the smallest useful breakdown of this category feature.
Give each child an acceptance result and state any blocking dependencies.
Keep implementation and regression tests together.
Reuse existing issues; keep the independent search fix separate.
Explain whether a solo implementation needs children at all.
Return a proposal only; do not create or assign issues.
```

Inspect the proposal before publishing. A separate acceptance review is useful when another person needs to coordinate it; "write code" and "write tests" need not be different issues. Reuse a decision issue if one exists. To practice Copilot's parent/sub-issue draft, confirm the existing parent and target fork before **Review and create** and **Create issues**. Check duplicates and metadata, then verify blocking relationships separately. Use the manual relationship steps above if the feature is unavailable.

For the description update, supply the corrected text and request an update to the existing category issue in `YOUR-USERNAME/tailwind-gears`, replacing the owner and issue number with your own. Ask to change only its description. Inspect the workbench repository, number, title, labels, type, and assignees; remove unintended changes. Choose **Update** only after that review. Reopen the issue and compare the saved text, Project membership, and status with what you approved.

If the preview is unavailable, edit the existing issue manually. Do not create another issue or assign Copilot during planning. Leave the feature in Backlog with its product decisions open. GitHub's [creation and update guide](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/use-copilot-to-create-or-update-issues) documents the confirmation controls.

**Expected result:** checked planning text that distinguishes agreement from proposals, without invented scope or implementation starts. **Return to the book:** continue with *Assigning ready issues to the Copilot agent*.

## Handing off the search fix

**Starting point:** the reproduced search issue, agreed acceptance checks, and capacity for implementation and review. Copilot planning practice is not a prerequisite. The category feature remains separate work.

### Preparing the implementation context

Review the [repository instructions](../../.github/copilot-instructions.md) and CI workflow. Enable Actions in your fork if GitHub requires it, but do not broaden token permissions merely to make checks run. The intentional bug may be fixed only because this issue explicitly requests it.

Append this context to the search issue description:

```markdown
## Implementation context
Product-name matching is in server/catalog.ts.
Add permanent regression coverage in tests/catalog.test.ts.
Limit changes to matching and its tests; do not add dependencies.
Keep exercises/search.acceptance.ts: it must pass after the fix.
## Verification
Run npm run check and npm run test:exercise.
Install Chromium with npx playwright install chromium.
Then run npm run test:e2e.
```

Check it against the existing requirements and save. [Matching](../../server/catalog.ts), [normal tests](../../tests/catalog.test.ts), and [the exercise check](../../exercises/search.acceptance.ts) are separate inspection targets. These links show the baseline on `main`; inspect the proposal's own branch when work begins.

Use this handoff for either implementation route:

```text
Implement "Make product search case-insensitive" in this fork.
Reproduce the failure with npm run test:exercise.
Limit changes to server/catalog.ts and regression tests.
Preserve partial matching, whitespace trimming, sorting, and stock filtering.
Do not add dependencies or implement category filtering.
Add permanent coverage in tests/catalog.test.ts; keep the exercise check.
Run npm run check and npm run test:exercise.
Install Chromium with npx playwright install chromium, then run npm run test:e2e.
Report tests run, results, and anything you could not verify.
Ask for clarification if the issue and existing behavior conflict.
```

Choose one route below, not competing human and agent implementations of the same issue.

### Assigning the agent or working manually

For Copilot, check [current eligibility, policy, and billing](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Confirm write access, repository enablement, usage allowance, and review capacity. Do not alter subscriptions or permissions simply to unlock a control.

1. Open the search issue from Team flow or the repository, and read its current description and comments.
2. Under **Assignees**, select **Copilot** and inspect the additional options. Confirm the target is your fork and base `main`, not `wulfland/tailwind-gears`.
3. Enter the handoff under **Optional prompt**, review available agent/model options, and complete assignment. This starts execution. Confirm the assignment and resulting work link, then set the issue to In progress.
4. Inspect the resulting PR's destination and files. Later issue comments are not automatically picked up; put corrections on the PR, mentioning `@copilot` when requesting an implementation change, and update the issue's agreed scope too.

The [assignment documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) covers the current preview interface. Inspect changes before **Approve and run workflows**, especially changed workflows; check the repository's policy rather than treating agent-reported results as required CI checks.

For the **manual alternative**, first check your clone:

```sh
git remote -v
git status --short --branch
```

Confirm `origin` is your fork and the working tree is clean before switching. Stop on local changes; do not discard existing work. If you already have an implementation branch, continue there. For a new implementation, update your fork's `main`, then create the branch:

```sh
git switch main
git pull --ff-only origin main
git switch -c fix/search-case-insensitive
```

Stop if the pull reports divergence. Set the issue to In progress, reproduce the acceptance failure, and implement the handoff. Keep displayed product names unchanged, and add the new coverage to the normal test suite.

### Checking the proposal and leaving it for review

Inspect changed code and scripts before executing them in an approved environment without production credentials. For an agent-created PR, check that your local working tree is clean and `origin` is your fork as above. Replace `YOUR-PR-BRANCH` with the head branch shown on the PR, then fetch and check out that proposal:

```sh
git fetch origin
git switch YOUR-PR-BRANCH
git pull --ff-only origin YOUR-PR-BRANCH
```

Stop on divergence or conflicting work. For a manual change already on its implementation branch, no switch is needed. Run these checks on the proposed version, not the unfixed baseline:

```sh
git status --short --branch
npm ci
npm run check
npm run test:exercise
npx playwright install chromium
npm run test:e2e
```

The normal suite and production build run before browser tests, which use port 5199. All checks should pass after the fix. Inspect the assertions rather than accepting a test count: case variants, padded and partial input, empty and unknown searches, sorting, stock filtering, and preserved displayed names must remain covered. Keep the exercise check intact. Record real results and anything unverified.

For a manual implementation, inspect the diff and publish only the matching change and regression tests:

```sh
git diff --check
git diff -- server/catalog.ts tests/catalog.test.ts
git add server/catalog.ts tests/catalog.test.ts
git commit -m "Fix case-insensitive product search"
git push -u origin fix/search-case-insensitive
```

Use your actual branch name if different. In your fork, choose **Pull requests**, **New pull request**. Confirm the **base repository is your fork**, base branch `main`, and head your implementation branch. Link the search issue, describe unchanged behavior, and record actual checks and limitations. Keep incomplete work in draft. For the agent route, use its existing PR instead of creating another.

Move the issue to Review when the proposal and evidence are ready, not merely when a PR URL appears. Leave it open and unmerged for the [Chapter 3 activities](../chapter-03/README.md#preparing-a-pull-request). Those continue through appropriate review, merge, updating local `main`, and built-app verification before Done. Neither a merge nor this lab establishes production deployment or customer acceptance.

To revisit the defect later, use a separate clone of the author's unchanged baseline for comparison, rather than resetting your work. Keep new changes in your fork. The author's merged demonstration uses a separate demo base and does not change the reader's merge destination.

**Expected result:** an open, reviewable search-fix PR targeting your fork's `main`, with recorded checks and limitations; the category feature remains in Backlog. **Return to the book:** continue with *Summary*.
