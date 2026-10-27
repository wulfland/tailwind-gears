# Chapter 16: optional architecture and modernization exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data, the agent requests are constructed examples, and no exercise authorizes changes in the author's repository.

Use **your fork** for branches, notes, and pull requests, and **your fork's `main`** as the target. Every activity starts from `main` and works on the unfixed baseline as well as on a fork that contains the Chapter 3 search fix, the Chapter 12 flag, or the Chapter 13 injector. None of them changes the search behavior: `npm run test:exercise` keeps failing on an unfixed fork by design, and the second and fourth activities treat that failure as evidence that nothing changed. Do not fix the search or implement the category feature as part of these activities.

- [Pinning the catalog's module boundaries with a fitness function](#pinning-the-catalogs-module-boundaries-with-a-fitness-function)
- [Growing a replacement search behind a switch](#growing-a-replacement-search-behind-a-switch)
- [Writing an architecture note with an assistant and checking every claim](#writing-an-architecture-note-with-an-assistant-and-checking-every-claim)
- [Running a sharded refactoring with an agent](#running-a-sharded-refactoring-with-an-agent)

GitHub product instructions were checked against official documentation on October 27, 2026. The first two activities cost nothing. The third uses Copilot Chat in your editor (any Copilot plan, including Copilot Free within its limits) or Claude Code; the manual route needs neither. The fourth assigns one task to the Copilot cloud agent, which needs a paid Copilot plan and consumes AI credits, or gives the same task to Claude Code; the manual route needs neither. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`boundaries/boundaries.test.ts`](boundaries/boundaries.test.ts), [`strangler/search.ts`](strangler/search.ts), [`strangler/search-parity.test.ts`](strangler/search-parity.test.ts), [`strangler/app.patch.md`](strangler/app.patch.md), [`refactoring/recipe.md`](refactoring/recipe.md), [`refactoring/health.ts`](refactoring/health.ts), [`refactoring/products.ts`](refactoring/products.ts), and [`refactoring/app.ts`](refactoring/app.ts). They are copies; nothing changes in your fork until you place them under `tests/` or `server/`. The test counts quoted below were observed on the author's machine on October 27, 2026 with Node.js 26; the flags and the behavior are the same on Node.js 24, and your counts differ if your fork already contains tests from earlier chapters. Do not claim an observation unless you made it.

## Pinning the catalog's module boundaries with a fitness function

**Starting point:** a clone of your fork with `npm ci` done. The reference file is [`boundaries/boundaries.test.ts`](boundaries/boundaries.test.ts); the baseline does not contain it.

1. Draw the map first. Run this command from the repository root and write down, for each of the three directories, which other directory it imports from:

```sh
grep -rn "from '\.\." server src shared
```

Expect `server/app.ts` and `server/catalog.ts` to import `../shared/product.ts`, `src/catalog.ts` to import `../shared/product.ts`, and `shared/product.ts` to import nothing. The browser and the server share the contract and nothing else.

2. Create a branch `users/YOUR-USERNAME/16_boundaries` from `main`. Copy `boundaries/boundaries.test.ts` to `tests/boundaries.test.ts`. Read the `rules` array: each entry names a source directory, a directory it must not import from, and the reason. The test reads every `.ts` file under the source directory as text, collects its relative imports, and fails on the first one that resolves into the forbidden directory. It uses only `node:fs`, `node:path`, and `node:test` (see Node.js, [Test runner](https://nodejs.org/api/test.html)).
3. Run `npm test`. Expect the five boundary tests to pass alongside the baseline's 11 tests (16 in total on an unmodified fork).
4. Break a rule on purpose. Add this line as the second line of `server/app.ts`, run `node --import tsx --test tests/boundaries.test.ts`, and read the failure:

```ts
import '../src/catalog.ts'
```

Expect `server/ never imports src/ (the server must not depend on browser code)` to fail with the message `server/app.ts imports src/catalog.ts`, and the other four tests to pass. Remove the line and run the test again.

5. Commit the test file only, push, and open a pull request against **your fork's `main`**; check the base repository, because GitHub offers the author's upstream. Merge it when the CI workflow is green.

If you add a module later that legitimately crosses a boundary, change the rule and its reason in the same pull request as the code, so that the reviewer sees both. Do not weaken the test to make a pull request pass.

**Expected result:** a fitness function on `main` that fails any pull request in which the browser code imports server code or the contract imports anything, and a map of the sample's three directories; no change to the catalog's behavior. **Return to the book:** continue with *Evolving the monolith with microservices and event-based architecture*.

## Growing a replacement search behind a switch

**Starting point:** a clone of your fork with `npm ci` done, on `main`. The reference files are [`strangler/search.ts`](strangler/search.ts), [`strangler/search-parity.test.ts`](strangler/search-parity.test.ts), and [`strangler/app.patch.md`](strangler/app.patch.md); the baseline does not contain them. The activity works on the unfixed baseline and on a fork with the search fix: the parity test compares the two implementations with each other, not with a fixed expectation.

### Growing the replacement

1. Create a branch `users/YOUR-USERNAME/16_strangler` from `main`. Copy `strangler/search.ts` to `server/search.ts` and read it. `searchProducts()` takes the product list as its first parameter and imports only the types in `shared/product.ts`; it owns no data, which is the shape a function needs before it can move to another process. Its filter is the same `includes(term)` as the function it replaces, on purpose.
2. Copy `strangler/search-parity.test.ts` to `tests/search-parity.test.ts` and read it. It runs `listProducts()` from `server/catalog.ts` and `searchProducts()` on every combination of ten queries, four sort orders, and both stock filters, and asserts that the lists of product ids are identical. One more test asserts that the new function does not reorder the catalog array itself.
3. Run `npm test`. Expect 81 parity tests to pass in addition to the baseline's 11 (92 on an unmodified fork, 97 with the boundary tests). The cases `HELMET` and `helmet` pass because both implementations return an empty list; that is parity, not correctness.

### Routing by a switch

4. Apply the two edits in `strangler/app.patch.md` to `server/app.ts`: import `searchProducts`, and make the `/api/products` handler call it only when the process runs with `TG_SEARCH=next`. The default path is unchanged.
5. Start the application twice and query it each time. With the switch:

```sh
TG_SEARCH=next npm run dev
```

and, in a second terminal, `curl "http://localhost:5173/api/products?q=Helmet&sort=price-asc"`; expect `metro-helmet` first and `total` of 2. Query `q=HELMET` and expect `total` of 0. Stop the server, start it without the variable, and repeat both queries; expect the same answers.

6. Run `npm run check` (the tests and a successful build) and `npm run test:exercise` (still one failing test on an unfixed fork). Commit `server/search.ts`, `tests/search-parity.test.ts`, and `server/app.ts`, open a pull request against **your fork's `main`**, and merge it. The switch is off unless someone sets the variable, so nothing changes for the deployed application.

| Query | `listProducts()` on the baseline | `searchProducts()` on the baseline | Parity test |
| --- | --- | --- | --- |
| `Helmet` | Ridge Helmet, Metro Helmet | The same two | Passes |
| `HELMET` | No products | No products | Passes |
| `Lock` with in-stock filter | No products (the Loop Lock is sold out) | No products | Passes |

The table says what to expect; on a fork with the Chapter 3 search fix, the first column changes for `HELMET` and the parity test fails until you port the same change into `searchProducts()`, which is the point of the test.

### Retiring the old implementation (optional)

7. In a fork that wants to complete the migration: make the handler call `searchProducts(products, ...)` unconditionally, delete `listProducts()` from `server/catalog.ts` and the parity test, and point `tests/catalog.test.ts` and `exercises/search.acceptance.ts` at `searchProducts(products, ...)`. Run `npm run check` and `npm run test:exercise`; the exercise still fails on an unfixed fork. Only after this pull request is merged does the search fix from Chapter 2 belong on its own branch.

The Chapter 12 flag registry is the better home for the switch in a fork that has it; the environment variable keeps this activity independent of that chapter. Do not improve the search while the parity test exists.

**Expected result:** two implementations of the search that a test proves identical, a switch that routes to the new one only when asked, and a pull request that changed no behavior; not a migrated system unless you did the optional retirement. **Return to the book:** continue with *Understanding and modernizing code with AI assistance*.

## Writing an architecture note with an assistant and checking every claim

**Starting point:** a clone of your fork and Copilot Chat in Visual Studio Code or another editor with a Copilot plan, or Claude Code in a terminal at the repository root; the manual route at the end needs neither. The baseline has no `docs/architecture.md`.

### The request

1. Create a branch `users/YOUR-USERNAME/16_architecture-note` from `main`. Open the repository in your editor, open Copilot Chat in agent mode (see [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide)), or start Claude Code, and send this request without changes:

```text
Write docs/architecture.md for this repository. Describe only what the code does
today; do not propose changes. Include these sections:

1. Modules: one paragraph each for server/index.ts, server/app.ts,
   server/catalog.ts, shared/product.ts, and src/catalog.ts.
2. Dependencies: which of these files import which, as a list.
3. HTTP contract: every route, its query parameters, its validation, and its
   error responses.
4. Pinned behavior: for each test file under tests/, the behaviors it pins.
5. Decisions a new developer must know: three, each in one sentence.

Every claim must end with the file and line number it is based on, in the form
(server/app.ts:12). Do not add a claim you cannot point at a line for. Do not
describe the search as case-sensitive or case-insensitive without citing the
line that decides it.
```

2. Save `docs/architecture.md` exactly as the assistant wrote it, so that what you check is what it produced. Commit it with the message `Architecture note as drafted` before you change anything.

### The check

3. Choose five claims, at least one from each of sections 1 to 4, and open the file and line each one cites. Mark each claim in the note with one of `held`, `wrong`, or `unverifiable` (no line, or a line that does not say what the claim says). Record the count of `held` out of five in the pull request description; it is your calibration for the next codebase, not a score for the assistant.
4. Fix every `wrong` claim yourself and delete every `unverifiable` one. Two places where a draft tends to go wrong on this sample: the search is case-sensitive because `server/catalog.ts` matches with `includes(term)`, and the server binds to `127.0.0.1` unless `HOST` is set, both of which a note may state the other way round if it assumes the common case. Those are expectations, not observations; record what your draft said.
5. Ask the assistant: `Which behavior of server/catalog.ts or server/app.ts does no test under tests/ pin? Name one and cite the lines.` Check the answer against the tests. If it holds, write one characterization test for that behavior in `tests/characterization.test.ts`, in the style of `tests/catalog.test.ts`, that passes on the current code; its name should say what the code does, not what it should do. One candidate on the baseline is the 120-character query limit, which `tests/api.test.ts` covers, so the assistant has to look further; another is that `listProducts()` with an unknown sort value returns the source order, which no test pins.
6. Run `npm test`, commit the corrected note and the test, and open a pull request against **your fork's `main`**. Merge it.

For the **manual alternative**, write the note yourself from the import map of the first activity and the route list in `server/app.ts`, with a file and line for every claim, and write the characterization test for the unknown-sort case. The checking habit is the lesson, not the assistant.

**Expected result:** an architecture note on `main` in which every claim names a file and line you or the assistant checked, a count of how many draft claims held, and one new test that pins a behavior nothing pinned before; no change to the catalog's behavior. **Return to the book:** continue with *Running large-scale refactorings with agents*.

## Running a sharded refactoring with an agent

**Starting point:** a clone of your fork with the boundary test from the first activity on `main`, and either the Copilot cloud agent on a paid Copilot plan for the account that owns the fork (each task consumes AI credits; check your allowance) or Claude Code; the manual route at the end needs neither. The reference files are [`refactoring/recipe.md`](refactoring/recipe.md), [`refactoring/health.ts`](refactoring/health.ts), and, for comparison afterward only, [`refactoring/products.ts`](refactoring/products.ts) and [`refactoring/app.ts`](refactoring/app.ts). If you did the strangler activity, the agent moves the `TG_SEARCH` switch along with the route; the recipe is unchanged.

The sample is small enough that you could finish all three shards by hand in an hour. The activity runs the loop at that size so that you have practiced the recipe, the exemplar, the gates, and the moved-lines review before you need them on a codebase where the shards number in the hundreds.

### The recipe and the exemplar

1. Read [`refactoring/recipe.md`](refactoring/recipe.md): the goal, the three shards, the five invariants, the exemplar, and the review rule. Copy it to `docs/refactoring/routes-recipe.md` on a branch `users/YOUR-USERNAME/16_shard-1` from `main`.
2. Do shard one yourself: create `server/routes/health.ts` from `refactoring/health.ts`, and in `server/app.ts` replace the inline health handler with `registerHealthRoutes(app)` and add the import. Nothing else changes.
3. Run the gates: `npm run check` (expect the same tests as before, 16 on a fork with the boundary tests, and a successful build), `npm run test:exercise` (still failing on an unfixed fork), and the moved-lines diff:

```sh
git add -N server/routes && git diff --color-moved=zebra
```

Expect the handler line to appear in the moved colors in both files and the only plain additions to be the import, the function wrapper, and the registration call. Commit the recipe and the shard, open a pull request against **your fork's `main`**, and merge it. This pull request is the exemplar.

### The agent's shards

4. In your fork, open __Issues__, select __New issue__, and create it with this title and body, replacing `NUMBER` with the number of the exemplar pull request:

```text
Refactoring shards 2 and 3: move the product routes into server/routes/products.ts
```

```text
Follow docs/refactoring/routes-recipe.md. Pull request #NUMBER is the exemplar
for shard 1; do shards 2 and 3 the same way.

Move the GET /api/products handler, including its query validation, and the
GET /api/products/:id handler from server/app.ts into a new module
server/routes/products.ts that exports registerProductRoutes(app). Call it from
createApp() after registerHealthRoutes(app) and before the /api fallthrough.

Invariants, all of them:
- Do not change any test file. npm run check must pass unchanged.
- npm run test:exercise must still fail with the same assertion. Do not touch
  the search behavior.
- tests/boundaries.test.ts must pass; the new module imports only from
  ../catalog.ts and ../../shared/product.ts.
- Move the handler bodies without editing them. git diff --color-moved=zebra
  must show them as moved lines.
- No new dependency, no new script, no change outside server/.

Run npm run check and npm run test:exercise and report both results in the
pull request description.
```

5. Open the issue, select __Assignees__, and choose __Copilot__; in the dialog, keep your fork as the repository and `main` as the base branch, and confirm (see [Starting GitHub Copilot sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-a-pr)). The agent works on a branch with a `copilot/` prefix and opens a draft pull request; it cannot mark it ready, approve it, or merge it (see [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)). With Claude Code instead, start it at the repository root on a branch `users/YOUR-USERNAME/16_shard-2-3`, paste the issue body as the request, and open the pull request yourself when it has finished.

### The review

6. Run the gates before you read the code. On the Copilot pull request, select __Approve and run workflows__ so that the CI workflow runs on the agent's branch (see [Reviewing pull requests created by Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/review-copilot-prs)). In your clone, fetch the branch and run:

```sh
git diff --color-moved=zebra main...copilot/BRANCH -- server
```

Read line by line only where a line inside a moved block changed, where a plain addition is not an import, a wrapper, or a registration call, or where a file outside `server/` changed. Each of those is a comment on the pull request, with `@copilot` and the exact correction on the Copilot pull request; workflows need approval again after the agent pushes.

7. When the workflow is green and the diff matches the recipe, merge the pull request and close the issue if the agent did not. Compare the merged `server/routes/products.ts` and `server/app.ts` with `refactoring/products.ts` and `refactoring/app.ts` only now; a different but recipe-conforming shape is fine.
8. Record in `docs/refactoring/routes-recipe.md` what the agent's pull request got right, what you had to correct, and how many credits the task consumed, if your plan shows it. That record is what you scale when the next refactoring has a hundred shards.

For the **manual alternative**, do shards 2 and 3 yourself on a branch `users/YOUR-USERNAME/16_shard-2-3` from `refactoring/products.ts` and `refactoring/app.ts`, run the same gates, and merge through a pull request.

| Gate | Expected on a conforming shard |
| --- | --- |
| `npm run check` | Same test count as before the shard (16 with the boundary tests), successful build, no test file in the diff |
| `npm run test:exercise` | One failing test on an unfixed fork, the same assertion as before |
| `tests/boundaries.test.ts` | Passes; `server/routes/products.ts` imports `../catalog.ts` and `../../shared/product.ts` only |
| `git diff --color-moved=zebra` | Handler bodies in the moved colors; plain additions are imports, wrappers, and registration calls |

On October 27, 2026, the author applied the three reference files to a clone and observed the first three rows as the table states, and a moved-lines diff in which the handler bodies were colored as moved; no agent was run for this guide, so the agent's output is an expectation, not an observation.

**Expected result:** `createApp()` composed from two route modules on `main`, three merged shards of which an agent produced two under a recipe you wrote, a moved-lines review you can repeat, and the intentional search defect untouched. **Return to the book:** continue with *Summary*.
