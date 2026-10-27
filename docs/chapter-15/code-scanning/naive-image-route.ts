// Chapter 15 reference file: the DELIBERATELY VULNERABLE product image route for
// the code scanning activity. Paste the two imports and the route into
// server/app.ts on a practice branch that you never merge. It builds a file
// path from the request's id, which is the pattern CodeQL's js/path-injection
// query reports ("Uncontrolled data used in path expression"). Chapter 14's
// tests/image-route.test.ts fails on it, and the Autofix activity fixes it.
//
// Imports to add at the top of server/app.ts:
//
//   import path from 'node:path'
//   import { fileURLToPath } from 'node:url'
//
// Route to add inside createApp(), after the product detail route:
//
//   const productsDirectory = fileURLToPath(new URL('../public/products/', import.meta.url))
//   app.get('/api/products/:id/image', (request, response) => {
//     const file = path.join(productsDirectory, `${request.params.id}.png`)
//     response.sendFile(file, error => {
//       if (error) response.status(404).json({ error: 'Product not found.' })
//     })
//   })
//
// The safe implementation for comparison after the review is
// ../../chapter-14/security/image-route.ts: it looks the product up by id and
// serves the file name from the catalog's own data under a fixed root.

export const vulnerableRouteDescription =
  'Builds a file path from request.params.id; see the comment above.'
