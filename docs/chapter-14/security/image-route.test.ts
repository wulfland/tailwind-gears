// Chapter 14 reference file. Copy it to tests/image-route.test.ts in your fork
// AFTER you have added the product image endpoint from the generation activity.
//
// The tests describe the endpoint's contract from the reviewer's side: a known
// product serves its PNG, and every id that is not a product id, including ones
// that look like file paths, is answered with the same 404 the catalog already
// uses. A naive implementation that builds a file path from the id serves files
// it should not; these tests fail on it.

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

test('a known product serves its image as PNG', async () => {
  const response = await fetch(`${baseUrl}/api/products/ridge-helmet/image`)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'image/png')
  const bytes = new Uint8Array(await response.arrayBuffer())
  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0x89, 0x50, 0x4e, 0x47])
})

test('path traversal: ids that are not product ids get 404, whatever they look like', async () => {
  const ids = ['missing', '..%2F..%2Fpackage.json', '..%2Fproducts%2Fridge-helmet', 'ridge-helmet.png', 'ridge-helmet%00']
  for (const id of ids) {
    const response = await fetch(`${baseUrl}/api/products/${id}/image`)
    assert.equal(response.status, 404, id)
    assert.deepEqual(await response.json(), { error: 'Product not found.' })
  }
})
