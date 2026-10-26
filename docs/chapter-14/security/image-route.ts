// Chapter 14 reference file: one safe implementation of the product image
// endpoint, for comparison AFTER you have reviewed the version your assistant
// produced. Do not copy it before the review; the review is the activity.
//
// Add the two imports to server/app.ts and the route inside createApp(), after
// the existing product detail route. The id is used only to look the product
// up; the file name comes from the catalog's own data, never from the request,
// and Express's `root` option keeps sendFile inside the products directory.

import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const productsDirectory = fileURLToPath(new URL('../public/products/', import.meta.url))

// Inside createApp():
//
//   app.get('/api/products/:id/image', (request, response) => {
//     const product = products.find(item => item.id === request.params.id)
//     if (!product) {
//       response.status(404).json({ error: 'Product not found.' })
//       return
//     }
//     response.sendFile(path.basename(product.image), { root: productsDirectory })
//   })

export function imageFileName(image: string): string {
  return path.basename(image)
}
