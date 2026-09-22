import express from 'express'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.ts'

const app = createApp()
const root = fileURLToPath(new URL('../', import.meta.url))
if (process.argv.includes('--production')) {
  await access(`${root}/dist/index.html`)
  app.use(express.static(`${root}/dist`))
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

const port = Number(process.env.PORT ?? 5173)
const host = process.env.HOST ?? '127.0.0.1'
const server = app.listen(port, host, () => console.log(`Tailwind Gears: http://${host}:${port}`))
server.on('error', error => {
  console.error(error.message)
  process.exit(1)
})