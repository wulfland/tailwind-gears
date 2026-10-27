# The switch in `server/app.ts`

The strangler activity routes `GET /api/products` to the new implementation only when the
process is started with `TG_SEARCH=next`. Nothing changes for anyone else. Apply these two
edits to `server/app.ts` by hand; they are small enough that a patch file would hide them.

Add one import after the existing `listProducts` import:

```ts
import { searchProducts } from './search.ts'
```

Replace the line that calls `listProducts` inside the `/api/products` handler:

```ts
    const result = process.env.TG_SEARCH === 'next'
      ? searchProducts(products, q, sort as SortOrder, inStock === 'true')
      : listProducts(q, sort as SortOrder, inStock === 'true')
```

When the parity test has passed for as long as you need, the retirement is the reverse: the
handler calls `searchProducts` unconditionally, `listProducts` and the parity test are
deleted, and the exercise test in `exercises/search.acceptance.ts` is pointed at the new
function. The Chapter 12 flag registry is the better home for the switch in a fork that has
it; the environment variable keeps this activity independent of that chapter.
