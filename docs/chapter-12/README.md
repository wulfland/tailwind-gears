# Chapter 12: optional trunk and feature flag exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data. No exercise authorizes changes in the author's repository.

Use **your fork** for rulesets, branches, pull requests, issues, and environment variables, and **your fork's `main`** as the target. The activities work on the unfixed baseline and on a fork that already contains the Chapter 3 search fix; none of them touches the search behavior, and `npm run test:exercise` keeps failing on an unfixed fork by design. The third activity adds a small flag mechanism to your fork (a registry, one flag, and tests); the author's baseline does not contain it. Do not implement the unresolved category feature for this chapter.

- [Protecting main with a ruleset](#protecting-main-with-a-ruleset)
- [Merging a change through a short-lived branch](#merging-a-change-through-a-short-lived-branch)
- [Deploying a change dark behind a flag](#deploying-a-change-dark-behind-a-flag)
- [Releasing the flagged change through an agent's pull request](#releasing-the-flagged-change-through-an-agents-pull-request)
- [Retiring a flag with an expiry check and an agent](#retiring-a-flag-with-an-expiry-check-and-an-agent)

GitHub product instructions were checked against official documentation on October 22, 2026. Rulesets, auto-merge, and automatic branch deletion are available in a public repository on every plan, so the first three activities cost nothing in a public fork. A merge queue needs an organization-owned repository and is not used here. The two agent activities use the Copilot cloud agent, which needs a paid Copilot plan and consumes AI credits per task; both have a manual alternative. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files for the flag activities are in [`flags/`](flags/): [`flags.ts`](flags/flags.ts) and [`flags.test.ts`](flags/flags.test.ts). They are copies; nothing changes in your fork until you place them under `server/` and `tests/` and add the two lines to `server/catalog.ts` described below. The activities build on each other in order: the ruleset gates every later pull request, the flag activity deploys the feature dark, the agent activity releases it, and the last activity removes it.

## Protecting main with a ruleset

**Starting point:** your fork with Actions enabled (see the Chapter 11 guide if you have not run the CI workflow yet) and a local clone of it. No branch is needed.

1. In your fork, open **Settings**. In the left sidebar under **Code and automation**, select **Rulesets**, then **New ruleset** and **New branch ruleset**. See [Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).
2. Under **Ruleset name**, enter `Protect main`. Set **Enforcement status** to **Active**. Leave the **Bypass list** empty.
3. Under **Target branches**, select **Add a target**, then **Include default branch**.
4. Under **Branch protections**, select the following and leave the rest as they are:
   - **Restrict deletions** and **Block force pushes** (both selected by default).
   - **Require linear history**. Your fork allows squash and rebase merging by default, which this rule needs.
   - **Require a pull request before merging**. Keep **Required approvals** at `0`, because you are the only contributor. In a team, set it to `1` or more and select **Dismiss stale pull request approvals when new commits are pushed**.
   - **Require status checks to pass before merging**. Select **Add checks**, search for `verify`, and add it. If the search finds nothing because no run is recent, type `verify` and add it by name. Select **Require branches to be up to date before merging**.
5. Select **Create**. The ruleset page lists the rules, and anyone with read access to the fork can see them. See [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) for what each rule does.
6. Open **Settings**, **General**, and scroll to **Pull Requests**. Select **Allow auto-merge** and **Automatically delete head branches**. See [Managing auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository) and [Managing the automatic deletion of branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches).
7. In your clone, on `main`, add a line to any Markdown file, commit it, and run `git push`. Expect the push to be rejected with a message that names the ruleset and the rule that requires a pull request. Then discard the local commit:

```sh
git fetch origin
git reset --hard origin/main
```

Record which rule rejected the push. If the push succeeded, the ruleset is not active or does not target `main`; open it again and check **Enforcement status** and **Target branches**.

**Expected result:** a ruleset named `Protect main` that is active on the default branch, a rejected direct push, and the two repository settings enabled; nothing merged or changed on `main`. **Return to the book:** continue with *Choosing a Git workflow and the CI discipline behind it*.

## Merging a change through a short-lived branch

**Starting point:** your fork with the ruleset from the previous activity, and a clone with the [GitHub CLI](https://cli.github.com/) signed in (`gh auth status`). The web interface alternative follows the CLI steps.

1. Create a branch and a one-file change. Replace `YOUR-USERNAME` with your account:

```sh
git switch -c users/YOUR-USERNAME/12_practice-note main
mkdir -p docs/practice
echo "A short-lived branch should merge within a couple of days." > docs/practice/short-lived-branch.md
git add docs/practice/short-lived-branch.md
git commit -m "Add a note on short-lived branches"
git push --set-upstream origin users/YOUR-USERNAME/12_practice-note
```

2. Open a draft pull request from the commit, then look at it in the browser:

```sh
gh pr create --fill --draft
gh pr view --web
```

The pull request page shows that drafts cannot be merged and that the `verify` check is queued or running. Confirm that the base is **your fork's `main`**; if the CLI offered the author's upstream repository as the base, close the pull request and recreate it with `--base main --repo YOUR-USERNAME/tailwind-gears`. See [gh pr create](https://cli.github.com/manual/gh_pr_create).

3. Mark the pull request ready, enable auto-merge with a squash, and watch the check:

```sh
gh pr ready
gh pr merge --auto --squash
gh pr checks --watch
```

The CLI reports that auto-merge is enabled rather than merging at once, because the ruleset requires the check. When `verify` passes, GitHub merges the pull request and, because of the repository setting from the previous activity, deletes the branch. The CLI does not delete the branch itself when it only enables auto-merge. See [gh pr merge](https://cli.github.com/manual/gh_pr_merge) and [Automatically merging a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request).

4. Clean up locally and read the result:

```sh
git switch main
git pull --prune
git log --oneline -3
```

Expect one new squash commit on `main` whose message is the pull request title, and no remote branch under `users/`. Note the time the check took and the time from the first command to the merged commit.

### Web interface alternative

Create the branch and the file with the branch selector and **Add file** in your fork, choose **Create a new branch for this commit and start a pull request**, and select **Create draft pull request**. On the pull request, select **Ready for review**, then **Enable auto-merge**, choose **Squash and merge**, and confirm. Wait for the check, then open **Branches** in your fork to confirm that the branch was deleted.

**Expected result:** one change merged to `main` through a draft pull request, a passing check, and auto-merge, with the branch deleted; no review, because you are alone in the fork. **Return to the book:** continue with *Decoupling deployment from release with feature flags*.

## Deploying a change dark behind a flag

**Starting point:** your fork with the ruleset, and a clone on `main`. The reference files are [`flags/flags.ts`](flags/flags.ts) and [`flags/flags.test.ts`](flags/flags.test.ts). The flag sorts sold-out products after the in-stock products in the featured order; on the sample data, the Loop Lock moves from the seventh position to the last.

### Adding the registry and the flag

1. Create a branch `users/YOUR-USERNAME/12_sold-out-last` from `main`.
2. Copy `flags/flags.ts` from this directory to `server/flags.ts`, and `flags/flags.test.ts` to `tests/flags.test.ts`.
3. In `server/flags.ts`, set `owner` to your account, `created` to today, and `expires` to a date about two months from today, in `YYYY-MM-DD` form. The reference file carries the dates of the chapter's example; if `expires` is already in the past when you copy it, the expiry test fails with a message that names the flag, which is the behavior the last activity relies on. Fix the date now.
4. In `server/catalog.ts`, add the import after the existing one and the toggle point as the first line after the `filter` call in `listProducts`:

```ts
import { isEnabled } from './flags.ts'
```

```ts
  if (sort === 'featured' && isEnabled('sold-out-last')) result.sort((left, right) => Number(!left.inStock) - Number(!right.inStock))
```

The existing `price-asc`, `price-desc`, and `name` sorts stay as they are; `Array.prototype.sort` is stable, so the in-stock products keep their source order.

5. Run `npm run check`. Expect 15 passing tests (the 11 baseline tests and the 4 new ones) and a successful build.

### Running it both ways

6. Start the application twice and compare the catalog, or query the API with the commands below. `TG_FLAGS` takes comma-separated flag names; a leading `-` turns a flag off.

```sh
npm run dev
# in a second terminal:
curl -s "http://127.0.0.1:5173/api/products" | grep -o '"id":"[a-z-]*"' | tail -1
```

Stop the server with **Ctrl+C**, then start it with the flag on:

```sh
TG_FLAGS=sold-out-last npm run dev
```

On Windows PowerShell, use `$env:TG_FLAGS="sold-out-last"; npm run dev`. The table below says what to expect; do not claim an observation unless you made it.

| Start command | Last product in the featured order | Loop Lock position |
| --- | --- | --- |
| `npm run dev` (flag off, the default) | `trail-bottle` | Seventh of eight |
| `TG_FLAGS=sold-out-last npm run dev` | `loop-lock` | Last |

In the browser, the Loop Lock card carries the **Sold out** badge in both cases; only its position changes. Search, sorting by price or name, and the **In stock only** filter behave the same in both states.

### Merging dark

7. Commit, push, and open a pull request against **your fork's `main`** with `gh pr create --fill` or in the browser; check the base repository. Read the diff once as a reviewer: a registry, a test file, and two lines in the catalog.
8. Let it merge with the default at `false` (`gh pr merge --auto --squash`, or **Enable auto-merge** in the browser). The feature is now in `main` and visible to nobody.

### Rolling out to staging (optional)

This part needs the Chapter 11 deployment workflow and its `staging` and `production` environments in your fork. Skip it if you did not build them.

9. Open **Settings**, **Environments**, **staging**. Under **Environment variables**, select **Add environment variable**, name it `TG_FLAGS`, value `sold-out-last`, and save. Leave `production` without the variable. See [Variables](https://docs.github.com/en/actions/reference/workflows-and-actions/variables).
10. On a branch, edit `.github/workflows/deploy.yml`. In both deployment jobs, give the smoke-test step an `env` block and one more line that prints the last product:

```yaml
      - name: Start the build and check the catalog API
        env:
          TG_FLAGS: ${{ vars.TG_FLAGS }}
        run: |
          npm start &
          for i in $(seq 1 30); do
            curl -sf http://127.0.0.1:5173/api/health && break
            sleep 1
          done
          curl -sf "http://127.0.0.1:5173/api/products?q=Helmet" > smoke.json
          grep -q '"total":2' smoke.json
          curl -sf "http://127.0.0.1:5173/api/products" | grep -o '"id":"[a-z-]*"' | tail -1
```

11. Merge the change, run **Deploy** on `main`, approve the production deployment as in Chapter 11, and read the last line of the smoke-test step in each job. Expect `"id":"loop-lock"` in `deploy-staging` and `"id":"trail-bottle"` in `deploy-production`: the same artifact, two behaviors, and no new build.

**Expected result:** the flag, its tests, and the toggle point merged to `main` with the default off, and, if you did the optional part, a staging environment that shows the feature while production does not. **Return to the book:** continue with *Preparing your workflow for agent contributions*.

## Releasing the flagged change through an agent's pull request

**Starting point:** your fork after the flag activity (default `false` on `main`), the ruleset, and a paid Copilot plan on the account that owns the fork. Each task consumes AI credits; check your plan's allowance first. The manual alternative at the end needs no plan.

1. In your fork, open **Issues**, select **New issue**, and create it with this title and body:

```text
Release the sold-out-last flag
```

```text
The flag `sold-out-last` in server/flags.ts is deployed with its default set to
false. Release it to everyone by changing that default to true. Keep the TG_FLAGS
override working, so that TG_FLAGS=-sold-out-last restores the source order.

Update tests/flags.test.ts so that the default state is the sorted order
(isEnabled('sold-out-last', '') is true; listProducts() returns loop-lock last)
and so that the override -sold-out-last restores the source order (loop-lock at
index 6). Keep the override test and the expiry test as they are.

In tests/catalog.test.ts, the test "empty and whitespace searches return the
entire catalog" compares listProducts('   ') with the products array by order.
Change that one assertion to compare the two lists of ids sorted alphabetically,
because the order now differs while the contents do not.

Do not remove the flag or its registry entry, and do not change
server/catalog.ts, the search behavior, or any file other than server/flags.ts
and the two test files. Run npm run check and report the result in the pull
request.
```

2. Open the issue, select **Assignees**, and choose **Copilot**. In the **Assign to Copilot** dialog, keep your fork as the repository and `main` as the base branch, and confirm. See [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github). Copilot reacts to the issue, works in the background on a branch that starts with `copilot/`, opens a pull request, and requests your review when it has finished. Chapter 2's guide covers the same assignment step in more detail.
3. On the pull request, read the diff before anything else. Expect one changed line in `server/flags.ts`, changes to the tests in `tests/flags.test.ts` that pinned the off state, and one changed assertion in `tests/catalog.test.ts`; anything else is out of scope and a reason to comment. Then select **Approve and run workflows** in the merge box so that `verify` runs on the agent's branch; workflows do not run on the agent's pushes until a person with write access approves them. See [Reviewing pull requests created by Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/review-copilot-prs).
4. Open the session log linked from the pull request and compare what the agent did with the diff. If the tests need a correction, comment on the pull request with `@copilot` and the exact change; Copilot pushes to the same branch and the workflows need approval again.
5. When `verify` is green, merge the pull request (the ruleset requires zero approvals in a solo fork; in a team the required approvals apply, and your own approval of a Copilot pull request does not count toward them). Close the issue if Copilot did not.
6. In your clone, run `git switch main && git pull --prune` and start the application without `TG_FLAGS`. Expect the Loop Lock last; `TG_FLAGS=-sold-out-last npm run dev` restores the source order.

If your fork contains a ruleset rule the agent cannot satisfy, such as required signed commits, GitHub disables the agent for the repository; the ruleset in the first activity contains no such rule. If you did the optional staging part, the `staging` variable is now redundant and does no harm.

For the **manual alternative**, make the same change on a branch `users/YOUR-USERNAME/12_release-flag`: set `default: true` in `server/flags.ts`; change the third test to set `process.env.TG_FLAGS = '-sold-out-last'` before asserting the source order (and delete it afterward); change the fourth test to delete `process.env.TG_FLAGS` and assert the sorted order; change the first test's first assertion to `true`; and in `tests/catalog.test.ts` replace the whitespace-search assertion with `assert.deepEqual(listProducts('   ').map(product => product.id).sort(), products.map(product => product.id).sort())`. Run `npm run check`, expect 15 passing tests, and merge through a pull request as in the second activity.

**Expected result:** the flag's default is `true` on `main`, changed through a reviewed pull request that passed the ruleset's check, and the feature is released without a new build; no flag removed. **Return to the book:** continue with *Keeping flags clean with AI assistance*.

## Retiring a flag with an expiry check and an agent

**Starting point:** your fork after the release activity, with the flag's default at `true` on `main`, and the ruleset.

### Watching the expiry check fail

1. On a branch `users/YOUR-USERNAME/12_expired-flag`, set the flag's `expires` date in `server/flags.ts` to yesterday, commit, push, and open a pull request against your fork's `main`.
2. Wait for `verify`. Expect it to fail in `tests/flags.test.ts` with the message `Flag sold-out-last expired on YYYY-MM-DD: remove it or extend it deliberately`, and expect the merge box to report that the required check failed. That is the time bomb from the chapter doing its job.
3. Close the pull request without merging and delete the branch. The flag's date on `main` is unchanged.

### Removing the flag

4. Create an issue with this title and body:

```text
Remove the sold-out-last flag
```

```text
The flag `sold-out-last` has been released to everyone and its rollout is
complete. Remove it:

- In server/catalog.ts, make the sold-out-last ordering the permanent behavior
  of the featured sort: keep the sort line, drop the isEnabled('sold-out-last')
  condition, and remove the import of isEnabled if nothing else uses it.
- In server/flags.ts, delete the sold-out-last entry from the registry. Keep the
  file, the FlagDefinition interface, the FlagName type, and isEnabled for future
  flags; an empty registry is fine.
- In tests/flags.test.ts, delete the tests that reference the flag or its off
  state, and keep the expiry test.
- In tests/catalog.test.ts, add one test asserting that listProducts() returns
  loop-lock last.

Do not change the search behavior or any other file. Run npm run check and
report the result in the pull request.
```

5. Assign the issue to **Copilot** as in the previous activity, or make the change yourself on a branch `users/YOUR-USERNAME/12_remove-flag`. The chapter's description of a cleanup pull request is the review checklist: the diff hardcodes the behavior that is served, removes the conditional and the dead state, removes the tests for that state, removes the registry entry, and changes nothing else.
6. On the pull request, approve the workflows, wait for `verify`, and read the diff against that checklist. Expect 13 passing tests (the 11 baseline tests, the expiry test, and the new catalog test) and a successful build. Merge it and close the issue.
7. In your clone, pull `main` and run `npm run test:exercise`. On an unfixed fork, expect it to fail exactly as before, because the search defect from Chapter 2 is untouched; on a fork with the Chapter 3 fix, expect it to pass as before. If you created the `TG_FLAGS` variable in the `staging` environment, delete it under **Settings**, **Environments**, **staging**.

**Expected result:** a flag that was defined, deployed dark, released, and removed in your fork through five reviewed pull requests, with the expiry check demonstrated once; the catalog now always shows sold-out products last, and nothing else changed. **Return to the book:** continue with *Summary*.
