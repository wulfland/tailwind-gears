// Chapter 18 reference file. Copy it to tests/experiment.test.ts in your fork.
import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createApp } from '../server/app.ts'
import { assign, isRunning } from '../server/experiment.ts'

let server: Server
let baseUrl: string
before(async () => {
  server = createApp().listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})
after(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
afterEach(() => { delete process.env.TG_EXPERIMENT })

test('an experiment does not run unless the process names it', () => {
  assert.equal(isRunning('cheapest-first', ''), false)
  assert.equal(isRunning('cheapest-first', 'other'), false)
  assert.equal(isRunning('cheapest-first', 'other, cheapest-first'), true)
})

test('assignment is deterministic and roughly balanced', () => {
  assert.equal(assign('cheapest-first', 'visitor-1'), assign('cheapest-first', 'visitor-1'))
  let treatment = 0
  for (let index = 0; index < 2000; index += 1) if (assign('cheapest-first', `visitor-${index}`) === 'treatment') treatment += 1
  assert.ok(treatment > 900 && treatment < 1100, `expected about half in treatment, got ${treatment} of 2000`)
})

test('with the experiment off, the catalog sets no cookie and reports no variant', async () => {
  const response = await fetch(`${baseUrl}/api/products`)
  assert.equal(response.headers.get('set-cookie'), null)
  assert.equal(response.headers.get('x-tg-variant'), null)
  assert.equal((await response.json()).products[0].id, 'ridge-helmet')
})

test('with the experiment on, a visitor keeps the variant and the treatment sees the cheapest first', async () => {
  process.env.TG_EXPERIMENT = 'cheapest-first'
  const first = await fetch(`${baseUrl}/api/products`)
  const cookie = first.headers.get('set-cookie')?.split(';')[0]
  const variant = first.headers.get('x-tg-variant')
  assert.ok(cookie?.startsWith('tg_visitor='))
  assert.ok(variant === 'control' || variant === 'treatment')
  const second = await fetch(`${baseUrl}/api/products`, { headers: { cookie: cookie! } })
  assert.equal(second.headers.get('x-tg-variant'), variant)
  assert.equal(second.headers.get('set-cookie'), null)
  const firstProduct = (await second.json()).products[0].id
  assert.equal(firstProduct, variant === 'treatment' ? 'everyday-bottle' : 'ridge-helmet')
})

test('a query or another sort order is never part of the experiment', async () => {
  process.env.TG_EXPERIMENT = 'cheapest-first'
  for (const query of ['q=Helmet', 'sort=name']) {
    const response = await fetch(`${baseUrl}/api/products?${query}`)
    assert.equal(response.headers.get('x-tg-variant'), null)
  }
})
