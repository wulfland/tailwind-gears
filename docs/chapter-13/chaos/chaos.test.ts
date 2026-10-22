// Chapter 13 reference file. Copy it to tests/chaos.test.ts in your fork.
//
// The fault injector is code, so it gets tests like any other code: it must stay
// out of the way when TG_CHAOS is unset, fail exactly the requests it is told to,
// and leave product details alone.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import express from 'express'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { chaos } from '../server/chaos.ts'

async function withServer(spec: string, run: (baseUrl: string) => Promise<void>) {
  const app = express()
  app.use(chaos(spec))
  app.get('/api/products', (_request, response) => response.json({ products: [], total: 0 }))
  app.get('/api/products/:id', (_request, response) => response.json({ id: 'ridge-helmet' }))
  const server: Server = app.listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  try {
    await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`)
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
}

test('without a fault specification every request succeeds', async () => {
  await withServer('', async baseUrl => {
    for (let i = 0; i < 5; i++) assert.equal((await fetch(`${baseUrl}/api/products`)).status, 200)
  })
})

test('products-503:3 fails every third catalog request and nothing else', async () => {
  await withServer('products-503:3', async baseUrl => {
    const statuses = []
    for (let i = 0; i < 6; i++) statuses.push((await fetch(`${baseUrl}/api/products?q=Helmet`)).status)
    assert.deepEqual(statuses, [200, 200, 503, 200, 200, 503])
    assert.equal((await fetch(`${baseUrl}/api/products/ridge-helmet`)).status, 200)
  })
})

test('an unknown or invalid specification is ignored', async () => {
  for (const spec of ['latency:200', 'products-503:0', 'products-503:x']) {
    await withServer(spec, async baseUrl => {
      assert.equal((await fetch(`${baseUrl}/api/products`)).status, 200)
    })
  }
})
