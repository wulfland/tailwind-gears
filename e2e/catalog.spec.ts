import { test, expect } from '@playwright/test'

test('catalog renders local images, fits the viewport and opens accessible details', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveText('8 products')
  await expect(page.locator('.product-card')).toHaveCount(8)
  for (const image of await page.locator('.product-card img').all()) {
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(960)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('catalog.png'), fullPage: true, animations: 'disabled' })
  await page.getByRole('button', { name: 'View Ridge Helmet', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Ridge Helmet' })).toBeVisible()
  await expect(page.getByRole('dialog').getByText('Moss green')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('details.png'), animations: 'disabled' })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'View Ridge Helmet', exact: true })).toBeFocused()
  expect(errors).toEqual([])
})

test('search, clearing, sorting, stock filtering and URL state work together', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox').fill('Helmet')
  await expect(page.locator('.product-card')).toHaveCount(2)
  await page.getByLabel('Sort', { exact: true }).selectOption('price-asc')
  await expect(page.locator('.product-card').first()).toHaveAccessibleName('View Metro Helmet')
  await page.reload()
  await expect(page.getByRole('searchbox')).toHaveValue('Helmet')
  await expect(page.locator('.product-card')).toHaveCount(2)
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.locator('.product-card')).toHaveCount(8)
  await page.getByLabel('In stock only').check()
  await expect(page.locator('.product-card')).toHaveCount(7)
  await page.getByRole('searchbox').fill('Spaceship')
  await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.locator('.product-card')).toHaveCount(8)
  await expect(page.getByLabel('In stock only')).not.toBeChecked()
})

test('request failure offers retry without crashing', async ({ page }) => {
  await page.route('**/api/products?*', route => route.fulfill({ status: 503, body: '{}' }))
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('We could not load the collection')
  await page.unroute('**/api/products?*')
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('.product-card')).toHaveCount(8)
})

test('a long query never creates horizontal overflow', async ({ page }) => {
  await page.goto(`/?q=${'VeryLongProductName'.repeat(6)}`)
  await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})