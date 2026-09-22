import assert from 'node:assert/strict'
import { test } from 'node:test'
import { listProducts } from '../server/catalog.ts'

test('search accepts uppercase, lowercase and mixed-case product names', () => {
  const expected = ['ridge-helmet', 'metro-helmet']
  for (const query of ['HELMET', 'helmet', 'HeLmEt', ' Helmet ']) {
    assert.deepEqual(listProducts(query).map(product => product.id), expected, `Search: ${query}`)
  }
})