// Chapter 16 reference file. Copy to tests/boundaries.test.ts.
// An architectural fitness function: it reads the source files as text and
// fails when a module imports across a boundary the catalog does not allow.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { test } from 'node:test'

const root = resolve(import.meta.dirname, '..')
const importPattern = /^\s*import\b[^'"]*['"]([^'"]+)['"]/gm

function sourceFiles(directory: string): string[] {
  return readdirSync(join(root, directory), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.ts'))
    .map(entry => relative(root, join(entry.parentPath, entry.name)))
}

function importsOf(file: string): string[] {
  const source = readFileSync(join(root, file), 'utf8')
  return [...source.matchAll(importPattern)]
    .map(match => match[1])
    .filter(specifier => specifier.startsWith('.'))
    .map(specifier => relative(root, resolve(join(root, file), '..', specifier)))
}

// The rules. Each line reads: files under <from> must not import from <into>.
const rules = [
  { from: 'src', into: 'server', reason: 'the browser talks to the server over HTTP only' },
  { from: 'server', into: 'src', reason: 'the server must not depend on browser code' },
  { from: 'shared', into: 'server', reason: 'the contract depends on nobody' },
  { from: 'shared', into: 'src', reason: 'the contract depends on nobody' },
]

for (const rule of rules) {
  test(`${rule.from}/ never imports ${rule.into}/ (${rule.reason})`, () => {
    for (const file of sourceFiles(rule.from)) {
      const crossing = importsOf(file).filter(target => target.startsWith(`${rule.into}/`))
      assert.deepEqual(crossing, [], `${file} imports ${crossing.join(', ')}`)
    }
  })
}

test('the contract in shared/ has no runtime imports at all', () => {
  for (const file of sourceFiles('shared')) {
    assert.deepEqual(importsOf(file), [], `${file} imports something`)
  }
})
