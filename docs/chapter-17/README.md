# Chapter 17: optional repository exercise and team design templates

The chapter can be read without doing the activity or using the templates. This guide keeps the activity's starting point, instructions, expected result, and reading-resumption point together, and it holds the templates the chapter's other sections mention. All scenarios use fictional sample data, the two teams named below are constructed for the exercise, and nothing here authorizes changes in the author's repository.

Team design is the one topic in the book that does not run in a fork, which is why this chapter has a single hands-on activity, on repository strategy, and three templates for your own team instead of three more activities. The activity works on the unfixed baseline as well as on a fork that contains the Chapter 3 search fix, the Chapter 12 flag, or the Chapter 16 boundary test and route modules, and it changes nothing in your fork except, optionally, two topics. Do not fix the search or implement the category feature as part of it.

- [Working in a slice of the repository with partial and sparse checkout](#working-in-a-slice-of-the-repository-with-partial-and-sparse-checkout)
- [Team design templates](#team-design-templates): the team map, the team API with its request form, and the delegation worksheet

GitHub and Git product instructions were checked against official documentation on November 1, 2026. The activity is free: it needs no Copilot plan, no cloud environment, and no AI credits. Check current access and policy before using preview features such as star lists. Public practice material must not contain real customer information, internal conversations, or credentials.

The template files are [`team-map.md`](team-map.md), [`team-api.md`](team-api.md), [`request.yml`](request.yml), [`backlog-items.md`](backlog-items.md), and [`delegation.md`](delegation.md). Nothing changes in a repository until you copy one into its `docs/` or `.github/` directory. The outputs quoted below were observed on the author's machine on November 1, 2026, with Git 2.56 and Node.js 26, in a clone of the unmodified baseline; the commands behave the same on Git 2.25 or later and Node.js 24, and your test counts differ if your fork already contains tests from earlier chapters. Do not claim an observation unless you made it.

## Working in a slice of the repository with partial and sparse checkout

**Starting point:** your fork's clone URL, Git 2.25 or later (`git --version`), and Node.js 24 LTS. Work in a new directory outside your existing clone; nothing in this activity changes your fork. Step 5 is optional and uses the `scalar` command, which ships with Git 2.38 and later; step 7 is optional and builds a meta repository on your disk only.

### Cloning the history without the files

1. Clone your fork with a blob filter and a sparse checkout, replacing `YOUR-USERNAME`:

```sh
git clone --filter=blob:none --sparse https://github.com/YOUR-USERNAME/tailwind-gears.git tailwind-slice
cd tailwind-slice
ls
git sparse-checkout list
```

Expect the directory to contain only the top-level files (`README.md`, `index.html`, `package.json`, `package-lock.json`, `playwright.config.ts`, `tsconfig.json`, and the dotfiles) and `git sparse-checkout list` to print nothing, because no directory is in the checkout yet (see Git, [git clone](https://git-scm.com/docs/git-clone) and [git sparse-checkout](https://git-scm.com/docs/git-sparse-checkout)). GitHub serves the blob filter; a server that does not support it answers with `warning: filtering not recognized by server, ignoring` and sends a full clone, which is what the author observed when cloning from a local path for this guide.

### Working in the server's slice

2. Add the directories the Catalog API team of the chapter's scenario works in, install, and run the two server test files:

```sh
git sparse-checkout set server shared tests scripts
npm ci
node --import tsx --test tests/catalog.test.ts tests/api.test.ts
```

Expect `ls` to show the four directories beside the top-level files and the tests to report `tests 9`, `pass 9`, `fail 0` on an unmodified fork. The server and its tests run without the browser code. Running `npm test` instead also runs `tests/seed.test.ts`, which reads `docs/chapter-02/backlog.json` and fails in the slice with `ENOENT`; that is the slice telling you which files a test depends on, not a defect.

3. Try to build:

```sh
npm run build
```

Expect the build to fail with `Error: Failed to resolve /src/catalog.ts from .../index.html`, because the catalog is one deployable unit and `index.html` needs the browser code. This is the deployability row of Chapter 16's Table 16.1 made visible: a team can test its slice alone and cannot ship it alone.

### Growing the slice

4. Add the browser code and the files the remaining checks need, then run the full check:

```sh
git sparse-checkout add src public docs/chapter-02
npm run check
```

Expect `tests 11`, `pass 11`, `fail 0` and a successful Vite build. `git sparse-checkout list` now prints `docs/chapter-02`, `public`, `scripts`, `server`, `shared`, `src`, and `tests`; `git sparse-checkout disable` restores every file if you want the whole repository in this clone.

5. Optional, with Git 2.38 or later: clone the same fork with Scalar and compare.

```sh
cd ..
scalar clone https://github.com/YOUR-USERNAME/tailwind-gears.git tailwind-scalar
ls tailwind-scalar/src
```

Expect the working tree in `tailwind-scalar/src` to contain only the top-level files, because Scalar turns on a sparse checkout and a partial clone by default and registers the repository for background maintenance; `git sparse-checkout set` grows it as in step 2 (see Git, [scalar](https://git-scm.com/docs/scalar)). Run `scalar unregister tailwind-scalar` before deleting the directory so that no maintenance task is left scheduled for it.

### Finding the repository among many

6. In your fork on GitHub, select the gear next to __About__ on the main page, add the topics `tailwind-gears` and `book-exercise` under __Topics__, and select __Save changes__ (see GitHub, [Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)). Then search for `topic:book-exercise user:YOUR-USERNAME` in GitHub's search box and expect your fork in the result (see [Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)). A repository can carry up to twenty topics of up to fifty lowercase characters each.

### Assembling several repositories (optional)

7. Build a meta repository on your disk that references your fork as a submodule. Do not push it anywhere.

```sh
cd ..
mkdir tailwind-meta && cd tailwind-meta && git init -b main
git submodule add https://github.com/YOUR-USERNAME/tailwind-gears.git catalog
git commit -m "Add catalog submodule"
cat .gitmodules
git submodule status
```

Expect `.gitmodules` to record the path `catalog` and your fork's URL, and `git submodule status` to print the commit your fork's `main` is at, followed by `catalog (heads/main)`. Then clone the meta repository and confirm that one command assembles the whole:

```sh
cd .. && git clone --recurse-submodules tailwind-meta meta-clone
ls meta-clone/catalog
```

Expect the catalog's files inside `meta-clone/catalog`. The author observed these outputs with a local path as the submodule URL, which needs `git -c protocol.file.allow=always` on current Git; with your fork's HTTPS URL no extra option is needed. Delete `tailwind-meta` and `meta-clone` afterward.

| Step | Command | Expected on an unmodified fork |
| --- | --- | --- |
| 1 | `git clone --filter=blob:none --sparse ...` | Top-level files only; `git sparse-checkout list` prints nothing |
| 2 | `git sparse-checkout set server shared tests scripts` and the two test files | `tests 9`, `pass 9`, `fail 0` |
| 3 | `npm run build` | `Failed to resolve /src/catalog.ts from .../index.html` |
| 4 | `git sparse-checkout add src public docs/chapter-02` and `npm run check` | `tests 11`, `pass 11`, `fail 0`, build succeeds |
| 7 | `git submodule status` in the meta repository | The commit of your fork's `main` and `catalog (heads/main)` |

The table states expectations; the test counts rise on a fork that added tests in Chapters 12 to 16.

**Expected result:** a slice of your fork in which the server side runs and tests in isolation while the build shows that the catalog still ships as one unit, two topics on your fork that a search finds, and, optionally, a local meta repository that assembles the fork with one command; not a split repository, which would be a Chapter 16 migration. **Return to the book:** continue with *Shaping teams for AI-amplified delivery*.

## Team design templates

These three templates are for your own team and repository, not for the fork. The chapter's sections on Conway's Law, team topologies, and AI-amplified delivery point to them. Each is a Markdown file or a YAML file you copy and fill in; the catalog's details are filled in where they are the same for everyone, and the constructed Catalog API and Storefront teams stand in for teams you have.

### The team map

[`team-map.md`](team-map.md) holds the architecture map of the baseline, already filled in, and open sections for the communication map, the places where the two disagree, and the contract rule. Two commands produce the maps for any repository:

```sh
grep -rn "from '\.\." server src shared
git shortlog -sn HEAD server src shared
```

On the baseline, the first command shows `server/app.ts`, `server/catalog.ts`, and `src/catalog.ts` importing `../shared/product.ts` and nothing else crossing a directory; the second lists one author. In your own repository, replace the directories with your module roots, and read the second command's output per directory as the communication structure the code was built in: who touches which part, and whose pull requests cross the boundary.

To record a contract rule, add a `CODEOWNERS` line for the shared file that names both owning teams, for example `/shared/product.ts  @ORG/catalog-api @ORG/storefront`. Teams must belong to the organization and have write access to the repository, the file must stay under 3 MB, and the last matching pattern wins (see GitHub, [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)). Requiring a code owner's approval before merging is a separate ruleset setting, which Chapter 12 covers.

### The team API and the request form

[`team-api.md`](team-api.md) is a team API written for the constructed Catalog API team, with the sections the chapter names: the team and its focus, its type, what it owns, what it provides and how to call it, how to request work, how it communicates and when it answers, what it is working on, and the teams it interacts with in which mode. Copy it to `docs/team-api.md` in your repository, keep what fits, and make every promise checkable; a service level nobody can meet is a broken promise in writing.

[`request.yml`](request.yml) is an issue form named __Request from another team__ with a description of the need, the date by which it matters, the interaction mode the requester expects, and a contact. Copy it to `.github/ISSUE_TEMPLATE/request.yml` on your default branch, and it appears beside your other forms under __New issue__ (see GitHub, [Syntax for issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)). The Team Topologies authors publish their own [Team API template](https://github.com/TeamTopologies/Team-API-template) under the CC BY-SA 4.0 license; the file here uses its own headings and wording, and if you copy the original instead, keep its copyright and license notice.

### The delegation worksheet

[`delegation.md`](delegation.md) is the worksheet from the end of the chapter's last section: a table with one row per backlog item and three decisions (who does the work, what gate it passes before it merges, and what must be written down before an agent could take it), a review budget, and an agents section to add to the team API. [`backlog-items.md`](backlog-items.md) supplies six constructed items drawn from the book's earlier chapters, from the case-sensitive search to a scanner finding, with the facts needed to decide, and ends with one possible set of answers for comparison afterward; use your team's real backlog instead when you have it.

For the review budget, count the pull requests your team reviewed and merged in the last month and estimate the minutes each one took to read properly; the product is the hours a month the team spends reviewing, and the limit on agent tasks in flight follows from it, not from the plan's allowance. Chapter 1's measurements, review waiting time and pull request size, are how you check the limit later. The worksheet starts no agent; Chapters 8 and 12 are where you act on the agreement it records.
