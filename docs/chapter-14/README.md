# Chapter 14: optional security exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data. No exercise authorizes changes in the author's repository.

Use **your fork** for branches, pull requests, settings, and notes, and **your fork's `main`** as the target. The activities work on the unfixed baseline and on a fork that contains the Chapter 3 search fix, the Chapter 12 flag, or the Chapter 13 injector; none of them changes the search behavior, and `npm run test:exercise` keeps failing on an unfixed fork by design. Nothing here asks you to create a real secret, attack a real system, or put a real credential, hostname, or incident into a public repository, not even for a drill. The attack in the drill is written down, not carried out.

- [Writing the catalog's threat model and its first abuse-case tests](#writing-the-catalogs-threat-model-and-its-first-abuse-case-tests)
- [Running a tabletop drill for a compromised contributor](#running-a-tabletop-drill-for-a-compromised-contributor)
- [Hardening the sample's codespace configuration](#hardening-the-samples-codespace-configuration)
- [Reviewing an assistant's change as untrusted input](#reviewing-an-assistants-change-as-untrusted-input)

GitHub product instructions were checked against official documentation on October 22, 2026. The first two activities cost nothing. The third creates a codespace, which draws on a personal account's free monthly quota (120 core hours and 15 GB-month of storage on GitHub Free at the time of writing) and is billed beyond it; check who pays, and stop and delete the codespace when you are done. The fourth uses Copilot Chat in your editor, which needs a Copilot plan (Copilot Free works within its limits); the manual route needs none. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`security/abuse.test.ts`](security/abuse.test.ts), [`security/security.instructions.md`](security/security.instructions.md), [`security/image-route.test.ts`](security/image-route.test.ts), [`security/image-route.ts`](security/image-route.ts), and [`devcontainer/devcontainer.json`](devcontainer/devcontainer.json). They are copies; nothing changes in your fork until you place them under `tests/`, `.github/instructions/`, `server/`, or `.devcontainer/`. The test results quoted below were observed on the author's machine on October 22, 2026 with Node.js 26; the flags and the behavior are the same on Node.js 24, and your counts differ if your fork already contains tests from earlier chapters. Do not claim an observation unless you made it.

## Writing the catalog's threat model and its first abuse-case tests

**Starting point:** a clone of your fork with `npm ci` done. The reference test file is [`security/abuse.test.ts`](security/abuse.test.ts).

1. Create a branch `users/YOUR-USERNAME/14_threat-model` from `main`. Create `docs/security/threat-model.md` from this template, and write a decision in every row in your own words; the chapter's Table 14.1 is one set of answers, and yours should say what you decided, not repeat it.

```markdown
# Threat model: Tailwind Gears catalog

Data flow: browser (src/catalog.ts) -> GET /api/products, /api/products/:id (server/app.ts)
-> read-only product data in memory (server/catalog.ts). No accounts, no database, no secrets.
Trust boundary: everything that arrives in an HTTP request is untrusted.

| Threat | What it would look like here | Decision | Covered by |
| --- | --- | --- | --- |
| Spoofing | | | |
| Tampering | | | |
| Repudiation | | | |
| Information disclosure | | | |
| Denial of service | | | |
| Elevation of privilege | | | |

Reviewed on: YYYY-MM-DD. Revisit when a route, a dependency, or a data source is added.
```

2. Copy `security/abuse.test.ts` to `tests/abuse.test.ts` and run `npm test`. Expect the four new tests to pass on the baseline (15 tests on an unchanged fork: the 11 baseline tests and these 4). Each test name starts with the STRIDE category it covers; fill the **Covered by** column of your model with the test names.
3. Break one property on purpose. In `server/app.ts`, delete the line `app.disable('x-powered-by')`, run `npm test`, and expect the test *information disclosure: the server does not announce its framework* to fail with the header value `Express` where `null` was expected. Restore the line with `git checkout -- server/app.ts` and run the tests again.
4. Commit the model and the tests, push, open a pull request against **your fork's `main`** (check the base repository), and merge it when `verify` passes. If you created the Chapter 12 ruleset, the check is required.

Keep the model under a page. The point is a record of decisions that gets updated, not a document that gets filed. See Microsoft's [STRIDE categories](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) for the definitions.

**Expected result:** a threat model with six decisions and four abuse-case tests on `main`, one of which you watched fail when its property was removed; no change to the catalog's behavior. **Return to the book:** continue with *Running attack simulations and red team versus blue team exercises*.

## Running a tabletop drill for a compromised contributor

**Starting point:** your fork, a browser, and thirty minutes. Nothing is executed; the attack is a story you walk through against your fork's real settings. Change no setting during the drill.

### The scenario

Read this before you open anything, and write down your prediction: which control stops it, and how many minutes until a person knows.

```text
Day 0, 09:05. A contributor to your fork (imagine a second account with write
access) received a message that looked like a GitHub notification about a failed
sign-in. They followed the link and typed their password and the code from their
authenticator app into a page that was not GitHub. The attacker now has a valid
session for that account.

09:20. From that account, the attacker creates a branch and opens a pull request
titled "Fix flaky CI step". The diff adds one step to .github/workflows/ci.yml:
a shell command that sends the job's environment variables to an address
outside GitHub. The description says the step "improves logging".

09:25. The attacker waits for the workflow to run on the pull request, and for
someone to merge it so that it runs on main with every future push.
```

### The timeline

1. Copy this sheet into `docs/security/drill-YYYY-MM.md` and fill in each row from your fork's actual settings as you check them in the next step. Write the minute at which a person would have known, and who that person is.

```markdown
| Minute | Attacker action | Signal in your fork | Who sees it | What they do |
| --- | --- | --- | --- | --- |
| 09:05 | Credentials phished | | | |
| 09:20 | Pull request with a workflow change opened | | | |
| 09:25 | Workflow run requested on the pull request | | | |
| 09:40 | A reviewer looks at the pull request | | | |
| 10:00 | Merge attempted | | | |
| 10:05 | The next push to main would run the step | | | |

First minute at which a person knew: ____  Time to contain: ____
```

2. Check the controls, in this order, and note what each one does in your fork:
   - **Settings**, **Actions**, **General**: under the approval setting for fork pull request workflows, read which contributors need approval. The scenario's attacker has write access, so this setting does not stop them; note that, and note what it would do for a pull request from a fork. See [Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository).
   - **Settings**, **Rulesets**: open the ruleset on `main` from Chapter 12 if you created it. Does it require a pull request, a passing check, and a review? With zero required approvals, the attacker can merge their own change; write that down.
   - **Settings**, **Rulesets** again, or `.github/CODEOWNERS` if you created it in Chapter 5: is `.github/workflows/` owned by someone whose review is required?
   - Your profile picture, **Settings**, **Security log**: filter with `repo:YOUR-USERNAME/tailwind-gears` and read what the last 90 days contain. This is where a sign-in from a new device or a new token would appear for the compromised account, not for yours. See [Reviewing your security log](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/reviewing-your-security-log).
   - The fork's **Security** tab: note whether Dependabot alerts, secret scanning, and private vulnerability reporting are enabled. Secret scanning and push protection are on by default in a public repository; they do not detect this scenario, because no secret is committed, and that is worth writing down too.
3. Walk the timeline minute by minute. At 09:25, GitHub runs the workflow for a contributor with write access without asking; the step runs with the job's read-only token and no repository secrets (the sample has none), so what leaks is the environment of a public build. At 09:40, the reviewer is the control: the chapter's advice is to read every change under `.github/workflows/` as a change to the pipeline's trust, and Chapter 11 explained what a step can reach. At 10:00, the ruleset decides whether one compromised account can merge alone.
4. Write three backlog items from the gaps, each with the control that closes it, for example: require one approval on `main`; add `.github/workflows/` to `CODEOWNERS` with a required code owner review; tighten the fork approval setting to all external contributors. Keep the sheet and the backlog next to the threat model. Do not apply the changes during the drill; apply the ones you want afterward, through pull requests, as separate decisions.

**Expected result:** a timeline with a first-detection minute and a containment time, written from your fork's real settings, and three backlog items; no setting changed and nothing executed. **Return to the book:** continue with *Securing development environments with Codespaces*.

## Hardening the sample's codespace configuration

**Starting point:** your fork and an approved Codespaces allowance, or a review of the configuration without creating a codespace. The reference file is [`devcontainer/devcontainer.json`](devcontainer/devcontainer.json). If you did the Chapter 4 activity, this replaces that configuration on a new branch; if not, the baseline has no `.devcontainer` directory and this adds one.

### Reviewing and adding the configuration

1. Create a branch `users/YOUR-USERNAME/14_codespace` from `main`. Add `.devcontainer/devcontainer.json` with the content of the reference file. Read it as a reviewer before committing, line by line: the image is the Dev Containers project's `typescript-node` image for Node.js 24, the user is `node` for both the editor and every command, the smallest machine is requested, one port is declared with a label, the only lifecycle command is `npm ci`, and no other repository is requested. See the [dev container JSON reference](https://containers.dev/implementors/json_reference/) and the [image's documentation](https://github.com/devcontainers/images/tree/main/src/typescript-node).
2. Decide whether to pin the image to a digest. The tag `24` moves with patch releases; a digest in the form `mcr.microsoft.com/devcontainers/typescript-node@sha256:...` does not. Read the current digest from the image's registry page or with `docker buildx imagetools inspect mcr.microsoft.com/devcontainers/typescript-node:24` if you have Docker, and note that a pinned image needs a deliberate update when a security fix ships.
3. Commit and push the branch.

### Creating the codespace and checking it

4. From the branch in your fork, open **Code**, **Codespaces**, **New with options**. Confirm the repository, the branch, the configuration file, the smallest machine type, and who pays before **Create codespace**. Wait for creation and read the creation log if it fails.
5. In the codespace terminal, run these commands and record the output:

```sh
whoami
id
node --version
npm run check
```

Expect `whoami` to print `node`, `id` to show a non-zero user id, Node.js 24, and the checks to pass. Then start the development server with the hostname setup from the Chapter 4 guide, because Vite rejects the forwarded hostname otherwise:

```sh
preview_host="${CODESPACE_NAME:?}-5173"
preview_host="${preview_host}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:?}"
export __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS="$preview_host"
npm run dev
```

6. Open the **Ports** panel. Expect port 5173 with the label **Catalog** and the visibility **Private**. Open it in the browser from the panel; GitHub asks you to sign in if you are not. Do not change the visibility. See [Forwarding ports in your codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace) and [Security in GitHub Codespaces](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces).
7. Stop the server with **Ctrl+C**. Open your profile picture, **Settings**, **Codespaces**, and read your default idle timeout and retention period. If an organization pays for your codespaces, open its **Settings**, **Codespaces**, **Policies** as well, or ask an owner what they are. See [Setting your timeout period](https://docs.github.com/en/codespaces/setting-your-user-preferences/setting-your-timeout-period-for-github-codespaces) and [Configuring automatic deletion](https://docs.github.com/en/codespaces/setting-your-user-preferences/configuring-automatic-deletion-of-your-codespaces).

### Cleaning up

8. At [github.com/codespaces](https://github.com/codespaces), choose **Stop codespace** for the practice environment, confirm that it is stopped, then **Delete** it. Closing the browser tab does neither. Merge the branch through a pull request if you want to keep the configuration, or close it.
9. Write three lines in `docs/security/threat-model.md` under a new heading on what this configuration prevents that the Chapter 4 version did not: a root shell, an unlabeled port, and access to any repository but this one.

**Expected result:** a reviewed dev container configuration that runs as a non-root user with one labeled private port and no access beyond its own repository, checked in a codespace that was then stopped and deleted; the organization policies, if any, read but not changed. **Return to the book:** continue with *Using AI in the security workflow as helper and threat*.

## Reviewing an assistant's change as untrusted input

**Starting point:** a clone of your fork and Copilot Chat in Visual Studio Code or another editor with a Copilot plan; the manual route at the end needs none. The reference files are [`security/security.instructions.md`](security/security.instructions.md), [`security/image-route.test.ts`](security/image-route.test.ts), and, for comparison afterward only, [`security/image-route.ts`](security/image-route.ts).

### The rules and the request

1. Create a branch `users/YOUR-USERNAME/14_image-endpoint` from `main`. Copy `security/security.instructions.md` to `.github/instructions/security.instructions.md`; its `applyTo` pattern makes Copilot's agents and code review apply it to the server and browser code (see [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)).
2. Open `server/app.ts` and `server/catalog.ts` in the editor, open Copilot Chat, and send this request:

```text
Add an endpoint GET /api/products/:id/image to server/app.ts that returns the
product's PNG image from the public/products directory as image/png. Follow the
repository's instructions. Do not add dependencies.
```

3. Apply the proposal exactly as given, without editing it, so that what you review is what the assistant wrote. Save the file.

### The review

4. Read the change against this checklist and write the answers down before running anything:
   - How is the file path built? From the request's `id`, or from the catalog's own product record?
   - What happens for an unknown id, for an id with `..` or `/` in it, and for an id that names a file that exists but is not a product?
   - Does the error response for a missing file reveal a path on disk?
   - Was a dependency added, or a new import that reads the file system in a second place?
   - Is there a test, and does it include a hostile id?
5. Copy `security/image-route.test.ts` to `tests/image-route.test.ts` and run `npm test`. The traversal test sends `..%2F..%2Fpackage.json`, `..%2Fproducts%2Fridge-helmet`, `ridge-helmet.png`, and `ridge-helmet%00` as ids and expects the catalog's own 404 body for each; the other test expects a real PNG for `ridge-helmet`. The table below says what to expect from the two shapes the proposal usually takes.

| Implementation shape | PNG test | Traversal test |
| --- | --- | --- |
| Looks the product up by id and serves the file named in the product record with a `root` | Passes | Passes |
| Builds the path from the id (for example `path.join(dir, id + '.png')`) and serves whatever exists | Passes | Fails, because a path-like id reaches a real file |

On October 22, 2026, the author ran both shapes: the first passed both tests and the second failed the traversal test, as the table says.

6. If the traversal test fails, fix the implementation yourself before you read the reference: look the product up, use the catalog's `image` field, and pass Express's `root` option to `sendFile`. Run the tests again. Only now compare your version with `security/image-route.ts`.
7. Run `npm run check` (expect 17 tests on a fork that has the Chapter 14 abuse tests and these two, and a successful build). Open a pull request against **your fork's `main`** with the endpoint, the two tests, and the instructions file, and read the diff once more against the checklist; or close the branch if you do not want the endpoint in your fork.

For the **manual alternative**, write the naive shape from the table yourself first, run the tests, and watch the traversal test fail; then write the safe shape and watch it pass. The review and the test are the lesson, not the assistant.

**Expected result:** a reviewed endpoint whose safest property is pinned by a test, a written checklist result, and an instructions file that applies the chapter's rules to the next change; the search behavior and the intentional defect are unchanged. **Return to the book:** continue with *Summary*.
