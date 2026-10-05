# Chapter 3: optional collaboration exercises

The chapter's explanations and illustrated examples can be read without doing these activities. Use this guide when you want to work through them in the browser. Each activity includes its starting point, steps, expected result, and the place to resume reading.

Continue with the case-insensitive search proposal from [Chapter 2](../chapter-02/README.md). Your review and merge target is **your fork's `main`**, never the author's intentionally unfixed baseline. Category filtering remains separate work.

For a read-only example, [the author's PR #4](https://github.com/wulfland/tailwind-gears/pull/4) contains a [diff](https://github.com/wulfland/tailwind-gears/pull/4/files), [AI-assisted author self-review](https://github.com/wulfland/tailwind-gears/pull/4#pullrequestreview-5377207888), [actual Copilot review](https://github.com/wulfland/tailwind-gears/pull/4#pullrequestreview-5377166769), and [post-merge verification](https://github.com/wulfland/tailwind-gears/pull/4#issuecomment-5928746643). The author owns the source repository, so that demonstration uses the separate base `book-demo/chapter-02` to preserve `main`. Readers should still use their own forks. The recorded self-review is not independent human approval.

Choose the activity that matches the chapter section:

- [Preparing a pull request](#preparing-a-pull-request)
- [Reviewing and revising a change](#reviewing-and-revising-a-change)
- [Summarizing and pre-reviewing with Copilot](#summarizing-and-pre-reviewing-with-copilot)
- [Merging and verifying the change](#merging-and-verifying-the-change)

## Preparing a pull request

**Starting point:** your fork and clone, the search issue and its acceptance criteria, and a proposed fix on a branch. Use the [root setup instructions](../../README.md#run-locally). Complete Chapter 2's implementation handoff first if needed; Copilot is optional.

1. Check that your clone's `origin` is your fork using `git remote -v`. Run `git status --short --branch` before switching branches; do not discard local work to follow the activity.
2. Open your existing search PR. If you have not created one, open **Pull requests**, choose **New pull request**, and set the base repository to your fork, the base branch to `main`, and the head to your implementation branch. Inspect the comparison before creating it.
3. Read the linked issue and changed-file list. The matching fix belongs in [server/catalog.ts](../../server/catalog.ts), with permanent regression coverage in [tests/catalog.test.ts](../../tests/catalog.test.ts). Investigate workflow, instruction, dependency, or unrelated feature changes before executing the branch.
4. Write a description explaining the failed input, intended result, unchanged behavior, actual command results, and known limitations. Link the search issue. Keep incomplete work in draft; do not copy passing results from the author's PR.
5. When the work is ready, choose **Ready for review**, request an appropriate reviewer, and move the Project item to **Review** if you are using the Chapter 2 board. GitHub's [PR stage guide](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request) describes the draft controls.

For independent human review, ask another eligible person to review the PR. GitHub does not let you approve your own PR; its review documentation also restricts approval of a Copilot PR by the person who assigned Copilot to the related issue. A solo reader can inspect, comment, test, and make a merge decision where repository policy permits, but must record this as a self-review. Do not bypass required reviews or invent a second identity.

**Expected result:** one reviewable PR in your fork, with its issue, purpose, evidence, and limitations visible. **Return to the book:** continue with *Running effective code reviews at scale*.

## Reviewing and revising a change

**Starting point:** the reviewable search PR from the previous activity. Use the PR branch and GitHub check details to follow revisions; results for an earlier version do not establish the current proposal.

Read [the matching implementation](../../server/catalog.ts), [normal regression tests](../../tests/catalog.test.ts), and [the exercise check](../../exercises/search.acceptance.ts). Follow the changed code into its surrounding function, including trimming, stock filtering, and sorting.

The links above show this repository's baseline when viewed on `main`. In your fork's **Files changed** tab, inspect the proposed implementation and assertions. Use these expected results to assess the fixed branch:

| Check | Expected result after the fix |
| --- | --- |
| `Helmet`, `HELMET`, `helmet`, `HeLmEt`, and `" Helmet "` | Ridge Helmet and Metro Helmet, in featured order |
| `helm` | The same two helmets through partial matching |
| Empty or whitespace query | All eight products before stock filtering |
| `Spaceship` | No matches |
| `LOCK` without the stock filter | Loop Lock |
| `LOCK` with in-stock filtering | No matches; Loop Lock is out of stock |
| Helmets sorted by ascending price | Metro Helmet before Ridge Helmet |

The quotation marks around the padded query make its spaces visible; do not type the quotation marks.

Inspect the new assertions, not just the test count. The normal suite must gain case-insensitive regression coverage, and displayed product names must retain their capitalization. Do not delete or weaken the separate exercise check. Use a separate clone of the unchanged baseline for a before-and-after comparison; do not reset existing work.

After inspecting the proposed code and scripts, use an approved environment without production credentials. With a clean working tree, fetch from your fork and switch to the PR's head branch. The following commands use `YOUR-PR-BRANCH` as a placeholder; replace it with the head branch shown on your PR:

```sh
git fetch origin
git switch YOUR-PR-BRANCH
git pull --ff-only origin YOUR-PR-BRANCH
```

Stop if Git reports divergence or conflicting work. Confirm the branch, then run these checks from the repository root:

```sh
git status --short --branch
npm ci
npm run check
npm run test:exercise
npx playwright install chromium
npm run test:e2e
```

`check` runs normal tests and the production build; it excludes the intentional exercise check and browser tests. Playwright uses the built app on port 5199. All three checks must pass for the fixed PR. Record actual outcomes and any environment limitations. A failure on the unchanged baseline is expected only for `test:exercise`.

### Giving feedback and reviewing revisions

In **Files changed**, use the line-comment control beside the relevant code. State the input, observed or predicted behavior, and the requirement it affects. Distinguish a blocking defect from a question or optional suggestion.

1. Select **Start a review** to collect comments, then add further review comments as needed. Pending comments are visible only to you until you submit them.
2. For a small correction you understand, select the relevant lines and use the suggestion control. Explain why the replacement is needed; a suggested patch still needs inspection and tests.
3. Mark inspected files **Viewed** to track progress. This does not establish correctness.
4. Choose **Review changes**, summarize the material findings, and submit **Comment**, **Request changes**, or **Approve** as appropriate. Author self-review uses comments, not a claimed independent approval. Consult the [reviewing guide](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request) for the current controls.

Only request changes supported by the actual diff. If it is already correct, do not add a defect just to manufacture a review conversation. A clearly labeled hypothetical example can be discussed without changing code or posting it as a real finding.

After a revision, inspect the final diff and rerun the checks above on the updated branch. Resolve a thread after verifying the concern was addressed, or record why no change is needed. A resolved thread alone is not proof of a fix.

**Expected result:** a review record and any necessary corrections, with evidence for the current proposal. Leave the PR open. **Return to the book:** continue with *Using Copilot code review and AI-assisted PR summaries*.

## Summarizing and pre-reviewing with Copilot

**Starting point:** your reviewed search PR. This activity is optional even if you completed the others.

Check your account's feature access, repository policy, and usage allowance before requesting AI work. Keep the human-only path if the feature is unavailable; do not change subscriptions or permissions to finish the lab.

- For a summary, open **Copilot actions**, then **Summary**, in a **new, unsent PR comment**. The [summary documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-for-common-tasks/create-a-pr-summary) describes the current control. Generation does not use the existing description, so preserve that description while inspecting the draft. Compare the generated text with the issue, diff, and actual results. Correct unsupported claims and add missing intent or limitations. Post only useful, checked text; discard the draft otherwise.
- For review, request **Copilot** under **Reviewers**, following the [code review documentation](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review). Inspect each finding and any suggested patch before applying it. No findings is also a possible result.
- Check the existing [repository instructions](../../.github/copilot-instructions.md). The intentional baseline defect is not a reason to reject the explicitly assigned search fix. Category filtering is still outside the issue.
- After changes, request re-review unless your configured automatic-review policy covers new pushes. Replies to code-review comments are not instructions to the implementation agent.

If the native summary action is unavailable, an approved Chat surface with the PR attached can prepare a draft. This is a different interaction, with the same evidence standard. A bounded prompt is:

```text
Draft a short reviewer summary of this PR. Do not post it or change files.
Use the linked issue to check scope; say if you cannot access it.
Distinguish changed behavior, unchanged behavior, and actual verification.
Flag missing evidence. Do not infer test results or deployment from the diff.
```

As of October 1, 2026, GitHub documents optional Copilot approvals in public preview, disabled by default. Do not enable them for this exercise. An approval recommendation in an overview alone does not count as a required approval. Neither that assessment nor an automated approving review supplies the independent human review described above. Recheck documentation before applying this workflow elsewhere.

**Expected result:** a checked explanation and an assessed review, which may produce no code changes. Record your response to findings and any missing evidence. **Return to the book:** continue with *Keeping human judgment in the loop*.

## Merging and verifying the change

**Starting point:** the current PR, its review record, and final check results. The Copilot activity is not a prerequisite.

Review the final revision, required checks, and unresolved concerns together. A reviewer should approve only work they can justify from that evidence. If repository policy blocks merging, satisfy it rather than bypass it.

1. Confirm the base is still your fork's `main`. Choose a permitted merge method; squash merge is suitable for this single-purpose exercise when enabled. Preserve the issue link and a meaningful commit message.
2. Merge only when the applicable review and check requirements are satisfied. Keep the issue's Project status unfinished until built-app verification, even if GitHub closes the issue automatically.
3. In your fork clone, with no uncommitted work, update `main` and build the merged version:

```sh
git switch main
git pull --ff-only origin main
npm ci
npm run build
npm start
```

The pull uses fast-forward mode; resolve divergence before continuing. Open <http://localhost:5173> and repeat the behavior checks in the table above. See the root README for an alternate port if needed. Record the merged PR or branch, commands, observed browser results, and remaining limitations. Stop the server with Ctrl+C when finished.

Move the search issue to **Done** only after recording successful verification and satisfying the review policy. State explicitly if this was a solo self-review. This local exercise establishes neither production deployment nor acceptance on behalf of another person. Leave the category feature in Backlog while its product decisions remain open.

**Expected result:** a reviewed and verified local change, with a truthful completion record. **Return to the book:** continue with *Summary*.
