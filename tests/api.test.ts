import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createApp } from '../server/app.ts'

let server: Server
let baseUrl: string
before(async () => {
  server = createApp().listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})
after(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())))

test('health and catalog respond with JSON', async () => {
  assert.deepEqual(await (await fetch(`${baseUrl}/api/health`)).json(), { status: 'ok' })
  const response = await fetch(`${baseUrl}/api/products?q=Helmet&sort=price-asc`)
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.total, 2)
  assert.equal(body.products[0].id, 'metro-helmet')
})

test('invalid queries are rejected', async () => {
  for (const query of ['sort=invalid', 'q=one&q=two', 'inStock=maybe', `q=${'a'.repeat(121)}`]) {
    assert.equal((await fetch(`${baseUrl}/api/products?${query}`)).status, 400)
  }
})

test('details and missing resources have correct HTTP status', async () => {
  const response = await fetch(`${baseUrl}/api/products/ridge-helmet`)
  assert.equal(response.status, 200)
  assert.equal((await response.json()).name, 'Ridge Helmet')
  assert.equal((await fetch(`${baseUrl}/api/products/missing`)).status, 404)
  assert.equal((await fetch(`${baseUrl}/api/missing`)).status, 404)
})