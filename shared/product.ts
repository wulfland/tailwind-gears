export interface Product {
  id: string
  name: string
  category: 'Protection' | 'Accessories' | 'Bags'
  priceCents: number
  color: string
  inStock: boolean
  image: string
  description: string
  specs: string[]
}

export type SortOrder = 'featured' | 'name' | 'price-asc' | 'price-desc'