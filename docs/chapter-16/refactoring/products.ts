// Chapter 16 reference file, shards 2 and 3 of the refactoring recipe, for comparison
// after your own or the agent's version exists. Copy to server/routes/products.ts.
import type { Express } from 'express'
import { listProducts, products } from '../catalog.ts'
import type { SortOrder } from '../../shared/product.ts'

export function registerProductRoutes(app: Express) {
  app.get('/api/products', (request, response) => {
    const { q = '', sort = 'featured', inStock = 'false' } = request.query
    if (typeof q !== 'string' || q.length > 120 || typeof sort !== 'string' ||
      !['featured', 'name', 'price-asc', 'price-desc'].includes(sort) ||
      !['true', 'false'].includes(inStock as string)) {
      response.status(400).json({ error: 'Invalid catalog query.' })
      return
    }
    const result = listProducts(q, sort as SortOrder, inStock === 'true')
    response.json({ products: result, total: result.length })
  })
  app.get('/api/products/:id', (request, response) => {
    const product = products.find(item => item.id === request.params.id)
    if (!product) {
      response.status(404).json({ error: 'Product not found.' })
      return
    }
    response.json(product)
  })
}
