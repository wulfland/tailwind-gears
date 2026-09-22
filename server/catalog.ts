import type { Product, SortOrder } from '../shared/product.ts'

export const products: Product[] = [
  { id: 'ridge-helmet', name: 'Ridge Helmet', category: 'Protection', priceCents: 7900, color: 'Moss green', inStock: true, image: '/products/ridge-helmet.png', description: 'A vented cycling helmet with a matte shell and an adjustable fit. Built for the everyday ride.', specs: ['Adjustable rear dial', 'Removable lining', 'Medium / 54-58 cm'] },
  { id: 'everyday-bottle', name: 'Everyday Bottle', category: 'Accessories', priceCents: 2400, color: 'Cobalt blue', inStock: true, image: '/products/everyday-bottle.png', description: 'A reusable bottle with a simple pull-top cap. Sized for a standard bicycle bottle cage.', specs: ['650 ml capacity', 'Pull-top cap', 'BPA-free body'] },
  { id: 'field-pannier', name: 'Field Pannier', category: 'Bags', priceCents: 8900, color: 'Signal yellow', inStock: true, image: '/products/field-pannier.png', description: 'A roll-top bag for the commute, with room for a change of clothes and the things you take everywhere.', specs: ['18 litre capacity', 'Roll-top closure', 'Rear-rack attachment'] },
  { id: 'beam-light', name: 'Beam Light', category: 'Accessories', priceCents: 3900, color: 'Graphite', inStock: true, image: '/products/beam-light.png', description: 'A compact front light with a tool-free handlebar mount and a rechargeable battery.', specs: ['USB-C charging', 'Three light modes', 'Tool-free mount'] },
  { id: 'metro-helmet', name: 'Metro Helmet', category: 'Protection', priceCents: 6900, color: 'Chalk', inStock: true, image: '/products/metro-helmet.png', description: 'A rounded city helmet with a clean silhouette, padded lining and an easy-adjust chin strap.', specs: ['Adjustable chin strap', 'Removable lining', 'Large / 58-62 cm'] },
  { id: 'frame-bag', name: 'Frame Bag', category: 'Bags', priceCents: 4500, color: 'Rust red', inStock: true, image: '/products/frame-bag.png', description: 'Keep tools and small essentials within reach with a slim bag that sits inside the frame.', specs: ['2 litre capacity', 'Zipped opening', 'Three attachment straps'] },
  { id: 'loop-lock', name: 'Loop Lock', category: 'Accessories', priceCents: 4900, color: 'Cobalt blue', inStock: false, image: '/products/loop-lock.png', description: 'A compact U-lock with a coated shackle and a frame mount for carrying it between stops.', specs: ['Coated steel shackle', 'Two keys', 'Frame mount included'] },
  { id: 'trail-bottle', name: 'Trail Bottle', category: 'Accessories', priceCents: 2800, color: 'Moss green', inStock: true, image: '/products/trail-bottle.png', description: 'A larger everyday bottle for longer routes, with a grippy body and a removable cap.', specs: ['750 ml capacity', 'Pull-top cap', 'BPA-free body'] },
]

export function listProducts(query = '', sort: SortOrder = 'featured', inStock = false): Product[] {
  const term = query.trim()
  const result = products.filter(product =>
    product.name.includes(term) && (!inStock || product.inStock),
  )
  if (sort === 'price-asc') result.sort((left, right) => left.priceCents - right.priceCents)
  if (sort === 'price-desc') result.sort((left, right) => right.priceCents - left.priceCents)
  if (sort === 'name') result.sort((left, right) => left.name.localeCompare(right.name, 'en'))
  return result
}