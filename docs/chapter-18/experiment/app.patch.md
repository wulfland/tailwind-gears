# The two edits to `server/app.ts`

The experiment touches the server in two places. Apply both by hand; the rest of the file stays as it is.

## 1. Import the experiment module

After the existing imports at the top of `server/app.ts`, add:

```ts
import { assign, isRunning, record, visitorId } from './experiment.ts'
```

## 2. Decide the variant in the catalog route and record the events

Replace the single line that calls `listProducts` in the `/api/products` handler:

```ts
    const result = listProducts(q, sort as SortOrder, inStock === 'true')
```

with this block, which leaves the order unchanged unless the experiment is running, the visitor opened the catalog with the default order and no query, and the visitor was assigned to the treatment:

```ts
    let order = sort as SortOrder
    if (isRunning('cheapest-first') && q === '' && sort === 'featured') {
      const visitor = visitorId(request, response)
      const variant = assign('cheapest-first', visitor)
      if (variant === 'treatment') order = 'price-asc'
      response.setHeader('X-TG-Variant', variant)
      record({ at: new Date().toISOString(), experiment: 'cheapest-first', visitor, variant, event: 'exposure' })
    }
    const result = listProducts(q, order, inStock === 'true')
```

In the `/api/products/:id` handler, after the `if (!product)` block and before `response.json(product)`, add the conversion event:

```ts
    if (isRunning('cheapest-first')) {
      const visitor = visitorId(request, response)
      record({ at: new Date().toISOString(), experiment: 'cheapest-first', visitor, variant: assign('cheapest-first', visitor), event: 'detail', product: product.id })
    }
```

With `TG_EXPERIMENT` unset, neither block runs: no cookie is set, no header is added, no event is written, and every test in the baseline passes unchanged.
