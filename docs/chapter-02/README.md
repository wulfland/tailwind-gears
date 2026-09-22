# Chapter 2: from a request to ready work

This standalone sample supports the planned second-edition exercises. The manuscript's previous order-status scenario has not yet been rewritten to match it.

## Start with two issues

1. Create your own repository from this template and clone it. Run the application as described in the root README.
2. Browse the eight products and open a product. Try `Helmet`, then `HELMET` in search.
3. Read the two drafts in [backlog.json](backlog.json). Create them manually, or preview `npm run seed:issues -- YOUR-OWNER/YOUR-REPO` and then append `--apply`. The latter needs an authenticated GitHub CLI account with issue-write access. Never seed into the author's repository for your own exercise.
4. Create a GitHub Project and add the issues. Begin with Todo, In progress, Review, and Done. Keep the category feature in Todo while its questions remain unanswered. The search bug is ready once you have reproduced it and agreed on its checks.
5. Choose a small WIP limit that includes agent work and review. For this solo exercise, start only one implementation item at a time.

Repository templates copy files, not your own live issues or a configured Project. The seeding script creates two unassigned issues, with no agent execution or project automation. It checks all open and closed issues for stable markers before creating anything, so rerunning does not duplicate its issues. It never overwrites a reader's edits.

## Prepare the feature

Use the [fictional meeting transcript](meeting-transcript.md) as the source for AI-assisted notes and an issue draft. Review the output before updating the feature issue. Decide the open questions rather than having the assistant guess. Keep implementation and its tests together when proposing sub-issues.

Introduce a support interruption only after you have started work: a visitor reports that an uppercase product name returns no results. Investigate it, recognize the existing search defect, and link the report instead of creating another implementation task. Add an `unplanned` label to the support investigation if you track it separately; do not count it as a second delivered fix.

## Delegate the bounded search fix

Only assign Copilot after reviewing your repository's visibility, agent policy, usage allowance, and your available review capacity. Copilot is optional: the same issue can be implemented manually.

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

## Keep a reproducible start

The `chapter-02-start` tag records the author's baseline. Check out that tag in a fresh clone to repeat the exercise without undoing your existing work. Keep implementation changes in your own repository. The author's baseline intentionally remains unfixed.
