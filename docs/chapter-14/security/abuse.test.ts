// Chapter 14 reference file. Copy it to tests/abuse.test.ts in your fork.
//
// Abuse-case tests describe what the catalog must do when a request is hostile
// or malformed. They pass on the baseline, because the API already validates its
// query and hides its stack; they exist so that a later change cannot quietly
// remove those properties. Each test names the threat it covers.

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

test('information disclosure: the server does not announce its framework', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.headers.get('x-powered-by'), null)
})

test('tampering: an oversized or malformed query is rejected, not processed', async () => {
  for (const query of [`q=${'a'.repeat(121)}`, 'sort=../../etc', 'sort=', 'inStock=1', 'q=one&q=two']) {
    const response = await fetch(`${baseUrl}/api/products?${query}`)
    assert.equal(response.status, 400, query)
    assert.deepEqual(await response.json(), { error: 'Invalid catalog query.' })
  }
})

test('information disclosure: an unknown route answers with JSON, not a stack trace', async () => {
  for (const path of ['/api/admin', '/api/products/..%2F..%2Fpackage.json', '/api/products/%00']) {
    const response = await fetch(`${baseUrl}${path}`)
    assert.equal(response.status, 404, path)
    assert.match(response.headers.get('content-type') ?? '', /application\/json/)
    assert.doesNotMatch(await response.text(), /at .*\.ts:\d+/)
  }
})

test('tampering: the catalog is read-only over HTTP', async () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const response = await fetch(`${baseUrl}/api/products`, { method })
    assert.equal(response.status, 404, method)
  }
})
