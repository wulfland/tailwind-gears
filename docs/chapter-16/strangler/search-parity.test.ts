// Chapter 16 reference file. Copy to tests/search-parity.test.ts.
// Parity before improvement: the new search must return what the old one
// returns for every combination below, bug for bug, until the old one is gone.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { SortOrder } from '../shared/product.ts'
import { listProducts, products } from '../server/catalog.ts'
import { searchProducts } from '../server/search.ts'

const queries = ['', '   ', 'Helmet', ' Helmet ', 'HELMET', 'helmet', 'Lock', 'Bottle', 'Spaceship', 'e']
const sorts: SortOrder[] = ['featured', 'name', 'price-asc', 'price-desc']

for (const query of queries) {
  for (const sort of sorts) {
    for (const inStock of [false, true]) {
      test(`parity for q=${JSON.stringify(query)} sort=${sort} inStock=${inStock}`, () => {
        const expected = listProducts(query, sort, inStock).map(product => product.id)
        const actual = searchProducts(products, query, sort, inStock).map(product => product.id)
        assert.deepEqual(actual, expected)
      })
    }
  }
}

test('the new search does not change the order of the catalog itself', () => {
  searchProducts(products, '', 'name')
  assert.equal(products[0].id, 'ridge-helmet')
})
