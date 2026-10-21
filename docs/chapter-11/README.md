# Chapter 11: optional automation and deployment exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data. No exercise authorizes changes in the author's repository.

Use **your fork** for branches, pull requests, environments, and workflow runs, and **your fork's `main`** as the target. The activities work on the unfixed baseline and on a fork that already contains the Chapter 3 search fix. None of them changes the application, its tests, or the intentional search defect; every change here is a workflow file, an instructions file, or a repository setting in your fork.

- [Enabling and reading the sample's CI workflow](#enabling-and-reading-the-samples-ci-workflow)
- [Running the checks on an Arm runner](#running-the-checks-on-an-arm-runner)
- [Promoting a build through staging and production](#promoting-a-build-through-staging-and-production)
- [Drafting a workflow change with Copilot](#drafting-a-workflow-change-with-copilot)
- [Investigating a failed run with an agentic workflow](#investigating-a-failed-run-with-an-agentic-workflow)
- [Summarizing commits with Copilot CLI in a workflow](#summarizing-commits-with-copilot-cli-in-a-workflow)

GitHub product instructions were checked against official documentation on October 21, 2026. Standard GitHub-hosted runners are free for public repositories, so the first three activities cost nothing in a public fork. The Copilot activities need a Copilot plan; the agentic workflow activity and the Copilot CLI activity consume AI credits from a paid plan, and the agentic workflow activity also needs the GitHub CLI with the `gh aw` extension and a fine-grained personal access token stored as a secret in your fork. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The complete files for the activities are in [`workflows/`](workflows/): [`ci-with-arm.yml`](workflows/ci-with-arm.yml), [`deploy.yml`](workflows/deploy.yml), [`workflows.instructions.md`](workflows/workflows.instructions.md), [`ci-investigator.md`](workflows/ci-investigator.md), and [`ai-summary.yml`](workflows/ai-summary.yml). They are reference copies; nothing runs until you place a copy under `.github/workflows/` or `.github/instructions/` in your fork, and the agentic workflow also needs its compiled `.lock.yml` file beside it.

## Enabling and reading the sample's CI workflow

**Starting point:** your fork, with `.github/workflows/ci.yml` unchanged. No branch is needed.

1. Open **Actions** in your fork. If the page says that workflows are not being run on this forked repository, read the notice, confirm that you understand the workflows the fork contains, and enable them. Scheduled workflows stay disabled on a fork by default; the sample has none. See [Disabling and enabling a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows).
2. In the left sidebar under **Workflows**, select **CI**. Select **Run workflow**, keep **Branch: main**, and select **Run workflow**. The button appears because the workflow declares `workflow_dispatch`, which only works once the file is on the default branch.
3. Wait for the run to appear at the top of the list and open it. Open the `verify` job.
4. Expand **Set up job**. Note the runner image, its version, and the runner application version. Expand the `npm run check` step and compare the test count and the build output with your local run from Chapter 2.
5. Open `.github/workflows/ci.yml` in a second tab and match every `uses` and `run` line to a step in the log. Note the run's duration in the run list.

If the run fails during `npx playwright install --with-deps chromium` or the browser tests, that is a setup or timing problem to investigate from the log, not the intentional search defect. The normal tests and the build pass on the baseline.

**Expected result:** a run that you started, with the runner image, every step, and the duration read from the log; nothing merged, deployed, or changed. **Return to the book:** continue with *Choosing and securing your runners*.

## Running the checks on an Arm runner

**Starting point:** your fork with Actions enabled. The complete file is [`workflows/ci-with-arm.yml`](workflows/ci-with-arm.yml); only its `verify-arm` job is new.

1. In your fork, create a branch named `practice/ch11-arm` from `main` using the branch selector.
2. On that branch, open `.github/workflows/ci.yml`, select the edit control, and append the following job after the `verify` job. Keep `verify` unchanged and use the same action versions, so that the file stays consistent and a later dependency update changes them together.

```yaml
  verify-arm:
    runs-on: ubuntu-24.04-arm
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run check
```

3. Commit to the branch and open a pull request against **your fork's `main`**. Check the base repository before creating it; GitHub may offer the author's upstream.
4. Wait for both jobs. Open **Set up job** in each and compare the runner image and architecture, then compare the two durations in the run summary. The Arm job runs the unit tests and the build only; the browser tests stay on the x64 job.
5. Decide whether the second job earned its place. Merge the pull request to keep it, or close it. Delete the branch afterward.

Standard Arm64 runners are standard runners: free and unlimited on a public repository, and billed at a lower per-minute rate than x64 on a private one. See the [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners) for the current labels and sizes.

**Expected result:** one workflow with two jobs on two architectures, and a side-by-side reading of their logs. **Return to the book:** continue with *Deploying in stages with environments, approvals, and infrastructure as code*.

## Promoting a build through staging and production

**Starting point:** your fork with Actions enabled. No cloud account is needed; the workflow deploys the built catalog to the runner that runs the job. The complete file is [`workflows/deploy.yml`](workflows/deploy.yml).

### Creating the environments

1. Open **Settings**, **Environments**, then **New environment**. Name it `staging` and select **Configure environment**. Leave it without protection rules.
2. Create a second environment named `production`. Under **Deployment protection rules**, select **Required reviewers**, add your own account, and save the rule. Leave **Prevent self-review** unselected for this solo exercise; in a team, select it, because a reviewer should not approve a deployment they triggered. Under **Deployment branches and tags**, choose **Selected branches and tags**, add the name pattern `main`, and save.

See [Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments). Users on GitHub Free can configure environments on public repositories, which your fork is.

### Adding the workflow

3. Create a branch named `practice/ch11-deploy` from `main`. On it, add the file `.github/workflows/deploy.yml` with the content of the reference file. Read the file before committing it: the `build` job uploads the `dist` directory as an artifact named `site`, the two deployment jobs download it, and each deployment job starts the built application and checks the catalog API.
4. Open a pull request against your fork's `main` and merge it. The CI workflow runs on the pull request; the Deploy workflow does not run yet, because it has only the `workflow_dispatch` trigger, and that trigger needs the file on the default branch.

### Running, approving, and rejecting

5. Open **Actions**, select **Deploy**, then **Run workflow** on `main`. Watch `build` finish and `deploy-staging` run. Expand its smoke-test step to see the health check answer and the catalog response.
6. When `deploy-production` shows that it is waiting, select **Review deployments** on the run page, select `production`, enter a comment such as `Practice approval`, and select **Approve and deploy**. The job downloads the same artifact and repeats the smoke test. See [Reviewing deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments).
7. Open **Deployments** in the right sidebar of your fork's home page. Find both deployments with their commit and the link to the run. See [Viewing deployment history](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/view-deployment-history).
8. Run the workflow once more. This time select **Reject** with a comment. The workflow fails, and the deployment history records the staging deployment only.

### Cleaning up

Nothing was deployed outside the runner, and the runner was discarded when each job ended. Keep the environments and the workflow if you want to extend them, for example with your platform's deployment action in place of the smoke test and an OpenID Connect login in front of it. Otherwise, remove the workflow file through a pull request and delete the two environments under **Settings**, **Environments**. Deleting an environment deletes its rules and secrets and fails any job waiting on it.

**Expected result:** a deployment history with one approved and one rejected production deployment, both traceable to a commit and a run; no running service. **Return to the book:** continue with *Authoring workflows with Copilot*.

## Drafting a workflow change with Copilot

**Starting point:** your fork, and Copilot Chat in Visual Studio Code or on GitHub.com with a Copilot plan; Copilot Free works within its message limits. The manual route below needs no subscription. The instructions file is [`workflows/workflows.instructions.md`](workflows/workflows.instructions.md).

1. Create a branch named `practice/ch11-copilot` from `main`. Add the file `.github/instructions/workflows.instructions.md` with the content of the reference file, adjusted to your own wording. Its `applyTo` pattern makes Copilot's cloud agent and code review apply it to workflow files; see [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions).
2. Open Copilot Chat with the repository as context and ask for the change:

```text
Add a concurrency group to .github/workflows/ci.yml so that a new push
to the same pull request cancels the run that is still in progress,
but runs on main are never cancelled. Keep every other line unchanged.
Explain each new line and tell me what it would cost or break.
```

3. Read the explanation before the YAML. Then review the proposal against four checks: the `on` block is unchanged, the `permissions` block is unchanged, no new `uses` line appeared, and no `run` line interpolates event data. Ask Copilot to explain any line you do not understand, and do not apply a line that it cannot explain either.
4. Apply the proposal if it passes, or make the change yourself by adding these lines after the `permissions` block:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

The group combines the workflow name and the Git ref, so each pull request and the `main` branch get their own group. The expression makes cancellation apply only to pull request runs; a push to `main` keeps its run. See the `concurrency` entry in the [workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).

5. Commit, open a pull request against your fork's `main`, and wait until the CI run has started. Push a second small commit to the branch, for example a comment line in the workflow file, and confirm in the run list that the first run was cancelled and the second completes.
6. Merge or close the pull request and delete the branch.

**Expected result:** a reviewed concurrency change with an explanation you can repeat, and an instructions file that applies the team's rules to the next workflow change. **Return to the book:** continue with *Running AI inside workflows and troubleshooting with it*.

## Investigating a failed run with an agentic workflow

**Starting point:** your fork with Actions enabled, a local clone of it, a Copilot plan on your account, and the GitHub CLI version 2.0.0 or later signed in with `gh auth login --scopes repo,workflow`. The complete workflow file is [`workflows/ci-investigator.md`](workflows/ci-investigator.md); it follows the trigger and output pattern of GitHub's [CI Doctor](https://github.com/githubnext/agentics/blob/main/workflows/ci-doctor.md) sample. GitHub Agentic Workflows are in public preview and may change; see [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows) and check the current documentation before you start.

### Storing the token

1. Your fork is a personal repository, so the workflow cannot bill the job's own token. Create a fine-grained personal access token with the **Copilot Requests** permission set to **Read** and nothing else, with a short expiration; see [Creating GitHub Agentic Workflows](https://docs.github.com/en/copilot/how-tos/github-agentic-workflows/creating-github-agentic-workflows).
2. In your fork, open **Settings**, **Secrets and variables**, **Actions**, select **New repository secret**, and store the token as `COPILOT_GITHUB_TOKEN`. Every run of the workflow draws AI credits from your Copilot plan; check your plan's allowance before you continue.

### Adding the workflow

3. Install the extension with `gh extension install github/gh-aw`. In your clone, create a branch `practice/ch11-agentic` and copy the reference file to `.github/workflows/ci-investigator.md`.
4. Run `gh aw compile` from the repository root. It validates the frontmatter and writes `.github/workflows/ci-investigator.lock.yml`. Open the lock file and read it once: find the jobs that the compiler generated around the agent and the `uses` references pinned to commit SHAs. Do not edit the lock file.
5. Commit both files, push the branch, and open a pull request against **your fork's `main`**. Check the base repository before creating it. Read the diff as a reviewer, then merge it; the trigger only works once the compiled workflow is on the default branch.

### Producing a failure and reading the result

6. Create a branch `practice/ch11-failure`. In `.github/workflows/ci.yml`, add the step `- run: npm run test:exercise` after the `npm run check` step of the `verify` job, and open a pull request against your fork's `main`. On the unfixed baseline, the exercise check fails by design, which gives the agent a real cause to find. If your fork already contains the Chapter 3 search fix, the check passes; use a step `- run: exit 1` named `Deliberate failure` instead.
7. Wait for the CI run to fail. The agentic workflow starts when that run completes: open **Actions**, select **Investigate the failed CI run** in the sidebar, and follow its jobs. When it finishes, open the issue whose title starts with `[CI failure]` and compare its diagnosis with the cause you know.
8. Record what the agent read and what it concluded, then close the practice pull request without merging, close the issue, and delete the branch. Run `gh aw logs` to see the run's duration and AI credits; `gh aw audit RUN-ID` shows the turn count and token usage of a single run.

The agent's token is read-only, the issue is created by a separate job after the threat-detection job has checked the agent's output, and nothing else can be changed by this workflow; see the [security architecture](https://github.github.com/gh-aw/introduction/architecture/) and [safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/) references. Keep the workflow if you want to extend it, or remove both files through a pull request. A workflow that stays consumes credits on every failed run.

For the **manual alternative**, run steps 3 and 4 in your clone without pushing anything and read the compiled file, or read GitHub's CI Doctor sample. The chain of jobs is what the activity teaches; the issue is the proof that it ran.

**Expected result:** an issue that names the failing step and its cause, created by a workflow whose agent could not have changed anything else; no fix merged. **Return to the book:** continue with *Troubleshooting with AI and controlling cost*.

## Summarizing commits with Copilot CLI in a workflow

**Starting point:** your fork and a paid Copilot plan on the account that owns it. In a personal repository, the job's `GITHUB_TOKEN` draws on the repository owner's Copilot plan; in an organization-owned repository, an organization owner must first enable the policy **Allow use of Copilot CLI billed to the organization**. See [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) and [About Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions). The complete file is [`workflows/ai-summary.yml`](workflows/ai-summary.yml).

1. Create a branch named `practice/ch11-ai` from `main` and add `.github/workflows/ai-summary.yml` with the content of the reference file. Read it before committing: it triggers on `workflow_dispatch` only, grants `contents: read` and `copilot-requests: write`, installs Copilot CLI, and runs one prompt with one allowed tool.
2. Open a pull request against your fork's `main` and merge it.
3. Open **Actions**, select **AI summary**, then **Run workflow** on `main`. When the run finishes, read the job summary on the run page, and expand the step to see the command's output.
4. Compare the summary with the commit history, for example with `git log --oneline -10` in your clone. Note anything that is wrong or missing; the output is a draft for a person to correct.
5. Open your Copilot usage in your account settings and note the AI credits the run consumed. If you do not want the workflow in your fork, remove it through a pull request. A scheduled version of it would consume credits on its own.

The `--allow-tool='shell(git log:*)'` flag permits only `git log` commands, `-s` keeps the output to the response text, and `--no-ask-user` stops the agent from waiting for an answer nobody will give. See [Running Copilot CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically). Do not trigger this workflow from pull requests, and never from pull requests from forks, because the prompt would then include text that an outsider controls.

For the **manual alternative**, install Copilot CLI locally with `npm install -g @github/copilot`, run the same `copilot -p` command in your clone, or write the release notes yourself from `git log`. The result is the same draft; the activity teaches the shape of the pipeline step.

**Expected result:** a draft of release notes produced inside a workflow and read by a person before it goes anywhere; no release published. **Return to the book:** continue with *Summary*.
