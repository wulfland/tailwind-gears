# Chapter 2: from a request to ready work

Use this sample to follow one piece of work from a request through clarification, planning, and an implementation handoff. All product data and discussion notes are fictional.

## Start with two issues

1. [Fork and clone the sample](../../README.md#fork-the-sample), enable Issues in your fork, and run the application as described in the root README. Check that `origin` points to your fork.
2. Browse the eight products and open a product. Try `Helmet`, then `HELMET` in search.
3. Read the two drafts in [backlog.json](backlog.json). Create them manually, or preview `npm run seed:issues -- YOUR-OWNER/YOUR-REPO` and then append `--apply`. The latter needs an authenticated GitHub CLI account with issue-write access. Never seed into the author's repository for your own exercise.
4. Create a GitHub Project and add the issues from your fork. Begin with Backlog, Ready, In progress, Review, and Done. Keep the category feature in Backlog while its questions remain unanswered. The search bug is ready once you have reproduced it and agreed on its checks.
5. Choose a small WIP limit that includes agent work and review. For this solo exercise, start only one implementation item at a time.

Forking copies the code and its history, not the author's issues or a configured Project. To use the optional seeding script, run the following from the clone after `npm ci`, replacing `YOUR-USERNAME` and the repository name with your fork. The first command only prints the drafts and target; it makes no GitHub requests.

```sh
npm run seed:issues -- YOUR-USERNAME/tailwind-gears
```

Review that output and confirm the target is your fork. Then, with GitHub CLI installed and authenticated, explicitly create the issues:

```sh
npm run seed:issues -- YOUR-USERNAME/tailwind-gears --apply
```

Choose manual creation or seeding, not both. The script creates two unassigned issues, with no agent execution or project automation. It checks all open and closed issues for stable markers before creating anything, so rerunning does not duplicate its seeded issues. It cannot recognize manually created copies without those markers. It never overwrites a reader's edits.

## Prepare the feature

Use the [fictional meeting transcript](meeting-transcript.md) as the source for AI-assisted notes and an issue draft. Review the output before updating the feature issue. Decide the open questions rather than having the assistant guess. Keep implementation and its tests together when proposing sub-issues.

Introduce a support interruption only after you have started work: a visitor reports that an uppercase product name returns no results. Investigate it, recognize the existing search defect, and link the report instead of creating another implementation task. Add an `unplanned` label to the support investigation if you track it separately; do not count it as a second delivered fix.

## Delegate the bounded search fix

Only assign Copilot after reviewing your fork's visibility, agent policy, usage allowance, and your available review capacity. Confirm the assignment targets your fork and its `main` branch, not the author's upstream repository. Copilot is optional: the same issue can be implemented manually on a branch in your fork. Review the CI workflow and enable Actions in your fork if GitHub requires it before running checks; do not broaden token permissions just to make a check run.

```text
Implement the issue "Make product search case-insensitive".
Reproduce the failure with npm run test:exercise.
Limit the change to product-name matching and regression tests.
Preserve partial matching, whitespace trimming, sort, and stock filtering.
Do not add dependencies or implement category filtering.
Run npm run check, npm run test:exercise, and npm run test:e2e.
Report results and anything you could not verify.
```

The durable acceptance criteria are in the issue. `server/catalog.ts` owns matching, `tests/catalog.test.ts` holds normal regression tests, and `exercises/search.acceptance.ts` is the initially failing check. After fixing search, promote the new coverage into the normal test suite so CI protects it. Do not weaken or delete the acceptance check to make it pass.

For this local lab, Done means the fix is reviewed, the checks pass, and you verify it in the built app with `npm run build` and `npm start`. A real service needs its own deployment and acceptance policy; a merged pull request is not deployment evidence.

Keep the resulting pull request inside your fork, with your fork's `main` branch as its base. Check the base repository explicitly when opening a pull request manually. Chapter 3 continues with review of that change; the author's intentionally unfixed baseline is not the merge target.

## Keep a reproducible start

Before implementing the fix, record your starting commit with `git rev-parse HEAD`. To repeat the exercise later, check out that recorded commit in a separate clone; this avoids depending on a moving default branch or undoing your existing work. Keep implementation changes in your fork. The author's baseline intentionally remains unfixed.
