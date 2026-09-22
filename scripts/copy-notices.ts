import { readFile, mkdir, writeFile } from 'node:fs/promises'

const packages = ['lucide', '@fontsource/public-sans', '@fontsource/space-grotesk']
const notices = await Promise.all(packages.map(async name =>
  `${name}\n\n${await readFile(new URL(`../node_modules/${name}/LICENSE`, import.meta.url), 'utf8')}`,
))
const directory = new URL('../public/licenses/', import.meta.url)
await mkdir(directory, { recursive: true })
await writeFile(new URL('third-party.txt', directory), notices.join('\n\n---\n\n'))