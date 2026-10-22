// Chapter 13 reference file. Copy it to server/chaos.ts in your fork and register
// it in server/app.ts with `app.use(chaos())` before the API routes.
//
// A small fault injector for a chaos experiment on your own machine. The TG_CHAOS
// environment variable names the fault: "products-503:3" makes every third request
// to the catalog list fail with HTTP 503. Without the variable, the handler does
// nothing, which is the state your tests and your deployments run in. By Chapter
// 12's taxonomy this is an ops flag; in a product it would live in the registry.

import type { RequestHandler } from 'express'

export function chaos(spec = process.env.TG_CHAOS ?? ''): RequestHandler {
  const match = /^products-503:(\d+)$/.exec(spec.trim())
  if (!match || Number(match[1]) < 1) return (_request, _response, next) => next()
  const every = Number(match[1])
  let count = 0
  return (request, response, next) => {
    if (request.path === '/api/products' && ++count % every === 0) {
      response.status(503).json({ error: 'Chaos experiment: catalog temporarily unavailable.' })
      return
    }
    next()
  }
}
