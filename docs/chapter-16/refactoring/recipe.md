# Refactoring recipe: move the API routes out of `server/app.ts`

This is the recipe for the Chapter 16 refactoring activity, written the way a large-scale
change is described at the start, before the first shard. Copy it into the issue you hand to
an agent, or follow it yourself. The sample is small enough to finish in an hour by hand; the
recipe is what you keep for the codebase where it is not.

## Goal

`server/app.ts` composes the application from route modules instead of defining every
handler inline. Each module exports one function that receives the Express application and
registers its routes. `createApp()` keeps its name, its signature, and its behavior.

## Shards

| Shard | Moves | Into | Status |
| --- | --- | --- | --- |
| 1 | `GET /api/health` | `server/routes/health.ts` | Done by hand, the exemplar |
| 2 | `GET /api/products` with its query validation | `server/routes/products.ts` | Agent or manual |
| 3 | `GET /api/products/:id` | `server/routes/products.ts` (same module) | Agent or manual |

The `/api` fallthrough that answers 404 as JSON stays in `createApp()`, after the modules,
because it must be registered last.

## Invariants (every shard, checked before merge)

1. No behavior changes. Every existing test passes unchanged: `npm run check` is green and no
   test file is edited.
2. `npm run test:exercise` still fails with the same assertion. The case-sensitive search is a
   defect Chapter 2 left in the baseline on purpose; a refactoring that fixes it is not a
   refactoring.
3. `tests/boundaries.test.ts` passes: route modules import from `../catalog.ts` and
   `../../shared/product.ts` only.
4. `git diff --color-moved=zebra` shows the handler bodies as moved lines, not as changed
   lines. A changed line inside a moved block needs a sentence in the pull request.
5. No new dependency, no new script, no change outside `server/`.

## Exemplar: shard 1

`server/routes/health.ts`:

```ts
import type { Express } from 'express'

export function registerHealthRoutes(app: Express) {
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
}
```

In `server/app.ts`, the inline handler is replaced by `registerHealthRoutes(app)` and the
import `import { registerHealthRoutes } from './routes/health.ts'` is added. Nothing else
changes in that shard.

## Review

Read the first shard line by line. For the shards after it, read the moved-lines diff and the
check results, and read line by line only where the diff shows a changed line inside a moved
block. The recipe is approved once; each shard is checked against it.
