import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/public-sans/400.css'
import '@fontsource/public-sans/500.css'
import './catalog.css'
import { createIcons, ArrowUpRight, Bike, Search, X, RotateCcw } from 'lucide'
import type { Product } from '../shared/product.ts'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <a class="skip-link" href="#catalog">Skip to catalog</a>
  <header class="masthead">
    <a class="brand" href="/" aria-label="Tailwind Gears home"><span class="brand-mark"><i data-lucide="bike"></i></span>Tailwind Gears<span class="brand-dot">.</span></a>
    <span class="edition">EVERYDAY / EQUIPMENT</span>
  </header>
  <main id="catalog">
    <section class="catalog-heading" aria-labelledby="heading">
      <div><p class="eyebrow">THE COLLECTION / 01</p><h1 id="heading">Cycling essentials</h1><p class="intro">Good gear. Wherever the day takes you.</p></div>
      <div class="collection-note"><span class="note-line"></span><p>For the commute.<br>For the long way home.</p><span class="collection-index">TG / 2026</span></div>
    </section>
    <form class="toolbar" role="search" aria-label="Search the catalog">
      <div class="search-field"><i data-lucide="search"></i><label class="sr-only" for="query">Search products</label><input id="query" name="q" type="search" placeholder="Search products" maxlength="120" autocomplete="off"><button class="icon-button clear-search" type="button" aria-label="Clear search" title="Clear search" hidden><i data-lucide="x"></i></button></div>
      <div class="toolbar-options"><label class="stock-control"><input id="stock" type="checkbox">In stock only</label><div class="sort-control"><label for="sort">Sort</label><select id="sort"><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option></select></div></div>
    </form>
    <div class="results-heading"><p id="result-count" role="status" aria-live="polite">Loading collection...</p><span>EUR / VAT INCLUDED</span></div>
    <div id="results" aria-busy="true"><div class="loading-state">Loading products...</div></div>
  </main>
  <footer><span class="footer-brand">Tailwind Gears.</span><span>Cycling essentials, thoughtfully chosen.</span><span class="footer-number">01 / CATALOG</span></footer>
  <dialog id="product-dialog" aria-labelledby="detail-name"><button class="icon-button close-dialog" type="button" aria-label="Close product details" title="Close product details"><i data-lucide="x"></i></button><div id="product-detail"></div></dialog>
`

const queryInput = document.querySelector<HTMLInputElement>('#query')!
const stockInput = document.querySelector<HTMLInputElement>('#stock')!
const sortInput = document.querySelector<HTMLSelectElement>('#sort')!
const clearButton = document.querySelector<HTMLButtonElement>('.clear-search')!
const results = document.querySelector<HTMLDivElement>('#results')!
const count = document.querySelector<HTMLParagraphElement>('#result-count')!
const dialog = document.querySelector<HTMLDialogElement>('#product-dialog')!
const details = document.querySelector<HTMLDivElement>('#product-detail')!
const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
let visibleProducts: Product[] = []
let currentRequest: AbortController | undefined
let debounce: ReturnType<typeof setTimeout> | undefined

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

function refreshIcons() {
  createIcons({ icons: { ArrowUpRight, Bike, Search, X, RotateCcw }, attrs: { 'aria-hidden': 'true', 'stroke-width': 1.6 } })
}

function renderProducts() {
  count.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'product' : 'products'}${queryInput.value.trim() ? ` for "${queryInput.value.trim()}"` : ''}`
  if (!visibleProducts.length) {
    results.innerHTML = `<div class="empty-state"><span class="empty-icon"><i data-lucide="search"></i></span><h2>No products found</h2><p>Try another name or clear your filters.</p><button class="text-button" type="button" data-reset><i data-lucide="rotate-ccw"></i>Reset filters</button></div>`
  } else {
    results.innerHTML = `<div class="product-grid">${visibleProducts.map((product, index) => `
      <button class="product-card" type="button" data-product="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.name)}">
        <div class="product-art art-${index % 4}"><span class="item-number">${String(index + 1).padStart(2, '0')}</span>${!product.inStock ? '<span class="stock-badge">Sold out</span>' : ''}<img src="${escapeHtml(product.image)}" alt="${escapeHtml(`${product.name} in ${product.color}`)}" width="960" height="720" ${index > 3 ? 'loading="lazy"' : ''}><span class="product-arrow"><i data-lucide="arrow-up-right"></i></span></div>
        <div class="product-meta"><span class="category">${escapeHtml(product.category)}</span><span class="price">${money.format(product.priceCents / 100)}</span><h2>${escapeHtml(product.name)}</h2><span class="color">${escapeHtml(product.color)}</span></div>
      </button>`).join('')}</div>`
  }
  refreshIcons()
}

