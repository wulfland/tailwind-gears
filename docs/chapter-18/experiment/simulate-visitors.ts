// Chapter 18 reference file. Copy it to scripts/simulate-visitors.ts in your fork.
//
// Sends synthetic visitors through the running catalog so that the experiment
// log fills up quickly. Each visitor opens the catalog once (an exposure, which
// sets the visitor cookie and reports the variant in the X-TG-Variant header)
// and then opens one product detail with a probability that depends on the
// variant: --base for the control and --base plus --lift for the treatment.
// The data this produces is simulated, not evidence about any real user; the
// point is to exercise the analysis, including what it reports when --lift is 0.
//
//   node --import tsx scripts/simulate-visitors.ts --visitors 1000 --base 0.30 --lift 0.05 [--url http://localhost:5173]

const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const visitors = Number(option('visitors', '1000'))
const base = Number(option('base', '0.30'))
const lift = Number(option('lift', '0.05'))
const url = option('url', 'http://localhost:5173')
const productIds = ['ridge-helmet', 'everyday-bottle', 'field-pannier', 'beam-light', 'metro-helmet', 'frame-bag', 'loop-lock', 'trail-bottle']

const counts = { control: 0, treatment: 0, details: 0, unassigned: 0 }
for (let index = 0; index < visitors; index += 1) {
  const exposure = await fetch(`${url}/api/products`)
  if (!exposure.ok) throw new Error(`catalog request failed with ${exposure.status}`)
  const variant = exposure.headers.get('x-tg-variant')
  const cookie = exposure.headers.get('set-cookie')?.split(';')[0]
  if (!variant || !cookie) {
    counts.unassigned += 1
    continue
  }
  counts[variant as 'control' | 'treatment'] += 1
  const probability = variant === 'treatment' ? base + lift : base
  if (Math.random() < probability) {
    const product = productIds[Math.floor(Math.random() * productIds.length)]
    const detail = await fetch(`${url}/api/products/${product}`, { headers: { cookie } })
    if (!detail.ok) throw new Error(`detail request failed with ${detail.status}`)
    counts.details += 1
  }
}
console.log(`sent ${visitors} visitors: control ${counts.control}, treatment ${counts.treatment}, detail views ${counts.details}`)
if (counts.unassigned) console.log(`${counts.unassigned} visitors were not assigned; is the server running with TG_EXPERIMENT=cheapest-first?`)
