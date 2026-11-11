# Chapter 15: optional code, dependency, and supply chain security exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data, the vulnerable route and the package suggestion are constructed for practice, and no exercise authorizes changes in the author's repository.

Use **your fork** for branches, settings, and pull requests, and **your fork's `main`** as the target. The practice branch with the vulnerable route is never merged. Do not repeat the search fix from Chapter 2 or implement the category feature. Every feature these activities use is free on a public repository; if your fork is private, check the licensing notes in each activity before you start.

- [Turning on code scanning and reading your first alert](#turning-on-code-scanning-and-reading-your-first-alert)
- [Blocking a secret before it lands](#blocking-a-secret-before-it-lands)
- [Automating dependency updates and reviewing what changes](#automating-dependency-updates-and-reviewing-what-changes)
- [Reviewing an Autofix suggestion against the test](#reviewing-an-autofix-suggestion-against-the-test)
- [Exporting an SBOM, signing commits, and attesting a build](#exporting-an-sbom-signing-commits-and-attesting-a-build)
- [Verifying provenance before the deployment](#verifying-provenance-before-the-deployment)

GitHub product instructions were checked against official documentation on October 26, 2026, and the dependency and provenance activities again on November 11, 2026. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials, and the secret activity uses a token that is revoked before it is typed anywhere.

## Turning on code scanning and reading your first alert

**Starting point:** your fork with GitHub Actions enabled. A fork does not run workflows until you allow it: open the __Actions__ tab and confirm with the button that enables them. Code scanning with CodeQL is free on public repositories; a private repository needs GitHub Code Security (see [About code scanning](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning)).

1. In your fork, open __Settings__, __Advanced Security__. Under __Code Security__, next to __CodeQL analysis__, select __Set up__, then __Default__. The dialog shows the detected language (JavaScript/TypeScript) and the query suite. Select __Enable CodeQL__ (see [Configuring default setup](https://docs.github.com/en/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning)).
2. Open the __Actions__ tab and wait for the __CodeQL__ workflow run to finish. Then open __Security__, __Code scanning__. Expect no alerts: the baseline has no known vulnerability at the time of writing.
3. In a clone of your fork, create a branch: `git switch -c practice/naive-image-route`. Open [`code-scanning/naive-image-route.ts`](code-scanning/naive-image-route.ts) and follow its comment: add the two imports at the top of `server/app.ts` and the route inside `createApp()`, after the product detail route. The route builds a file path from `request.params.id`, which is the mistake the scanner looks for. Run `npm test` to confirm the baseline tests still pass; do not add the Chapter 14 tests yet.
4. Commit, push, and open a pull request against **your fork's `main`**; check the base repository, because GitHub offers the author's upstream. Wait for the __Code scanning results__ check.
5. On the __Files changed__ tab, open the annotation on the route. Select __Show paths__ and follow the flow from the request parameter to the file read. Record the query id, the security severity, and the number of steps in the path.

Leave the pull request open; the Autofix activity continues from it. Never merge this branch.

| What to check | Expected |
| --- | --- |
| The check on the pull request | __Code scanning results__ fails, because the alert's severity is error |
| The query | `js/path-injection`, "Uncontrolled data used in path expression" |
| The security severity | 7.5, listed as high, with CWE-22 among its weaknesses |
| The path | From `request.params.id` through `path.join` to `response.sendFile` |

**Expected result:** a repository that scans every push to `main` and every pull request, and one alert you have read from source to sink, not a fixed vulnerability. **Return to the book:** continue with *Keeping secrets out with secret scanning and push protection*.

## Blocking a secret before it lands

**Starting point:** your fork, a clone, and your GitHub account. Push protection for your own account is on by default and applies to pushes to public repositories; push protection for a private repository needs GitHub Secret Protection (see [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)). The activity uses a token that you revoke before you paste it anywhere, so that nothing of value can leak even if a step goes wrong.

1. Open your profile picture, __Settings__, and under __Security__ select __Code security__. In the __User__ section, confirm that __Push protection for yourself__ is enabled (see [Push protection for users](https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/push-protection-for-users)).
2. Open your fork's __Settings__, __Advanced Security__, and read the secret scanning section. Note which features are on for a public repository without a license and which ones name GitHub Secret Protection.
3. Create the drill token: __Settings__, __Developer settings__, __Personal access tokens__, __Fine-grained tokens__, __Generate new token__. Name it `push-protection-drill`, choose the shortest expiry the form allows, keep __Repository access__ at public repositories with read-only access, grant no permissions, and generate it. Copy the value to a scratch file on your machine, then open the token in the list and delete it. The value now has the shape of a GitHub token and can do nothing.
4. In your clone, create a branch `practice/push-protection`, create `docs/drill.txt` containing one line with the revoked value, commit, and push.

Expected: the push is rejected. The remote's message names the secret type, lists the commit and `docs/drill.txt` with a line number, and prints a URL you could use to bypass. Do not open the URL (see [Working with push protection from the command line](https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line)).

5. Remove the file, run `git commit --amend --all`, push again, and confirm the branch arrives. Delete the branch, and delete the scratch file on your machine.
6. Open your fork's __Security__, __Secret scanning__. A blocked push creates no alert; record that the list is empty.

If the push was not rejected, the revoked token's value did not match a pattern that push protection enforces at the time of your attempt. Remove the commit before it is pushed further, record the observation, and do not claim the block. Nothing was exposed in either case, because the token was already deleted.

**Expected result:** a measured control and the exact text of a block, not a leaked credential. **Return to the book:** continue with *Managing dependencies with Dependabot and dependency review*.

## Automating dependency updates and reviewing what changes

**Starting point:** your fork with Actions enabled, and a clone. Dependabot alerts, security updates, version updates, and dependency review on pull requests are free on public repositories; dependency review on a private repository needs GitHub Code Security (see [About dependency review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)).

### Turning Dependabot on and reading the graph

1. Open your fork's __Settings__, __Advanced Security__. Confirm that __Dependency graph__, __Dependabot alerts__, and __Dependabot security updates__ are enabled; enable them if not. A fork does not inherit these settings, and the author's repository had the dependency graph switched off at the time of writing (see [About Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts)).
2. Open __Insights__, __Dependency graph__. Read the __Dependencies__ tab: the four runtime dependencies and seven development dependencies from `package.json`, and the packages they resolve to from `package-lock.json`. Note the license shown for each direct dependency. Then open `.github/workflows/actions.lock`. The CI workflow references `actions/checkout@v6` and `actions/setup-node@v6` by tag, and this workflow lockfile records the commit each tag resolved to and the numeric identity of the repository behind the name. GitHub runs the locked commit, so a tag that moves does not change what CI runs. The file is generated by `gh actions-lock` and is never edited by hand (see [Workflow dependency lockfiles](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles)).

### Adding the configuration and the review check

3. On a branch `practice/dependency-controls`, copy [`dependabot/dependabot.yml`](dependabot/dependabot.yml) to `.github/dependabot.yml` and [`workflows/dependency-review.yml`](workflows/dependency-review.yml) to `.github/workflows/dependency-review.yml`. Read both files: the first schedules weekly npm and Actions updates with a seven-day cooldown and groups the development tools; the second fails a pull request on a vulnerability of high severity or above or on a denied package, and posts a summary comment (see the [Dependabot options reference](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) and the [dependency review action](https://github.com/actions/dependency-review-action)).
4. Commit, push, and open a pull request against your fork's `main`. Wait for the __Dependency review__ check and read its comment. Expected: the check passes with no vulnerabilities. The only dependency changes are the two actions the new workflow uses, `actions/checkout` and `actions/dependency-review-action`, in the manifest `.github/workflows/dependency-review.yml`, because GitHub counts the actions in a workflow file as dependencies; `dependabot.yml` adds none. The new workflow is not in the lockfile, so its actions still resolve by tag. Locking it is optional, and the remaining activities work either way: install the extension with `gh extension install github/gh-actions-lock`, run `gh actions-lock --no-narrow` in your clone on this branch, and commit the changed `actions.lock` with the workflow. The `--no-narrow` option keeps the tags as the book prints them; without it, the extension rewrites a partial version such as `@v5` to the full release tag.

### Checking a package an assistant suggested

5. Do not add anything yet. Read the constructed suggestion below; it is the kind of proposal an assistant makes when asked to protect an API from abuse.

```text
To throttle the catalog API, add the express-rate-limiter-plus package:
  npm install express-rate-limiter-plus
and wrap the /api/products route with its middleware.
```

6. Run the five questions from Table 15.2 of the chapter from your clone, without installing:

```sh
npm view express-rate-limiter-plus
npm view express-rate-limit name version time.created dist.attestations
```

Expected: the first command reports a 404, because the package does not exist on the registry at the time of writing; the name is a hallucination, and the real, widely used package is `express-rate-limit`. The second command shows a package first published in December 2014 with a provenance attestation on its current version. Open its registry page and read the __Dependents__ count and the maintainers. Record the answers to all five questions, and record that the catalog's issue did not ask for rate limiting, which is the fifth question.

7. Merge the configuration pull request through your ruleset. Dependabot checks the manifests when the file reaches `main` and then on its weekly schedule, and it opens pull requests only for updates that have passed the cooldown: one grouped `dev-tooling` update for minor and patch releases of the development tools, and separate pull requests for runtime dependencies and for actions. A pull request for an action that `ci.yml` uses also changes that action's entry in `.github/workflows/actions.lock`, because Dependabot regenerates the lockfile entry of a locked workflow; read the new `commit` there the way you read a package version. If no update is eligible yet, none opens. Read the compatibility score and the lockfile diff before you merge, and run `npm run check` on the branch if you want your own evidence. If a proposed update breaks the sample's tests, comment `@dependabot ignore this minor version` on the pull request and record why.

**Expected result:** a fork that proposes its own updates on a schedule, delays each release by a week, and reviews every dependency change on a pull request, plus a written check of one invented package; no new package in the fork. **Return to the book:** continue with *Fixing vulnerabilities with Copilot Autofix*.

## Reviewing an Autofix suggestion against the test

**Starting point:** the open pull request from the code scanning activity, with its path-injection alert. Copilot Autofix needs no Copilot subscription and is free on public repositories; it is on by default for repositories that use CodeQL and can be disabled by an administrator (see [Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/responsible-use-autofix-code-scanning)).

### Reading the suggestion

1. On the pull request's __Conversation__ tab, find the Autofix comment on the alert. Read the explanation first and the diff second. If there is no suggestion, Autofix made no attempt for this alert on this run; push an empty commit with `git commit --allow-empty -m "Rerun analysis"` and wait, or skip to the manual fix in step 4.
2. Before applying anything, answer the review checklist in writing:

| Question | A fix to accept | A fix to decline |
| --- | --- | --- |
| Is a path still built from the id? | The id selects a product and the file name comes from the catalog's data, or the path is resolved and checked against the products directory | The id is sanitized by removing `..` or `/` and still used in the path |
| What does an unknown id get? | The catalog's own `404` JSON | A `500`, a stack trace, or an empty response |
| Was a dependency added or changed? | No change to `package.json` | A sanitizing or path package was added |
| Does an error leak a path? | The error handler answers with the fixed message | The file system error reaches the response |

### Testing the fix

3. In your clone, on the practice branch, copy [`../chapter-14/security/image-route.test.ts`](../chapter-14/security/image-route.test.ts) to `tests/image-route.test.ts`. Apply the suggestion with the pull request's __Edit__ button, or copy the patch into your editor, then run `npm test`. The traversal test sends ids such as `..%2F..%2Fpackage.json` and expects the catalog's `404` for each; a fix that resolves the path and checks the root passes, and a fix that only strips characters may not.
4. If the test fails, or if the suggestion changed `package.json`, dismiss the suggestion with __Dismiss suggestion__ and replace the route with the safe implementation in [`../chapter-14/security/image-route.ts`](../chapter-14/security/image-route.ts), which looks the product up by id and serves the file name from the catalog's data under a fixed root. Run `npm test` again.
5. Commit and push. Wait for the __Code scanning results__ check: the alert should now be fixed, and the check green. Open __Security__, __Code scanning__, and confirm that the alert is closed as fixed on the branch.
6. Close the pull request without merging, or merge it only if you want the image endpoint, its tests, and the safe implementation in your fork.

Record which of the three checks decided the outcome: the scanner's status, the test's result, or your reading of the diff.

**Expected result:** one alert resolved with a reviewed fix, and one written observation about how a generated fix behaved on one sample; not a conclusion about Autofix in general. **Return to the book:** continue with *Securing the supply chain with SBOMs, signing, and attestations*.

## Exporting an SBOM, signing commits, and attesting a build

**Starting point:** your fork, a clone, an SSH key you already use with GitHub, and the GitHub CLI signed in (`gh auth status`). Artifact attestations are free on public repositories; on a private or internal repository they need GitHub Enterprise Cloud (see [About artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)).

### Exporting the SBOM

1. With the dependency graph enabled in __Settings__, __Advanced Security__, open __Insights__, __Dependency graph__, and select __Export SBOM__ at the top right of the __Dependencies__ tab (see [Exporting a software bill of materials](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/exporting-a-software-bill-of-materials-for-your-repository)). Open the downloaded SPDX file in an editor. Find `express` and the three other runtime dependencies, and count the packages listed. Compare with the clone: `npm ls --all 2>/dev/null | wc -l`. The numbers differ slightly, because the graph and npm count a few packages differently; record both.

### Signing your commits with SSH

2. Tell Git to sign with your SSH key (see [Telling Git about your signing key](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)):

```sh
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Use the path of your own public key if it differs.

3. Add the same public key to your account as a signing key: __Settings__, __SSH and GPG keys__, __New SSH key__, with __Key type__ set to __Signing Key__. On the same page, enable vigilant mode by selecting __Flag unsigned commits as unverified__ (see [Displaying verification statuses for all of your commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits)).
4. On a branch `practice/release-workflow`, make any small commit, push, and open the commit on GitHub. Expected: a __Verified__ badge. Your earlier, unsigned commits now show __Unverified__ in your fork, which is vigilant mode working, not a problem to fix.

### Attesting a build

5. On the same branch, copy [`workflows/release.yml`](workflows/release.yml) to `.github/workflows/release.yml`. Read it: the job builds the catalog, packs `dist/` into `tailwind-gears-site.tgz`, attests that archive with `actions/attest@v4` under the three permissions it needs, and uploads the archive as the artifact `site` (see [Using artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)). Commit, push, open a pull request against your fork's `main`, and merge it through your ruleset.
6. Open the __Actions__ tab, select __Release__, then __Run workflow__ on `main`. When it finishes, open the run: the summary lists the attestation, and the artifact `site` is attached. Open `https://github.com/YOUR-USERNAME/tailwind-gears/attestations` to see it listed.
7. Download the artifact, unzip it, and verify:

```sh
gh attestation verify tailwind-gears-site.tgz -R YOUR-USERNAME/tailwind-gears
```

Expected: a success line followed by the attestation's repository, workflow, and commit. Then change one byte and verify again:

```sh
printf 'x' >> tailwind-gears-site.tgz
gh attestation verify tailwind-gears-site.tgz -R YOUR-USERNAME/tailwind-gears
```

Expected: a failure, because no attestation matches the file's new digest. Record both outputs.

**Expected result:** an SBOM for the repository, commits that carry your signature, and a build whose archive carries a signed statement of its origin that you have verified once and failed once; not a release process. **Return to the book:** continue with *Establishing provenance and SLSA in AI-assisted pipelines*.

## Verifying provenance before the deployment

**Starting point:** your fork with the `Release` workflow from the previous activity and the `staging` and `production` environments from Chapter 11. If the environments do not exist, create them under __Settings__, __Environments__, and add yourself as a required reviewer on `production`. The GitHub CLI inside the workflow uses the job's own token; no secret is needed.

### Replacing the deployment workflow

1. On a branch `practice/verified-deploy`, replace `.github/workflows/deploy.yml` with [`workflows/deploy.yml`](workflows/deploy.yml). Read the `verify` job: it takes the id of a `Release` run as input, downloads that run's `site` artifact with `gh run download`, and verifies the archive against four things: your repository, `.github/workflows/release.yml` as the signing workflow, `refs/heads/main` as the branch the build ran from, and the commit of that run. The command is silent on success when it runs outside a terminal, so the step sets `GH_FORCE_TTY` for it, which puts the criteria and the result into the log. It then uploads the verified archive for the `staging` and `production` jobs, which unpack it instead of building. The archive contains only `dist/`, and the server still runs from a checkout, so both jobs check out exactly the commit the verification confirmed, not whatever `main` contains on the day you deploy. Commit, push, open a pull request against your fork's `main`, and merge it.
2. Run __Release__ from the __Actions__ tab on `main` and note the run's id from its URL. Then run __Deploy__ and paste the id into __release_run_id__.
3. Watch the `verify` job. Expected: the verification step lists the criteria it enforces, among them the repository, the signer workflow, `refs/heads/main`, and the commit, prints `✓ Verification succeeded!`, and names the build and signer workflow of the attestation that matched; the `staging` job starts the smoke test afterward. The messages quoted in this activity are those of GitHub CLI 2.102.0. Approve the `production` deployment when the environment asks you to.

### Experiment one: a different signer

4. On a branch `practice/release-experiment`, copy [`workflows/release-experiment.yml`](workflows/release-experiment.yml) to `.github/workflows/release-experiment.yml`, commit, and push. The push starts the workflow: a file that exists only on a practice branch cannot be started by hand, because `workflow_dispatch` needs the file on the default branch, so this one runs when its own file is pushed to a `practice/` branch (see [Manually running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)). Open the __Actions__ tab, select the __Release experiment__ run, and note its id.
5. Run __Deploy__ on `main` with that id. Expected: the `verify` job fails at the verification step with `✗ Sigstore verification failed`, because the signing certificate names `release-experiment.yml` and the criteria allow only `release.yml`; `staging` and `production` never start.

### Experiment two: the right workflow on the wrong branch

6. Open __Actions__, __Release__, __Run workflow__, choose `practice/release-experiment` in the branch list, and run it. `Release` can be started there because its file is on `main`; the run uses the branch's copy of the workflow, which anyone with write access could have changed. Note the run id.
7. Run __Deploy__ on `main` with that id. Expected: the verification fails with `✗ Policy verification failed` and the line `expected SourceRepositoryRef to be refs/heads/main, got refs/heads/practice/release-experiment`, because the attestation names the practice branch as its source and the check requires `refs/heads/main`. Without `--source-ref`, this archive would have passed.

### Experiment three: a changed byte

8. On the same practice branch, edit `.github/workflows/deploy.yml` and add a step before the verification: `- run: printf 'x' >> tailwind-gears-site.tgz`. Push, and run __Deploy__ on the branch with the id of the `Release` run on `main` from step 2. Expected: the verification fails with `✗ Loading attestations from GitHub API failed` and an HTTP 404, because no attestation exists for the digest of the changed archive.
9. Delete the practice branch and the experiment workflow. Record the successful output and the three failure messages side by side.

| Deploy input | Expected outcome |
| --- | --- |
| A `Release` run on `main` | Verification succeeds; staging and production deploy |
| A `Release experiment` run | Verification fails on the signer workflow; nothing deploys |
| A `Release` run on the practice branch | Verification fails on the source branch; nothing deploys |
| A `Release` run with the archive modified | Verification fails on the digest; nothing deploys |

**Expected result:** a deployment that refuses an artifact it cannot trace to the reviewed workflow, with three failure messages you have seen; not a hardened organization. The rulesets and Actions policies that bind every repository are set by an owner (see [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)). **Return to the book:** continue with *Summary*.
