# Chapter 13: optional testing exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together. All scenarios use fictional sample data. No exercise authorizes changes in the author's repository.

Use **your fork** for branches, pull requests, and workflows, and **your fork's `main`** as the target. The activities work on the unfixed baseline and on a fork that already contains the Chapter 3 search fix or the Chapter 12 flag; where a number differs between those states, the guide says so. None of them fixes the search defect or implements the category feature, and `npm run test:exercise` keeps failing on an unfixed fork by design.

- [Mapping the sample's tests onto the pyramid](#mapping-the-samples-tests-onto-the-pyramid)
- [Adding a coverage gate and a reliability run](#adding-a-coverage-gate-and-a-reliability-run)
- [Running a chaos experiment against the catalog](#running-a-chaos-experiment-against-the-catalog)
- [Generating tests with Copilot and keeping the ones that earn their place](#generating-tests-with-copilot-and-keeping-the-ones-that-earn-their-place)

GitHub product instructions were checked against official documentation on October 22, 2026. The first three activities run on your machine and on GitHub-hosted runners, which are free for a public repository; the reliability workflow runs on a schedule, so remove or disable it when you are done. The fourth activity uses Copilot Chat in your editor, which needs a Copilot plan (Copilot Free works within its limits); the manual route needs none. Check current access, policy, and billing before using cloud services or preview features. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`chaos/chaos.ts`](chaos/chaos.ts), [`chaos/chaos.test.ts`](chaos/chaos.test.ts), and [`workflows/reliability.yml`](workflows/reliability.yml). They are copies; nothing changes in your fork until you place them under `server/`, `tests/`, and `.github/workflows/`. The timings and coverage numbers below were measured once on the author's machine on October 22, 2026; yours will differ, and the guide says what to expect rather than what you will see. Do not claim an observation unless you made it.

## Mapping the sample's tests onto the pyramid

**Starting point:** a clone of your fork with `npm ci` done and Chromium installed with `npx playwright install chromium`. No branch is needed; this activity changes nothing.

1. Run the unit and API tests and read the summary the reporter prints at the end:

```sh
npm test
```

Expect 11 tests on the baseline (15 on a fork with the Chapter 12 flag) and a total duration of around one second. Each test line shows its own duration in milliseconds; the two slowest are in `tests/seed.test.ts`, because each starts a child process.

2. Build the application and run the browser tests:

```sh
npm run build
npm run test:e2e
```

Expect 8 tests (4 scenarios on a desktop and a mobile viewport) in roughly 7 to 10 seconds plus the server start. Playwright starts its own built server on port 5199; stop anything else using that port first.

3. Run the unit and API tests again with coverage:

```sh
node --import tsx --test --experimental-test-coverage tests/*.test.ts
```

Read the table at the end. Expect `server/app.ts` and `server/catalog.ts` at 100 percent line coverage, `scripts/seed-issues.ts` around 63 percent with lines 17 to 31 uncovered (the part that talks to GitHub, which the tests deliberately do not reach), and an overall line figure around 84 percent. `src/catalog.ts` is absent from the table, because no unit test loads the browser code; add `--test-coverage-include-all` to list source files that were never loaded, which shows them at zero. See [Collecting code coverage](https://nodejs.org/docs/latest-v24.x/api/test.html#collecting-code-coverage) in the Node.js documentation; the feature is marked experimental.

4. Fill in the table below by what each file depends on. The suggested answers are in the last column; decide before you read them.

| File | What it depends on | Level |
| --- | --- | --- |
| `tests/catalog.test.ts` | The catalog module in memory | L0 |
| `tests/api.test.ts` | An Express app on a random port, in process | L1 |
| `tests/seed.test.ts` | A child Node.js process running a script | L1 by the taxonomy's limits, though it is the slowest file |
| `e2e/catalog.spec.ts` | A built server and Chromium | L2 |
| `exercises/search.acceptance.ts` | The catalog module in memory | L0 by dependency; outside the normal run by purpose |

5. Run `npm run test:exercise` and read the failure message on an unfixed fork. Write one sentence on why that test is a specification (its expectations came from the Chapter 2 issue, before the code existed) and the others are regression tests (their expectations describe behavior the code already has).

**Expected result:** a classified list of the sample's test files with their timings and the coverage table, and nothing changed in the fork. **Return to the book:** continue with *Automating tests with GitHub Actions*.

## Adding a coverage gate and a reliability run

**Starting point:** a clone of your fork with the numbers from the previous activity, and Actions enabled in the fork (see the Chapter 11 guide). The complete workflow file is [`workflows/reliability.yml`](workflows/reliability.yml).

### The coverage gate

1. Create a branch `users/YOUR-USERNAME/13_test-gates` from `main`. In `package.json`, add this script next to the existing `test` scripts:

```json
"test:coverage": "node --import tsx --test --experimental-test-coverage --test-coverage-include=\"server/**/*.ts\" --test-coverage-lines=90 tests/*.test.ts"
```

2. Run `npm run test:coverage`. Expect the same tests to pass and a coverage table limited to the files under `server/`, all at 100 percent, with exit code 0.
3. Temporarily remove the `--test-coverage-include` option and run the script again. Expect the run to end with an error such as `87.50% line coverage does not meet threshold of 90%` (the exact figure depends on your fork) and a non-zero exit code, because the seeding script now counts. Put the option back. The threshold flags are documented in the [Node.js test runner reference](https://nodejs.org/docs/latest-v24.x/api/test.html).
4. In `.github/workflows/ci.yml`, add the step `- run: npm run test:coverage` after the `npm run check` step of the `verify` job.

### The reliability run

5. Add `.github/workflows/reliability.yml` with the content of the reference file. Read it before committing: it runs on a Monday morning schedule and on demand, builds `main`, runs the browser suite five times with one retry and the `github` reporter, and keeps the Playwright report as an artifact for 14 days. It never blocks a merge.
6. Commit, push, and open a pull request against **your fork's `main`**; check the base repository. Expect the `verify` check to pass with the coverage table in the `npm run test:coverage` step's log. Merge the pull request.
7. Open **Actions**, select **Reliability** in the sidebar, select **Run workflow** on `main`, and open the run when it finishes. Expect 40 test results (8 tests, 5 repetitions), no failures and no flaky tests on the baseline, and an artifact named `playwright-report`. Download it and open it with `npx playwright show-report playwright-report` from the unzipped folder if you want to see the per-test timings. See [Reporters](https://playwright.dev/docs/test-reporters) and the [command line reference](https://playwright.dev/docs/test-cli) for `--repeat-each` and `--retries`.
8. Decide whether to keep the schedule. A scheduled workflow in a public repository stops after 60 days without activity, but a fork you keep using will run it every Monday; remove the file through a pull request if you do not want that.

**Expected result:** a required check that includes a coverage floor on the server code, and a scheduled run that reports a flaky browser test as `flaky` instead of as a red pull request; the sample's coverage number is unchanged. **Return to the book:** continue with *Testing in production and chaos engineering*.

## Running a chaos experiment against the catalog

**Starting point:** a clone of your fork on `main`. The reference files are [`chaos/chaos.ts`](chaos/chaos.ts) and [`chaos/chaos.test.ts`](chaos/chaos.test.ts). The experiment runs on your machine only.

### Adding the fault injector

1. Create a branch `users/YOUR-USERNAME/13_chaos` from `main`. Copy `chaos/chaos.ts` to `server/chaos.ts` and `chaos/chaos.test.ts` to `tests/chaos.test.ts`.
2. In `server/app.ts`, add the import after the existing imports and register the middleware before the first route:

```ts
import { chaos } from './chaos.ts'
```

```ts
  app.use(chaos())
```

3. Run `npm run check`. Expect 14 tests on the baseline (the 11 existing tests and the 3 new ones) and a successful build. The injector does nothing while `TG_CHAOS` is unset, which is the state every test and every deployment runs in.

### Writing the record first

4. Copy this table into a note and fill in the first four rows before you inject anything:

| Field | Your entry |
| --- | --- |
| Steady state | Eight products load; `GET /api/health` answers `{"status":"ok"}` |
| Hypothesis | A failed catalog request shows the error state with **Try again**, and the next request restores the list |
| Fault | `TG_CHAOS=products-503:3`: every third request to `/api/products` answers 503 |
| Blast radius | A local build on your machine; nobody else is affected |
| Observation | (fill in after the experiment) |
| Learned | (fill in after the experiment) |

### Running the experiment

5. Build and start the application with the fault on. On macOS or Linux:

```sh
npm run build
TG_CHAOS=products-503:3 npm start
```

On Windows PowerShell, use `$env:TG_CHAOS="products-503:3"; npm start`. Open <http://localhost:5173>, then search, sort, and clear the search until a request fails. Expect the catalog to show **We could not load the collection** with a **Try again** button on every third list request, and expect **Try again** or the next change of the search box to restore the products. Product details keep working, because the injector only targets the list.

6. In a second terminal, confirm the fault's rhythm against the API:

```sh
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:5173/api/products"; done
```

Expect `200 200 503 200 200 503` if no other request reached the server in between (the browser's own requests share the counter).

7. Stop the server with **Ctrl+C**, then run the browser suite against the fault with two retries:

```sh
TG_CHAOS=products-503:3 npx playwright test --retries 2
```

Expect some tests to fail and at least one to be reported as flaky; on the author's machine one run reported 2 failed, 1 flaky, and 5 passed, and the split depends on the order of requests. Open the trace of a failed test with the `npx playwright show-trace` command the report prints, and find the request that answered 503. The suite assumes a perfect network; the application survived the fault, and the tests did not. See [Retries](https://playwright.dev/docs/test-retries) for the three result categories.

8. Run `npx playwright test` once more without the variable and expect all 8 tests to pass. Fill in the last two rows of your record. Commit the injector and its tests, open a pull request against your fork's `main`, and merge it. Do not set `TG_CHAOS` in any Actions environment or deployment.

**Expected result:** a fault injector with tests in your fork, an experiment record with a hypothesis and an observation, and a browser-suite report that shows what a fault looks like to a pipeline; no change to the catalog's behavior while the variable is unset. **Return to the book:** continue with *Generating tests with AI without lowering the bar*.

## Generating tests with Copilot and keeping the ones that earn their place

**Starting point:** a clone of your fork and Copilot Chat in Visual Studio Code or another editor with a Copilot plan. The manual route at the end needs no plan. Work on a branch `users/YOUR-USERNAME/13_generated-tests` from `main`.

### Generating

1. Open `server/catalog.ts` and `tests/catalog.test.ts` in the editor, so that Copilot sees the function and the existing style. Open Copilot Chat and send this prompt (the `/tests` command works too; see [Writing tests with GitHub Copilot](https://docs.github.com/en/copilot/tutorials/write-tests)):

```text
Write a thorough test suite for listProducts in server/catalog.ts using
node:test and node:assert/strict, in the style of tests/catalog.test.ts.
Cover search, sorting, stock filtering, and their combinations, and include
edge cases. Put the tests in a new file tests/generated.test.ts.
```

2. Save the proposal as `tests/generated.test.ts` and run `npm test`. Expect the generated tests to pass on the baseline, including any test that asserts that a lowercase or uppercase query returns nothing: that test is correct about the code and wrong about the product. Count the generated tests.

### Reviewing

3. Read every generated test against the four questions in the chapter's Figure 13.3 and mark:
   - any test whose expectation describes the search defect (for example, `listProducts('helmet')` expected to be empty);
   - any test that repeats an existing test in `tests/catalog.test.ts` or the acceptance check in `exercises/search.acceptance.ts`;
   - any test with no assertion about the result, or whose expected value is computed by repeating the function's own logic.

4. Apply the five mutations below to `server/catalog.ts` one at a time, run `npm test` after each, and record which tests fail. The last column is what the 11 baseline tests caught when the author tried each mutation on October 22, 2026; your generated tests add to those counts if they catch the mutation.

| Mutation | Change in `server/catalog.ts` | Baseline tests that failed |
| --- | --- | --- |
| Prefix instead of substring | `product.name.includes(term)` to `product.name.startsWith(term)` | 2 |
| No trimming | `const term = query.trim()` to `const term = query` | 2 |
| Stock filter always on | `(!inStock \|\| product.inStock)` to `product.inStock` | 1 |
| Price sort inverted | swap `left` and `right` in the `price-asc` comparator | 2 |
| Name sort removed | delete the `.sort(...)` call on the `name` line | 1 |

Revert each mutation before applying the next (`git checkout -- server/catalog.ts`). A generated test that no mutation makes fail proves nothing about the catalog, whatever coverage it adds. Mutation testing tools automate this; StrykerJS supports Jest, Mocha, Vitest, and similar runners but not the Node.js test runner, so the sample does it by hand (see [StrykerJS](https://stryker-mutator.io/docs/stryker-js/getting-started/)).

5. Delete every generated test that no mutation made fail and every one that an existing test already proves. If a test pins the case-sensitive behavior, rewrite it from the Chapter 2 issue's acceptance criteria so that it expects the two helmets for `helmet` and `HELMET`, and watch it fail on the baseline exactly as `exercises/search.acceptance.ts` does; then either keep it in `exercises/` beside the acceptance check or delete it as a duplicate. On a fork with the search fix, the rewritten test passes.
6. Run `npm run check`, open a pull request against **your fork's `main`** with what remains, and read the diff once more as a reviewer: no assertion deleted, no expected value changed to obtain a pass, no change to `server/`.

For the **manual alternative**, skip step 1 and write five tests of your own for `listProducts` without reading the existing tests first, then run steps 3 to 6 on your own tests. The review is the lesson; the author of the tests is not.

**Expected result:** a small number of tests that a mutation can break, merged into your fork, and a count of how many generated tests were deleted; the catalog's behavior and the intentional defect are unchanged. **Return to the book:** continue with *Summary*.
