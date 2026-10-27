// Chapter 16 reference file, shard 1 of the refactoring recipe. Copy to server/routes/health.ts.
import type { Express } from 'express'

export function registerHealthRoutes(app: Express) {
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
}
