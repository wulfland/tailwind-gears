// Chapter 16 reference file: server/app.ts after all three shards, for comparison only.
import express from 'express'
import { registerHealthRoutes } from './routes/health.ts'
import { registerProductRoutes } from './routes/products.ts'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  registerHealthRoutes(app)
  registerProductRoutes(app)
  app.use('/api', (_request, response) => response.status(404).json({ error: 'Endpoint not found.' }))
  return app
}
