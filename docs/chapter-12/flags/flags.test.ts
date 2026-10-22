// Chapter 12 reference file. Copy it to tests/flags.test.ts in your fork.
//
// The first two tests cover the registry itself: defaults, overrides, and the
// expiry check that turns a forgotten flag into a failing build. The last two
// cover the flagged behavior in both states, which is the minimum a flag needs.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { flags, isEnabled, type FlagDefinition } from '../server/flags.ts'
import { listProducts } from '../server/catalog.ts'

test('a flag falls back to its default and follows TG_FLAGS overrides', () => {
  assert.equal(isEnabled('sold-out-last', ''), false)
  assert.equal(isEnabled('sold-out-last', 'sold-out-last'), true)
  assert.equal(isEnabled('sold-out-last', 'other-flag, sold-out-last'), true)
  assert.equal(isEnabled('sold-out-last', '-sold-out-last'), false)
})

test('no flag has passed its expiry date', () => {
  const today = new Date().toISOString().slice(0, 10)
  for (const [name, definition] of Object.entries(flags as Record<string, FlagDefinition>)) {
    assert.ok(definition.expires >= today, `Flag ${name} expired on ${definition.expires}: remove it or extend it deliberately`)
  }
})

test('the featured order keeps the source order while the flag is off', () => {
  delete process.env.TG_FLAGS
  assert.equal(listProducts()[6].id, 'loop-lock')
})

test('the featured order shows sold-out products last while the flag is on', () => {
  process.env.TG_FLAGS = 'sold-out-last'
  try {
    const ids = listProducts().map(product => product.id)
    assert.equal(ids.at(-1), 'loop-lock')
    assert.deepEqual(ids.slice(0, 7), ['ridge-helmet', 'everyday-bottle', 'field-pannier', 'beam-light', 'metro-helmet', 'frame-bag', 'trail-bottle'])
    assert.equal(listProducts('', 'price-asc')[0].id, 'everyday-bottle')
  } finally {
    delete process.env.TG_FLAGS
  }
})
