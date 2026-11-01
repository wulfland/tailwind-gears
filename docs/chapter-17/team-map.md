# Team map: communication against architecture

A template from the Chapter 17 companion guide for the section *Applying Conway's Law and the Inverse Conway Maneuver*. The architecture map is filled in for the unmodified baseline; the other sections are yours to complete. The two teams are constructed for the chapter.

## Architecture map (from the code)

Command: `grep -rn "from '\.\." server src shared`

| Directory | Imports from | Imported by |
| --- | --- | --- |
| `server/` | `shared/product.ts` | nothing outside `server/` |
| `src/` | `shared/product.ts` | nothing |
| `shared/` | nothing | `server/`, `src/` |

The browser code talks to the server over HTTP (`GET /api/products`, `GET /api/products/:id`, `GET /api/health`), not through imports. The contract both sides import is `shared/product.ts`.

## Communication map (from the history and the scenario)

Command: `git shortlog -sn HEAD server src shared`

Names in the history: _(fill in)_

Constructed scenario:

| Team | Owns | Receives requirements from |
| --- | --- | --- |
| Catalog API team | `server/`, `tests/api.test.ts`, `tests/catalog.test.ts`, `exercises/` | _(one product owner)_ |
| Storefront team | `src/`, `index.html`, `e2e/` | _(one product owner)_ |

Places where a change needs both teams: _(list them; expect the contract, the query parameters and response shape of the products route, the browser tests, `package.json`, and the CI workflow)_

## Where the two maps disagree

_(For each place in the list above: does the architecture have a boundary there, and does the communication structure have one? Where only one of them does, Conway's Law predicts which way the code will move.)_

## The contract rule

- Owner of `shared/product.ts`: _(both teams; in a personal fork, your account stands in for both)_
- How it changes: _(a pull request that a member of each team reviews; consumers are named in the description)_
- What a consumer may rely on: _(the exported types and their field names; prices stay integer cents)_
- Recorded in: `.github/CODEOWNERS`
