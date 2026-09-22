import assert from 'node:assert/strict'
import { test } from 'node:test'
import { spawnSync } from 'node:child_process'

test('issue seeding defaults to a preview without GitHub access', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/seed-issues.ts', 'reader/practice'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Preview only\. No GitHub requests or changes/)
  assert.match(result.stdout, /Make product search case-insensitive/)
  assert.match(result.stdout, /Filter products by category/)
})

test('issue seeding rejects a missing or malformed destination', () => {
  for (const argument of ['', '--apply', '../wrong/repo', '--help']) {
    const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/seed-issues.ts', argument], { encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Usage:/)
  }
})