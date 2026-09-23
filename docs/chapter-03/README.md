# Chapter 3: from a pull request to a verified change

Continue with the case-insensitive search pull request from [Chapter 2](../chapter-02/README.md). Review and merge it into **your fork's `main`**, never the author's intentionally unfixed baseline. Category filtering remains separate work.

## Check the starting point

Use the [root setup instructions](../../README.md#run-locally) and the starting commit you recorded in Chapter 2. You need your search issue, its acceptance criteria, and a proposed fix on a branch in your fork. If you skipped implementation, complete that part of Chapter 2 first; Copilot is optional.

1. Inspect the PR's base repository and branch. They must be your fork and `main`.
2. Read the linked issue, description, changed files, and existing review threads. Keep the PR in draft while implementation or its test evidence is incomplete.
3. Confirm that the change is limited to product-name matching and regression tests. Investigate changes to workflows, instructions, dependencies, or unrelated features before executing anything.
4. Identify the latest head commit. Associate test results with that commit, not an earlier revision.

For independent human review, ask another eligible person to review the PR. GitHub does not let you approve your own PR; its review documentation also restricts approval of a Copilot PR by the person who assigned Copilot to the related issue. A solo reader can inspect, comment, test, and make a merge decision where repository policy permits, but must record this as a self-review. Do not bypass required reviews or invent a second identity.

## Inspect behavior and evidence

Read [the matching implementation](../../server/catalog.ts), [normal regression tests](../../tests/catalog.test.ts), and [the exercise check](../../exercises/search.acceptance.ts). Follow the changed code into its surrounding function, including trimming, stock filtering, and sorting.

| Check | Expected result after the fix |
| --- | --- |
| `Helmet`, `HELMET`, `helmet`, `HeLmEt`, and ` Helmet ` | Ridge Helmet and Metro Helmet, in featured order |
| `helm` | The same two helmets through partial matching |
| Empty or whitespace query | All eight products before stock filtering |
| `Spaceship` | No matches |
| `LOCK` with in-stock filtering | No matches; Loop Lock is out of stock |
| Helmets sorted by ascending price | Metro Helmet before Ridge Helmet |

Inspect the new assertions, not just the test count. The normal suite must gain case-insensitive regression coverage. Do not delete or weaken the separate exercise check. Compare its failure on the recorded baseline in a separate clone if you need to reproduce it; do not reset existing work.

After inspecting the proposed code and scripts, check out the PR's head branch in your fork clone. With a clean working tree, fetch from your fork and switch to that branch; use `git pull --ff-only` if an existing local branch needs updating. If Git reports divergence or local changes, stop and resolve them without discarding work. Confirm the branch and commit before running:

```sh
git status --short --branch
git rev-parse HEAD
npm ci
npm run check
npm run test:exercise
npx playwright install chromium
npm run test:e2e
```

`check` runs normal tests and the production build; it excludes the intentional exercise check and browser tests. Playwright uses the built app on port 5199. All three checks must pass for the fixed PR. Record actual outcomes and any environment limitations. A failure on the unchanged baseline is expected only for `test:exercise`.

## Give feedback and review revisions

In **Files changed**, attach feedback to the relevant lines. State the input, observed or predicted behavior, and the requirement it affects. Distinguish a blocking defect from a question or optional suggestion. Submit pending review comments so the author can see them.

Only request changes supported by the actual diff. If it is already correct, do not add a defect just to manufacture a review conversation. A clearly labeled hypothetical example can be discussed without changing code or posting it as a real finding.

After a revision, inspect the updated diff and rerun the checks above on the new commit. Resolve a thread after verifying the concern was addressed, or record why no change is needed. A resolved thread alone is not proof of a fix.

## Use Copilot optionally

Check your account's feature access, repository policy, and usage allowance before requesting AI work. Keep the human-only path if the feature is unavailable; do not change subscriptions or permissions to finish the lab.

- For a summary, use the Copilot action in a **new, unsent PR comment**. The [summary documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-for-common-tasks/create-a-pr-summary) describes the current control. Preserve the existing PR description. Compare the generated text with the issue, diff, and test results; add missing intent and correct unsupported claims before posting.
- For review, request **Copilot** under **Reviewers**, following the [code review documentation](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review). Inspect each finding and any suggested patch before applying it. No findings is also a possible result.
- Check the existing [repository instructions](../../.github/copilot-instructions.md). The intentional baseline defect is not a reason to reject the explicitly assigned search fix. Category filtering is still outside the issue.
- After changes, request re-review unless your configured automatic-review policy covers new pushes. Replies to code-review comments are not instructions to the implementation agent.

As of September 23, 2026, GitHub documents optional Copilot approvals in public preview, disabled by default. Do not enable them for this exercise. An AI approval assessment or approving review does not provide the independent human review described above. Recheck documentation before applying this workflow elsewhere.

## Merge and verify the result

Review the final revision, required checks, and unresolved concerns together. A reviewer should approve only work they can justify from that evidence. If repository policy blocks merging, satisfy it rather than bypass it.

1. Confirm the base is still your fork's `main`. Choose a permitted merge method; squash merge is suitable for this single-purpose exercise when enabled. Preserve the issue link and a meaningful commit message.
2. Merge only when the applicable review and check requirements are satisfied. Keep the issue's Project status unfinished until built-app verification, even if GitHub closes the issue automatically.
3. In your fork clone, with no uncommitted work, update `main` and build the merged version:

```sh
git switch main
git pull --ff-only origin main
git rev-parse HEAD
npm ci
npm run build
npm start
```

Open <http://localhost:5173> and repeat the behavior checks in the table. See the root README for an alternate port if needed. Record the merged commit, commands, observed browser results, and remaining limitations. Stop the server with Ctrl+C when finished.

Move the search issue to **Done** only after recording successful verification and satisfying the review policy. State explicitly if this was a solo self-review. This local exercise establishes neither production deployment nor acceptance on behalf of another person. Leave the category feature in Backlog while its product decisions remain open.
