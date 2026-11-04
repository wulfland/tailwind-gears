# Chapter 19: optional enterprise exercises and Copilot rollout templates

The chapter can be read without doing these activities or using the templates. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together, and it holds the two templates the chapter's last section mentions. All scenarios use fictional sample data, the organization and the pipeline below are constructed for the exercises, and nothing here authorizes changes in the author's repository.

Most of what an enterprise administrator does on GitHub needs an enterprise account, which a reader cannot create for practice. The two activities therefore use what a free organization and a public fork can show: the containers, teams, permissions, rules, and audit log of the second section, and the inventory, mirror, and pipeline conversion of the third. The Copilot rollout and the policy baseline of the fourth section do not run in a fork at all, which is why they are templates for your own organization rather than activities.

Use **your fork** and **your own organization** for repositories, branches, and pull requests, and **your fork's `main`** as the target of any pull request. The activities work on the unfixed baseline as well as on a fork that contains the Chapter 3 search fix or the Chapter 12 flag; do not repeat the search fix or implement the unresolved category feature for this chapter.

- [Setting up an organization with teams, base permissions, and a protected default branch](#setting-up-an-organization-with-teams-base-permissions-and-a-protected-default-branch)
- [Rehearsing a migration with an inventory, a mirror, and a converted pipeline](#rehearsing-a-migration-with-an-inventory-a-mirror-and-a-converted-pipeline)
- [Copilot rollout templates](#copilot-rollout-templates): the rollout plan and the policy baseline

GitHub product instructions were checked against official documentation on November 4, 2026. Both activities are free: a free organization, a public fork, and the Actions minutes of a public repository cost nothing, and neither activity needs a Copilot plan unless you use an assistant for the conversion step, which has a manual alternative. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`migration/inventory.sh`](migration/inventory.sh), [`migration/azure-pipelines.yml`](migration/azure-pipelines.yml), [`migration/ci-converted.yml`](migration/ci-converted.yml), [`rollout-plan.md`](rollout-plan.md), and [`policy-baseline.md`](policy-baseline.md). Nothing changes in a repository until you copy one into it. The outputs quoted below were observed on the author's machine on November 4, 2026, with the GitHub CLI 2.102, Git 2.56, and Node.js 26; the mirror was rehearsed between two local repositories, and the organization steps were not replayed in a live organization, so treat every expected result as an expectation to confirm.

## Setting up an organization with teams, base permissions, and a protected default branch

**Starting point:** a personal GitHub account that may create a free organization, and the sample at [wulfland/tailwind-gears](https://github.com/wulfland/tailwind-gears). You do not need an existing fork; this activity creates one inside the new organization. Plan about forty minutes. You will be the organization's only member, which means no permission can lock you out; what you are practicing is the structure, and the system answers back through inherited access, the code owners check, the merge box, and the audit log.

### Creating the organization and bringing the sample in

1. Open your profile picture, then __Settings__, then __Organizations__ in the __Access__ section, and select __New organization__. Choose the free plan, name the organization `YOUR-USERNAME-tailwind` (organization names are unique on GitHub, so add a suffix if that one is taken), and finish the prompts with your personal account as the owner (see [Creating a new organization from scratch](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch)).
2. Open [wulfland/tailwind-gears](https://github.com/wulfland/tailwind-gears), select __Fork__, choose the new organization as __Owner__, keep the name, and select __Create fork__. In a migration of your own work you would transfer a repository instead of forking it, from its __Settings__ under __Danger Zone__, __Transfer ownership__ (see [Transferring a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)); the fork keeps this exercise clear of your personal fork.
3. In the organization, open __Settings__, __Member privileges__, and set __Base permissions__ to __No permission__ (see [Setting base permissions for an organization](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization)). Members of a public organization can still read its public repositories, so nothing visible changes here; the setting is the enterprise starting point, in which access comes from teams rather than from membership.

### Granting access through nested teams

4. Open __Teams__, select __New team__, name it `catalog`, keep the visibility __Visible__, and create it. Create a second team `catalog-reviewers` and set __Parent team__ to `catalog` (see [Creating a team](https://docs.github.com/en/organizations/organizing-members-into-teams/creating-a-team) and [About teams](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams)). Add yourself as a member of `catalog-reviewers` only.
5. In the fork, open __Settings__, __Collaborators and teams__, select __Add teams__, choose `catalog`, and give it the __Write__ role. Then open the `catalog-reviewers` team page and its __Repositories__ tab: the fork is listed with write access although you never added the child team. That is the inheritance the chapter describes; a child team inherits its parent's access and never the other way around.

### Naming code owners and letting a rule use them

6. In a clone of the fork, create a branch `practice/codeowners` and add the file `.github/CODEOWNERS` with one line that names a team that does not exist, replacing `YOUR-ORG` with the organization's name:

   ```text
   server/ @YOUR-ORG/platform
   ```

   Commit, push, and open the file in the browser. GitHub highlights the error on that line, because the owner is unknown (see [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)). Change the owner to `@YOUR-ORG/catalog-reviewers`, push again, and the error is gone: the team is visible and has write access through its parent, which are the two conditions the documentation names.
7. Still in the fork, open __Settings__, __Rules__, __Rulesets__, select __New ruleset__, then __New branch ruleset__. Name it `protect-main`, set __Enforcement status__ to __Active__, add the default branch under __Target branches__, and under __Rules__ select __Require a pull request before merging__ with one required approval and __Require review from Code Owners__ (see [Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)). Rulesets are available in public repositories on the free plan; Chapter 12's activity created a similar ruleset in your personal fork, and this one adds the code owners requirement.
8. Open a pull request from `practice/codeowners` to the fork's `main`. The merge box shows that a review is required and that `catalog-reviewers` was requested, and GitHub does not let you approve your own pull request. This is the rule doing its job in a one-person organization. To merge anyway, edit the ruleset and add __Organization admin__ to the __Bypass list__, then merge; the merge is a recorded bypass, which is the honest way to get past a rule and the one an auditor can see.

### Reading the audit log

9. Open the organization's __Settings__, then __Logs__, then __Audit log__. Filter with `action:team`, then `action:repository_ruleset`, then `action:org.update_default_repository_permission`, and select __Export__ to download the JSON (see [Reviewing the audit log for your organization](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)). Expect entries for the team creation, the repository added to the team, the ruleset creation and update, and the base permission change, each with the actor and the time. The organization audit log keeps 180 days; the audit log API and streaming need GitHub Enterprise Cloud.

Table 1 says what this organization shows and what only an enterprise account adds, so that you do not look for a setting that is not there.

| Control | In the free practice organization | Added by GitHub Enterprise Cloud |
| --- | --- | --- |
| Teams, nested teams, team access to repositories | Yes | Enterprise teams across organizations; team synchronization with Entra ID or Okta |
| Base permissions | Yes | An enterprise policy that locks the setting for every organization |
| Rulesets | Repository level on public repositories | Organization level (GitHub Team or Enterprise) and enterprise level, targeting by custom properties |
| Roles | The five repository roles and the pre-defined organization roles | Up to 20 custom repository roles and 20 custom organization roles |
| Audit log | 180 days in the browser, with export | The API and streaming to a storage account or a monitoring tool |
| Identity | Personal accounts | SAML or OIDC single sign-on, SCIM, Enterprise Managed Users |
| Repository visibility | Public and private | Internal repositories visible to every enterprise member |

*Table 1: What the practice organization can show and what an enterprise account adds, as of November 4, 2026*

Nothing in this activity costs money. Keep the organization for the next activity, or delete it afterward from its __Settings__ under __Danger zone__; deleting an organization is irreversible and deletes the fork inside it.

**Expected result:** an organization with a base permission of none, a parent and a child team in which the child inherits write access, a code owners file that GitHub validated, a protected default branch that requires a code owner's review, one merged pull request that records a bypass, and an exported audit log. It is not an enterprise: no policy, single sign-on, internal repository, or custom role exists in it. **Return to the book:** continue with *Migrating to GitHub with the Importers and AI assistance*.

## Rehearsing a migration with an inventory, a mirror, and a converted pipeline

**Starting point:** your personal fork and its clone, the GitHub CLI signed in (`gh auth status`), Git, and Node.js 24 LTS; an organization you own as the target of the mirror, for example the practice organization from the first activity; and, for the conversion step, Copilot Chat in your editor or Claude Code, or the manual table below. Everything runs on public repositories and costs nothing; the converted workflow uses the Actions minutes of your public fork.

### Taking the inventory

1. From your clone, run the inventory script against your fork, replacing `YOUR-USERNAME`:

   ```sh
   sh docs/chapter-19/migration/inventory.sh YOUR-USERNAME/tailwind-gears
   ```

   The script reads the repository through the GitHub CLI and prints a Markdown table with one row per item and a column that says whether a Git mirror would move it. Expect a size of about 600 KB, your branches and tags, no releases, one workflow file, and whatever issues and pull requests you created in earlier chapters. Run it again against `wulfland/tailwind-gears` and compare: on November 4, 2026 the upstream repository had 10 branches, 11 pull requests, 5 issues, 1 environment, and 0 rulesets, and your fork started with none of the pull requests and issues, because a fork copies Git data only. That difference is the first lesson of the activity before anything is moved.
2. Keep the two tables in a file `docs/migration/inventory.md` on a branch `practice/migration` of your fork. In a real migration the inventory also lists Git LFS use, the largest files (GitHub's planning guide recommends `git-sizer`), installed apps, secrets, environments, and the owner who will validate the result; the script prints what the API can see and leaves those rows to you.

### Mirroring into the target organization

3. Clone your fork bare, which produces a repository without a working directory and with every ref:

   ```sh
   git clone --bare https://github.com/YOUR-USERNAME/tailwind-gears.git tailwind-gears.git
   ```

4. Create the empty target in your organization and turn Actions off in it before anything arrives, replacing `YOUR-ORG` (see [`gh repo create`](https://cli.github.com/manual/gh_repo_create) and [Set GitHub Actions permissions for a repository](https://docs.github.com/en/rest/actions/permissions#set-github-actions-permissions-for-a-repository)):

   ```sh
   gh repo create YOUR-ORG/tailwind-gears-mirror --public --disable-wiki
   gh api -X PUT repos/YOUR-ORG/tailwind-gears-mirror/actions/permissions -F enabled=false
   ```

   A mirror push delivers `main`, and the CI workflow on it would start on arrival. In a rehearsal that only wastes minutes; in a cut-over it deploys twice, once from each platform, which is why workflows stay off in the target until the source is frozen.
5. Push every ref:

   ```sh
   cd tailwind-gears.git
   git push --mirror https://github.com/YOUR-ORG/tailwind-gears-mirror.git
   ```

   Expect one `[new branch]` line per branch and one `[new tag]` line per tag. Between two local repositories on the author's machine, ten branch refs went across and nothing else existed to go.
6. Run the inventory against the mirror. Expect the same branches and tags, the one workflow file, and zeros everywhere else: no pull requests, no issues, no environment, no rulesets, and the wiki disabled. Write the two columns side by side in your inventory file. The gap between them is what GitHub Enterprise Importer closes for pull requests, issues, and releases, and what nothing closes for secrets, environments, runners, and access, which someone re-creates by hand.
7. Delete the mirror when you are done, from its __Settings__ under __Danger Zone__ or with `gh repo delete YOUR-ORG/tailwind-gears-mirror`, which needs the `delete_repo` scope; the command is irreversible, so read the repository name twice.

### Converting the pipeline with an assistant

8. Read [`migration/azure-pipelines.yml`](migration/azure-pipelines.yml). It is a constructed Azure Pipelines definition of the catalog's build: the sample never ran on Azure Pipelines, and the file exists so that you can convert something real in shape without an Azure DevOps organization. It contains the steps of the sample's own `ci.yml` plus four constructs that have no file-level equivalent on GitHub: a variable group, a Key Vault task that uses a service connection, a test results publisher, and a pipeline artifact.
9. In your clone, open Copilot Chat in agent mode or start Claude Code, and send this request:

   ```text
   Convert docs/chapter-19/migration/azure-pipelines.yml into a GitHub Actions
   workflow at .github/workflows/ci-converted.yml. Keep the triggers: pushes to
   main and pull requests. Use actions/checkout and actions/setup-node pinned to
   a major version, Node.js 24, and the npm cache. Set permissions to
   contents: read. Map every task to its equivalent, keep the npm and npx
   commands exactly as they are, and for each construct with no equivalent (the
   variable group, the Key Vault task and its service connection, the test
   results publisher) add a comment that says what someone has to create by
   hand instead of inventing a secret or a value. Do not change
   .github/workflows/ci.yml or any other file.
   ```

10. Compare the assistant's file with [`migration/ci-converted.yml`](migration/ci-converted.yml), which is one correct conversion, and with the sample's own `.github/workflows/ci.yml`, which is what a team that had never used Azure Pipelines wrote. Table 2 is the checklist.

| Azure Pipelines construct | What it becomes | What to check |
| --- | --- | --- |
| `trigger` on `main` and `pr` on all branches | `on: push` to `main` and `on: pull_request` | Both events are present |
| `pool: vmImage: ubuntu-latest` | `runs-on: ubuntu-latest` | A timeout was added, as in `ci.yml` |
| `variables: group: catalog-ci` | Repository or environment variables and secrets, created by hand | A comment says so; no value was invented |
| `UseNode@1` with `24.x` | `actions/setup-node` with `node-version: '24'` | Pinned to a major version; the npm cache is a GitHub addition |
| `AzureKeyVault@2` with a service connection | An Actions secret, or a sign-in to Azure with OIDC inside the job | No secret value in the file; a comment names the manual step |
| `script` steps | `run` steps with the same commands | The npm scripts were not rewritten |
| `PublishTestResults@2` | `actions/upload-artifact` of `results/junit.xml`, kept even when tests fail | The step has `if: ${{ !cancelled() }}` or an equivalent |
| `PublishPipelineArtifact@1` | `actions/upload-artifact` of `dist` | Same path |
| Nothing | `permissions: contents: read` | Least privilege the source pipeline never declared |

*Table 2: The mapping an assistant should produce for the constructed pipeline, and what to check in each row*

11. Run `actionlint .github/workflows/ci-converted.yml` if you have [actionlint](https://github.com/rhysd/actionlint) installed, commit the workflow on a branch `practice/pipeline-conversion`, push, and open a pull request against **your fork's `main`**, checking the base repository. Two checks run, __CI__ and __CI (converted)__. Expect both to pass; the converted run's summary lists two artifacts, `browser-test-results` with the JUnit file and `site` with the built catalog. On the author's machine, the same commands produced eight passing browser tests and a `results/junit.xml` of eight test cases. The `PREVIEW_TOKEN` secret does not exist in your fork, so that step ran with an empty value and nothing noticed, which is the kind of silent gap the Importer's manual-steps list and your own checklist exist to catch.
12. Close the pull request without merging and delete the branch, or keep it as the record of the rehearsal; a fork with two CI workflows that do the same work is not an improvement.

The manual alternative to steps 9 and 10 is to fill Table 2 by hand and write the workflow from `ci.yml` plus the two artifact steps; the reference file shows the result.

### If you have a source system

The steps above need no Azure DevOps, Jenkins, or GitLab instance. If you have one, GitHub Actions Importer runs the same shape of work at scale, from a Docker container through a GitHub CLI extension (see [Automating migration with GitHub Actions Importer](https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/automated-migrations/use-github-actions-importer)):

```sh
gh extension install github/gh-actions-importer
gh actions-importer update
gh actions-importer configure
gh actions-importer audit azure-devops --output-dir tmp/audit
gh actions-importer dry-run azure-devops pipeline --pipeline-id PIPELINE-ID --output-dir tmp/dry-run
```

`audit` writes a summary of every pipeline and its unknown steps, `forecast` estimates runner usage from history, `dry-run` writes the converted workflow to disk, and `migrate` opens a pull request in the target repository with a __Manual steps__ section for secrets, service connections, and self-hosted runners. This guide contains no source system to run them against, and the author did not run them while preparing it. GitHub Enterprise Importer, for the repositories themselves, needs a GitHub Enterprise Cloud organization as the destination and the migrator role on both sides, so it is not part of this activity either.

**Expected result:** an inventory for two repositories, a mirror that shows which refs move and which records do not, and a converted workflow that ran in your fork with its manual steps written down as comments. It is not a migration: no identity was reclaimed, no secret was created, and the old pipeline file still exists. **Return to the book:** continue with *Rolling out Copilot and managing AI policy at scale*.

## Copilot rollout templates

Rolling out Copilot and governing it is enterprise administration, and it does not run in a fork. The two templates below are for your own organization. Copy them into a repository your platform team owns, fill them in, and keep them under review like any other policy. Both are checklists with blanks, not policies; the values that belong in the blanks are yours.

### The rollout plan

[`rollout-plan.md`](rollout-plan.md) is a one-page plan for a Copilot rollout in waves: who gets a seat in which wave, what each wave must show before the next one starts, what the baseline measurements are, and who pays. The chapter's fourth section explains each row.

### The policy baseline

[`policy-baseline.md`](policy-baseline.md) lists the Copilot and AI controls an enterprise administrator sets, where each one lives, what the recommended starting value is, who may change it, and how often it is reviewed. The chapter's last subsection walks through the rows; the table is the artifact to take into a meeting with your security and legal teams.
