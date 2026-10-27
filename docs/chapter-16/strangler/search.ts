// Chapter 16 reference file. Copy to server/search.ts.
// The replacement for listProducts() in server/catalog.ts, grown beside it.
// It owns no data: the items are passed in, so the same function could run in
// another process fed by another source. Until the parity test says otherwise,
// it must behave exactly like the implementation it replaces, including the
// case-sensitive match that Chapter 2 left in the baseline on purpose.
import type { Product, SortOrder } from '../shared/product.ts'

const comparators: Record<SortOrder, ((left: Product, right: Product) => number) | undefined> = {
  featured: undefined,
  name: (left, right) => left.name.localeCompare(right.name, 'en'),
  'price-asc': (left, right) => left.priceCents - right.priceCents,
  'price-desc': (left, right) => right.priceCents - left.priceCents,
}

export function searchProducts(items: readonly Product[], query = '', sort: SortOrder = 'featured', inStock = false): Product[] {
  const term = query.trim()
  const matches = items.filter(product => product.name.includes(term) && (!inStock || product.inStock))
  const comparator = comparators[sort]
  return comparator ? matches.sort(comparator) : matches
}
