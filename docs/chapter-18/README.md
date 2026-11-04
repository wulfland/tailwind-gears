# Chapter 18: optional experimentation exercises

The chapter can be read without doing these activities. This guide keeps each activity's starting point, instructions, expected result, and reading-resumption point together, and it holds the hypothesis issue form the chapter mentions. All scenarios use fictional sample data: the catalog has no real customers, the visitors the simulator sends are simulated, and the customer feedback is invented. No exercise authorizes changes in the author's repository.

Use **your fork** for branches, issues, and pull requests, and **your fork's `main`** as the target. Both activities start from `main` and work on the unfixed baseline as well as on a fork that contains the Chapter 3 search fix, the Chapter 12 flag registry, or the Chapter 16 route modules; the experiment does not touch the search, and `npm run test:exercise` keeps failing on an unfixed fork by design. Do not fix the search or implement the category feature as part of these activities.

- [Running an A/B experiment on the catalog's featured order](#running-an-ab-experiment-on-the-catalogs-featured-order)
- [Synthesizing customer feedback into hypotheses with an assistant and checking every claim](#synthesizing-customer-feedback-into-hypotheses-with-an-assistant-and-checking-every-claim)

GitHub product instructions were checked against official documentation on November 2, 2026. The first activity is free and runs on your machine. The second uses Copilot Chat in your editor (any Copilot plan, including Copilot Free within its limits) or Claude Code; the manual route needs neither. Nothing here starts a cloud agent or creates a cloud resource. Public practice material must not contain real customer information, internal conversations, or credentials.

The reference files are [`hypothesis.yml`](hypothesis.yml), the issue form; [`experiment/experiment.ts`](experiment/experiment.ts), [`experiment/app.patch.md`](experiment/app.patch.md), [`experiment/experiment.test.ts`](experiment/experiment.test.ts), [`experiment/simulate-visitors.ts`](experiment/simulate-visitors.ts), and [`experiment/analyze-experiment.ts`](experiment/analyze-experiment.ts), the experiment; and [`feedback.md`](feedback.md), the constructed feedback. They are copies; nothing changes in your fork until you place them under `.github/`, `server/`, `tests/`, `scripts/`, or `docs/`. The outputs quoted below were observed on the author's machine on November 2, 2026, with Node.js 26 in a clone of the unmodified baseline; the behavior is the same on Node.js 24, the simulated numbers vary from run to run, and your test counts differ if your fork already contains tests from earlier chapters. Do not claim an observation unless you made it.

## Running an A/B experiment on the catalog's featured order

**Starting point:** a clone of your fork with `npm ci` done, on `main`. The baseline does not contain the issue form, the experiment module, the tests, or the scripts. A fork with the Chapter 12 flag registry can keep the experiment switch there instead of in `TG_EXPERIMENT`; the steps below use the environment variable so that the activity does not depend on that chapter.

### Registering the hypothesis

1. Copy `hypothesis.yml` from this directory to `.github/ISSUE_TEMPLATE/hypothesis.yml` on a branch `users/YOUR-USERNAME/18_experiment`, commit it, push, open a pull request against **your fork's `main`** (check the base repository, because GitHub offers the author's upstream), and merge it, so that the form is on the default branch (see GitHub, [Syntax for issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)).
2. In your fork, open __Issues__, select __New issue__, choose __Hypothesis__, and fill it with the chapter's Table 18.2: the belief that visitors who see the cheapest products first open more product details, the metric (share of exposed visitors who open at least one detail, baseline about 30 percent in the constructed scenario), a minimum effect of 5 percentage points, the audience (visitors who open the catalog with the default order and no query, split 50/50 by cookie) for 14 days, the guardrails (catalog error rate and median response time unchanged), and the first decision rule. Submit it. This issue is the registration; nothing below changes it until the decision.

### Adding the experiment

3. On a new branch `users/YOUR-USERNAME/18_cheapest-first` from `main`, copy the files into place:

| Reference file | Destination |
| --- | --- |
| `experiment/experiment.ts` | `server/experiment.ts` |
| `experiment/experiment.test.ts` | `tests/experiment.test.ts` |
| `experiment/simulate-visitors.ts` | `scripts/simulate-visitors.ts` |
| `experiment/analyze-experiment.ts` | `scripts/analyze-experiment.ts` |

4. Read `server/experiment.ts`. The registry holds one experiment, `cheapest-first`, with its hypothesis, owner, start and end dates, and metric; `isRunning()` is true only when `TG_EXPERIMENT` names it; `assign()` hashes the experiment name and the visitor id with SHA-256 and takes the parity of the first byte, so that the same visitor always gets the same variant and two experiments split visitors independently; `visitorId()` reads or sets a first-party `tg_visitor` cookie that holds a random UUID and nothing else; `record()` appends one JSON line per event to the file named by `TG_EVENTS` and does nothing when the variable is unset. Set `owner` to your account and the dates to today and two weeks from today.
5. Apply the two edits in [`experiment/app.patch.md`](experiment/app.patch.md) to `server/app.ts`: the import, the variant decision in the `/api/products` handler (only when the experiment runs, the query is empty, and the sort is `featured`), and the detail event in the `/api/products/:id` handler. The treatment calls `listProducts` with `price-asc`; the control is unchanged.
6. Run `npm run check` and `npm run test:exercise`. Expect the five experiment tests to pass beside the baseline's tests (16 in total on an unmodified fork) and a successful build, and the exercise check still failing on an unfixed fork. The tests pin that nothing happens with the variable unset (no cookie, no header, the featured order), that a visitor keeps the variant across requests, that the treatment sees the Everyday Bottle first, and that a query or another sort order is never part of the experiment.

### Running it with two visitors

7. Start the server with the experiment on and an events file; the `.log` suffix keeps the file out of Git through the baseline's `.gitignore`:

```sh
TG_EXPERIMENT=cheapest-first TG_EVENTS=./experiment-events.log npm run dev
```

8. Open `http://localhost:5173` in two private browser windows (each gets its own cookie, so each is a visitor), and in one of them click a product to open its detail. Then analyze:

```sh
node --import tsx scripts/analyze-experiment.ts experiment-events.log --mde 0.05
```

Expect either `Not enough data to compare` when both windows landed in the same variant, or a comparison of one visitor against one visitor with the verdict `underpowered`, because the analyzer refuses to read a result from fewer than 50 visitors per variant or from a sample that cannot detect the registered effect. Two visitors cannot tell you anything, and the script says so before it says anything else.

### Running it with simulated visitors

9. With the server still running, send 1,000 simulated visitors in a second terminal. Each one opens the catalog once and opens a product detail with probability 30 percent in the control and 35 percent in the treatment, which is a built-in true effect of 5 points:

```sh
node --import tsx scripts/simulate-visitors.ts --visitors 1000 --base 0.30 --lift 0.05
node --import tsx scripts/analyze-experiment.ts experiment-events.log --mde 0.05
```

Expect about 500 visitors per variant, a difference somewhere around 5 points, and the verdict `underpowered`, because the smallest effect 500 visitors per arm can detect is about 8 points. On the author's run the difference was 9.4 points with p = 0.001 and the verdict was still underpowered, which is the point: a significant result from a sample that could not have detected the registered effect is a lucky draw, and the rule of thumb (16 times the variance over the square of the minimum effect, about 1,350 visitors per arm here) says so.

10. Send 2,000 more visitors, 3,000 in total, and analyze again. Expect about 1,500 per variant, a smallest detectable effect just under 5 points, and in most runs the verdict that the treatment met the registered effect at the registered level; the author's runs showed differences of 6.8, 5.9, and 4.9 points, and the last of those produced the verdict `a statistically significant difference, but smaller than the effect you said would matter`, which is the registered minimum doing its job.

### Peeking at a change that does nothing

11. Stop the server, start it again with a fresh events file, and send 3,000 visitors with no lift at all:

```sh
TG_EXPERIMENT=cheapest-first TG_EVENTS=./null-events.log npm run dev
node --import tsx scripts/simulate-visitors.ts --visitors 3000 --base 0.30 --lift 0
node --import tsx scripts/analyze-experiment.ts null-events.log --mde 0.05 --peek 100
```

The replay prints the difference and the p-value after every 100 exposed visitors, marks the peeks at which a test stopped "the first time it looks significant" would have shipped a change that does nothing, and then prints the final result. Expect the final verdict to be no significant difference. How many peeks get flagged varies: on the author's runs it was zero, two, and zero in three runs of 3,000 visitors, and four in a run of 2,000. If your run shows none, delete the file and run again; a run that flags one is the one to keep, because it shows noise crossing the threshold on its way back to zero.

### Deciding and cleaning up

12. Record the decision in the hypothesis issue as a comment: the final numbers, which rule applied, and what you decided. In a fork that treats the simulated run as the experiment, the record says `ship` or `remove` according to the rule; say in the comment that the visitors were simulated.
13. Commit the experiment files and the two edits, push, open a pull request against **your fork's `main`** that links the issue, and merge it. Then, as the record demands, either make `price-asc` the default order in a follow-up pull request and remove the experiment branch from `server/app.ts`, or remove the experiment code; either way delete the `cheapest-first` entry from the registry. An experiment flag that outlives its experiment is the debt Chapter 12 described. Delete `experiment-events.log` and `null-events.log`; they are ignored by Git but they are still files on your disk.

| Step | Command | Expected on an unmodified fork |
| --- | --- | --- |
| 6 | `npm run check` | `tests 16`, `pass 16`, build succeeds; `npm run test:exercise` still fails |
| 8 | analyzer after two private windows | `Not enough data to compare`, or a one-against-one comparison with the verdict `underpowered` |
| 9 | 1,000 visitors, 5-point lift | about 500 per variant; verdict `underpowered`; smallest detectable effect about 8 points |
| 10 | 3,000 visitors, 5-point lift | about 1,500 per variant; smallest detectable effect just under 5 points; usually `met the registered effect` |
| 11 | 3,000 visitors, no lift, `--peek 100` | final verdict `no significant difference`; zero to several peeks flagged |

The table states expectations from simulated visitors; the simulated numbers differ on every run, and none of them says anything about real customers.

**Expected result:** a registered hypothesis in an issue, an experiment that assigns visitors, records events, and analyzes them on your own server, an analysis that refused a verdict when it could not know and applied the registered rule when it could, a peeking replay you have seen with your own eyes, a decision recorded in the issue, and a fork from which the experiment flag has been removed again. **Return to the book:** continue with *Steering with OKRs and evidence-based decisions*.

## Synthesizing customer feedback into hypotheses with an assistant and checking every claim

**Starting point:** a clone of your fork and Copilot Chat in Visual Studio Code or another editor with a Copilot plan, or Claude Code in a terminal at the repository root; the manual route at the end needs neither. The reference file is [`feedback.md`](feedback.md), twenty fictional comments about the catalog; the baseline has no `docs/feedback/` directory. The hypothesis issue form from the first activity is used in the last step; add it first if you skipped that activity.

### The request

1. Create a branch `users/YOUR-USERNAME/18_synthesis` from `main`. Copy `feedback.md` to `docs/feedback/2026-11.md` and commit it, so that what you check is what the assistant read.
2. Open the repository in your editor with Copilot Chat in agent mode, or start Claude Code, and send this request without changes:

```text
Read docs/feedback/2026-11.md, twenty customer comments about this catalog,
and write docs/feedback/2026-11-hypotheses.md with at most five hypotheses.

For each hypothesis use exactly this form:
  We believe <this capability> will result in <this outcome>.
  We will have confidence to proceed when <this measurable signal>.
After each hypothesis, list the comment ids it rests on (F01 to F20) and
one sentence on what the comments say. Do not cite a comment for more than
it says. Check each cited comment against the application's actual behavior
in server/ and src/, and mark any comment that describes behavior the
application does not have. Finally, say which hypotheses the repository's
existing issues or docs already cover.
```

3. Save the file as the assistant wrote it and commit it with the message `Hypotheses as drafted` before you change anything.

### The check

4. For each hypothesis, open every cited comment and confirm that it says what the hypothesis claims. Then check the comment against the catalog: `server/catalog.ts` decides the search and the order, `server/app.ts` the API, and `src/catalog.ts` the browser behavior. Mark each hypothesis `held`, `wrong`, or `unverifiable`, and note any cited comment that describes behavior the catalog does not have. One of the twenty does: F15 says the search clears when the sort changes, and `src/catalog.ts` keeps the query across sort changes. Whether the assistant noticed is the first thing to record.
5. Record the count of `held` out of the hypotheses drafted in the pull request description, as in Chapter 16. Fix the wrong hypotheses yourself and delete the unverifiable ones.
6. Ask the assistant: `At a 30 percent baseline and a minimum effect of 5 percentage points, how many visitors per variant does a two-variant experiment need at the usual 5 percent significance and 80 percent power?` Compare its answer with the analyzer's rule of thumb from the first activity (16 times 0.3 times 0.7 over 0.05 squared, about 1,350 per variant) and with a standard calculator such as Evan Miller's [sample size calculator](https://www.evanmiller.org/ab-testing/sample-size.html); the three should agree within a few percent, and if the assistant's number is far off, ask it to show the formula.

### The registration

7. Choose the hypothesis you would test next and register it with the __Hypothesis__ issue form, including the metric, the minimum effect, the duration, the guardrails, and the decision rule. The cheapest-first hypothesis is already registered if you did the first activity; pick another.
8. Commit the corrected hypotheses file, push, open a pull request against **your fork's `main`** that links the registered issue, and merge it.

For the **manual alternative**, cluster the twenty comments yourself into at most five groups by the underlying need rather than the words, write each group as a hypothesis in the three-part form with its comment ids, and perform the same check against the application. The checking habit is the lesson, not the assistant.

**Expected result:** a hypothesis backlog in your fork that cites the feedback each hypothesis rests on, a count of how many of the assistant's citations held and whether it caught the comment that was wrong about the sample, one more registered hypothesis, and no decision, which waits for its experiment. **Return to the book:** continue with *Summary*.
