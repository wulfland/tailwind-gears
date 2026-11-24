import assert from 'node:assert/strict'
import { test } from 'node:test'
import { listProducts, products } from '../server/catalog.ts'

test('empty and whitespace searches return the entire catalog', () => {
  assert.equal(listProducts().length, 8)
  assert.deepEqual(listProducts('   '), products)
})

test('search finds matching names and trims outer whitespace', () => {
  for (const query of ['Helmet', 'HELMET', 'helmet', 'HeLmEt', '  eLm  ']) {
    assert.deepEqual(listProducts(query).map(product => product.id), ['ridge-helmet', 'metro-helmet'])
  }
})

test('unknown search has no matches', () => {
  assert.deepEqual(listProducts('Spaceship'), [])
})

test('stock filtering can be combined with search', () => {
  assert.equal(listProducts('', 'featured', true).length, 7)
  assert.deepEqual(listProducts('Lock', 'featured', true), [])
  assert.deepEqual(listProducts('lOcK').map(product => product.id), ['loop-lock'])
  assert.deepEqual(listProducts('lOcK', 'featured', true), [])
  assert.deepEqual(listProducts('hElMeT', 'price-asc', true).map(product => product.id), ['metro-helmet', 'ridge-helmet'])
})

test('sorting leaves source order intact', () => {
  assert.equal(listProducts('', 'price-asc')[0].id, 'everyday-bottle')
  assert.equal(listProducts('', 'price-desc')[0].id, 'field-pannier')
  assert.equal(listProducts('', 'name')[0].id, 'beam-light')
  assert.equal(products[0].id, 'ridge-helmet')
})

test('product identifiers and asset paths are unique', () => {
  assert.equal(new Set(products.map(product => product.id)).size, products.length)
  assert.equal(new Set(products.map(product => product.image)).size, products.length)
  assert.ok(products.every(product => Number.isInteger(product.priceCents) && product.priceCents > 0))
})