async function loadProducts() {
  currentRequest?.abort()
  const controller = new AbortController()
  currentRequest = controller
  const parameters = new URLSearchParams()
  if (queryInput.value.trim()) parameters.set('q', queryInput.value.trim())
  if (stockInput.checked) parameters.set('inStock', 'true')
  if (sortInput.value !== 'featured') parameters.set('sort', sortInput.value)
  history.replaceState(null, '', parameters.size ? `?${parameters}` : location.pathname)
  clearButton.hidden = !queryInput.value
  results.setAttribute('aria-busy', 'true')
  count.textContent = 'Loading products...'
  try {
    const response = await fetch(`/api/products?${parameters}`, { signal: controller.signal })
    if (!response.ok) throw new Error('Catalog request failed')
    const body = await response.json() as { products: Product[] }
    if (controller.signal.aborted) return
    visibleProducts = body.products
    renderProducts()
  } catch {
    if (controller.signal.aborted) return
    count.textContent = 'Collection unavailable'
    results.innerHTML = '<div class="empty-state" role="alert"><h2>We could not load the collection</h2><p>Please try again in a moment.</p><button class="text-button" type="button" data-retry><i data-lucide="rotate-ccw"></i>Try again</button></div>'
    refreshIcons()
  } finally {
    if (!controller.signal.aborted) results.setAttribute('aria-busy', 'false')
  }
}

function requestProducts() {
  clearTimeout(debounce)
  void loadProducts()
}

function resetFilters() {
  queryInput.value = ''
  stockInput.checked = false
  sortInput.value = 'featured'
  requestProducts()
  queryInput.focus()
}

document.querySelector('form')!.addEventListener('submit', event => {
  event.preventDefault()
  requestProducts()
})
queryInput.addEventListener('input', () => {
  currentRequest?.abort()
  clearButton.hidden = !queryInput.value
  clearTimeout(debounce)
  debounce = setTimeout(() => void loadProducts(), 180)
})
stockInput.addEventListener('change', requestProducts)
sortInput.addEventListener('change', requestProducts)
clearButton.addEventListener('click', () => {
  queryInput.value = ''
  requestProducts()
  queryInput.focus()
})
results.addEventListener('click', event => {
  const target = event.target as Element
  if (target.closest('[data-reset]')) resetFilters()
  if (target.closest('[data-retry]')) requestProducts()
  const button = target.closest<HTMLButtonElement>('[data-product]')
  if (!button) return
  const product = visibleProducts.find(item => item.id === button.dataset.product)
  if (!product) return
  details.innerHTML = `<div class="detail-art"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(`${product.name} in ${product.color}`)}" width="960" height="720"></div><div class="detail-copy"><p class="eyebrow">${escapeHtml(product.category)}</p><h2 id="detail-name">${escapeHtml(product.name)}</h2><p class="detail-price">${money.format(product.priceCents / 100)} <span>including VAT</span></p><p>${escapeHtml(product.description)}</p><dl><div><dt>Color</dt><dd>${escapeHtml(product.color)}</dd></div><div><dt>Availability</dt><dd>${product.inStock ? 'In stock' : 'Sold out'}</dd></div></dl><ul>${product.specs.map(spec => `<li>${escapeHtml(spec)}</li>`).join('')}</ul><p class="product-code">PRODUCT / ${escapeHtml(product.id.toUpperCase())}</p></div>`
  dialog.showModal()
})
document.querySelector('.close-dialog')!.addEventListener('click', () => dialog.close())
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close()
  }
})

const initialParameters = new URLSearchParams(location.search)
queryInput.value = (initialParameters.get('q') ?? '').slice(0, 120)
stockInput.checked = initialParameters.get('inStock') === 'true'
const initialSort = initialParameters.get('sort') ?? 'featured'
sortInput.value = ['featured', 'name', 'price-asc', 'price-desc'].includes(initialSort) ? initialSort : 'featured'
refreshIcons()
void loadProducts()