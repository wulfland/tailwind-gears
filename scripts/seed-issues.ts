import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

interface SeedIssue { key: string; title: string; body: string }
interface ExistingIssue { body: string | null; html_url: string; pull_request?: unknown }
const argumentsList = process.argv.slice(2)
const apply = argumentsList.includes('--apply')
const targets = argumentsList.filter(argument => argument !== '--apply')
const repository = targets[0] ?? ''
if (targets.length !== 1 || !/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(repository)) {
  console.error('Usage: npm run seed:issues -- OWNER/REPOSITORY [--apply]')
  process.exit(1)
}
const issues: SeedIssue[] = JSON.parse(await readFile(new URL('../docs/chapter-02/backlog.json', import.meta.url), 'utf8'))
if (!apply) {
  console.log(`Preview only. No GitHub requests or changes. Target: ${repository}\n`)
  for (const issue of issues) console.log(`${issue.title}\n${issue.body}\n`)
  console.log('Append --apply to create these issues using your authenticated GitHub CLI account.')
} else {
  try {
    const pages: ExistingIssue[][] = JSON.parse(execFileSync('gh', [
      'api', `repos/${repository}/issues?state=all&per_page=100`, '--paginate', '--slurp',
    ], { encoding: 'utf8' }))
    const existing = pages.flat().filter(issue => !issue.pull_request)
    for (const issue of issues) {
      const marker = `<!-- tailwind-gears:${issue.key} -->`
      const match = existing.find(candidate => candidate.body?.includes(marker))
      if (match) {
        console.log(`Already present: ${match.html_url}`)
        continue
      }
      const created: ExistingIssue = JSON.parse(execFileSync('gh', [
        'api', `repos/${repository}/issues`, '--method', 'POST', '--input', '-',
      ], { input: JSON.stringify({ title: issue.title, body: `${issue.body}\n\n${marker}` }), encoding: 'utf8' }))
      console.log(`Created: ${created.html_url}`)
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}