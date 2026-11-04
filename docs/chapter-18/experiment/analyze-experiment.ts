// Chapter 18 reference file. Copy it to scripts/analyze-experiment.ts in your fork.
//
// Reads the JSON-lines event file an experiment wrote and reports, per variant,
// the exposed visitors, the visitors who opened at least one product detail after
// their first exposure, the conversion rates, the difference with a 95 percent
// confidence interval and a two-sided z-test, a sample ratio check, and the
// smallest effect the current sample could detect. Pass --peek N to replay the
// exposures in order and print the p-value after every N visitors, which shows
// why a test that is stopped the first time it looks significant is not a test.
//
//   node --import tsx scripts/analyze-experiment.ts experiment-events.log [--alpha 0.05] [--mde 0.05] [--peek 100]

import { readFileSync } from 'node:fs'

interface Event { at: string; visitor: string; variant: 'control' | 'treatment'; event: 'exposure' | 'detail' }

const args = process.argv.slice(2)
const file = args.find(arg => !arg.startsWith('--'))
if (!file) {
  console.error('usage: analyze-experiment.ts <experiment-events.log> [--alpha 0.05] [--mde 0.05] [--peek N]')
  process.exit(1)
}
const option = (name: string, fallback: number) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : Number(args[index + 1])
}
const alpha = option('alpha', 0.05)
const mde = option('mde', 0.05)
const peek = option('peek', 0)

const events: Event[] = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line))

// A visitor counts once, in the variant of their first exposure, and converts
// if any detail view follows that exposure.
function tally(limit = Number.POSITIVE_INFINITY) {
  const visitors = new Map<string, { variant: 'control' | 'treatment'; exposedAt: string; converted: boolean }>()
  for (const event of events) {
    if (event.event === 'exposure' && !visitors.has(event.visitor)) {
      if (visitors.size >= limit) break
      visitors.set(event.visitor, { variant: event.variant, exposedAt: event.at, converted: false })
    } else if (event.event === 'detail') {
      const visitor = visitors.get(event.visitor)
      if (visitor && event.at >= visitor.exposedAt) visitor.converted = true
    }
  }
  const arm = (variant: 'control' | 'treatment') => {
    const members = [...visitors.values()].filter(entry => entry.variant === variant)
    return { n: members.length, converted: members.filter(entry => entry.converted).length }
  }
  return { control: arm('control'), treatment: arm('treatment') }
}

// Standard normal cumulative distribution through the Abramowitz and Stegun
// approximation of the error function (formula 7.1.26, error below 1.5e-7).
function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const erf = 1 - poly * Math.exp(-x * x)
  return 0.5 * (1 + (z < 0 ? -erf : erf))
}

function compare(control: { n: number; converted: number }, treatment: { n: number; converted: number }) {
  const p1 = control.converted / control.n
  const p2 = treatment.converted / treatment.n
  const pooled = (control.converted + treatment.converted) / (control.n + treatment.n)
  const standardError = Math.sqrt(pooled * (1 - pooled) * (1 / control.n + 1 / treatment.n))
  const z = standardError === 0 ? 0 : (p2 - p1) / standardError
  const pValue = 2 * (1 - normalCdf(Math.abs(z)))
  const seDifference = Math.sqrt(p1 * (1 - p1) / control.n + p2 * (1 - p2) / treatment.n)
  const interval: [number, number] = [p2 - p1 - 1.96 * seDifference, p2 - p1 + 1.96 * seDifference]
  // Sample ratio check: a 50/50 split should not drift far from half.
  const total = control.n + treatment.n
  const chi = total === 0 ? 0 : ((control.n - total / 2) ** 2 + (treatment.n - total / 2) ** 2) / (total / 2)
  const srmP = 2 * (1 - normalCdf(Math.sqrt(chi)))
  // Smallest absolute effect detectable at this sample size (Miller's rule of thumb,
  // n = 16 * s^2 / d^2 per arm, with the pooled rate as the variance estimate).
  const perArm = Math.min(control.n, treatment.n)
  const detectable = perArm === 0 ? Number.NaN : Math.sqrt(16 * pooled * (1 - pooled) / perArm)
  return { p1, p2, difference: p2 - p1, interval, z, pValue, srmP, detectable }
}

const percent = (value: number) => `${(100 * value).toFixed(1)}%`

if (peek > 0) {
  console.log(`peeking after every ${peek} exposed visitors (alpha ${alpha}):`)
  const totalVisitors = tally().control.n + tally().treatment.n
  for (let limit = peek; limit <= totalVisitors; limit += peek) {
    const { control, treatment } = tally(limit)
    if (control.n === 0 || treatment.n === 0) continue
    const result = compare(control, treatment)
    const flag = result.pValue < alpha ? '  <- would have been called significant' : ''
    console.log(`  after ${String(limit).padStart(5)} visitors: difference ${percent(result.difference).padStart(6)}, p = ${result.pValue.toFixed(3)}${flag}`)
  }
}

const { control, treatment } = tally()
if (control.n === 0 || treatment.n === 0) {
  console.log(`exposed visitors: control ${control.n}, treatment ${treatment.n}. Not enough data to compare.`)
  process.exit(0)
}
const result = compare(control, treatment)
console.log(`experiment cheapest-first, ${events.length} events, ${control.n + treatment.n} exposed visitors`)
console.log(`  control:   ${control.n} visitors, ${control.converted} opened a detail (${percent(result.p1)})`)
console.log(`  treatment: ${treatment.n} visitors, ${treatment.converted} opened a detail (${percent(result.p2)})`)
console.log(`  difference: ${percent(result.difference)} (95% interval ${percent(result.interval[0])} to ${percent(result.interval[1])}), z = ${result.z.toFixed(2)}, p = ${result.pValue.toFixed(3)}`)
console.log(`  sample ratio: ${control.n} vs ${treatment.n}, p = ${result.srmP.toFixed(3)}${result.srmP < 0.001 ? '  <- mismatch; do not trust the result' : ''}`)
console.log(`  smallest effect this sample could detect: about ${percent(result.detectable)} absolute; pre-registered minimum effect: ${percent(mde)}`)
if (Math.min(control.n, treatment.n) < 50 || result.detectable > mde) console.log('  verdict: underpowered. The sample is too small to see the effect you registered, whatever p says.')
else if (result.pValue < alpha && result.difference >= mde) console.log('  verdict: the treatment met the registered effect at the registered significance level.')
else if (result.pValue < alpha) console.log('  verdict: a statistically significant difference, but smaller than the effect you said would matter.')
else console.log('  verdict: no significant difference at the registered level.')
