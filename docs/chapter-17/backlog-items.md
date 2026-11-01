# Backlog items for the delegation table

Six constructed items for the Chapter 17 delegation worksheet. Each one is a kind of work the book has met. The facts under each item are what you need to decide who does it, what gate it passes, and what must be written down first. They describe the sample, not a real team's backlog.

## 1. Search ignores case only when it should not

`Helmet` finds two helmets; `HELMET` and `helmet` find none. `exercises/search.acceptance.ts` already states the desired behavior and fails on the baseline. The fix is two lines in `server/catalog.ts` plus permanent regression tests. (Chapters 2 and 3; the baseline keeps this defect on purpose until you choose to fix it.)

## 2. Filter the catalog by category

Categories exist in the data, but which categories to show, whether a product can be in two, and how the filter combines with search are undecided. No test describes it. (Chapter 2's second issue; it stays unresolved in the sample on purpose.)

## 3. Write `docs/architecture.md`

The repository has no architecture note. A newcomer or an agent needs the module map, the HTTP contract, the behaviors the tests pin, and the three decisions to know. Every claim should cite a file and line. (Chapter 16's third activity.)

## 4. Dependabot proposes an Express minor update

The pull request updates one dependency, the suite passes, and the changelog lists a behavior change in query parsing. (Chapter 15's grouped updates and dependency review.)

## 5. Move the API routes into `server/routes/`

A refactoring in three shards with five invariants, among them that no test changes and that the exercise check still fails. A recipe and an exemplar exist. (Chapter 16's fourth activity.)

## 6. Code scanning reports path injection in the image route

The alert points at a route on a practice branch that builds a file path from a request parameter. A traversal test from Chapter 14 exists. Autofix proposes a change. (Chapters 14 and 15.)

## One possible set of answers

Compare with your table afterward; it is one answer, not the answer.

| Item | Who | Gate | Written down first |
| --- | --- | --- | --- |
| 1 | An agent, from the issue that names the failing test | The acceptance test passes, the suite is unchanged, a person reviews the two lines and the new tests | The failing test (already exists) |
| 2 | A person, with an assistant for the parts | The product decision is in the issue before any code | The decision: which categories, one or many, how it combines with search |
| 3 | An agent, from a request that demands a location for every claim | A person checks five claims against the code | The request itself, and the characterization tests that follow |
| 4 | Dependabot opens it; a person decides | The suite, the dependency review, and a read of the changelog entry | Nothing new; the cooldown and grouping are configured |
| 5 | An agent, under the recipe | The gates of the recipe: build, tests unchanged, boundary test, moved-lines diff | The recipe and the exemplar |
| 6 | Autofix proposes; a person decides | The traversal test passes, the scanner reruns clean | Nothing new; the test exists |
