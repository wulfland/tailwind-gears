// Chapter 18 reference file. Copy it to server/experiment.ts in your fork.
//
// A small experiment registry without a dependency or a service. One experiment
// is defined: 'cheapest-first', which shows the cheapest products first to half
// of the visitors who open the catalog with the default featured order and no
// query. Nothing runs unless the process starts with TG_EXPERIMENT=cheapest-first,
// so the baseline behavior is unchanged, and nothing is recorded unless TG_EVENTS
// names a file to append the events to.

import { createHash, randomUUID } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import type { Request, Response } from 'express'

export interface ExperimentDefinition {
  hypothesis: string
  owner: string
  started: string
  ends: string
  metric: string
}

export const experiments = {
  'cheapest-first': {
    hypothesis: 'Visitors who see the cheapest products first open more product details.',
    owner: 'YOUR-USERNAME',
    started: '2026-11-02',
    ends: '2026-11-16',
    metric: 'share of exposed visitors who open at least one product detail',
  },
} as const satisfies Record<string, ExperimentDefinition>

export type ExperimentName = keyof typeof experiments
export type Variant = 'control' | 'treatment'

export interface ExperimentEvent {
  at: string
  experiment: ExperimentName
  visitor: string
  variant: Variant
  event: 'exposure' | 'detail'
  product?: string
}

// An experiment runs only when the process names it in TG_EXPERIMENT.
export function isRunning(name: ExperimentName, env = process.env.TG_EXPERIMENT ?? ''): boolean {
  return env.split(',').map(entry => entry.trim()).includes(name)
}

// The same visitor always lands in the same variant, and the experiment's name is
// part of the hash so that two experiments split the visitors independently.
export function assign(name: ExperimentName, visitor: string): Variant {
  const digest = createHash('sha256').update(`${name}:${visitor}`).digest()
  return digest[0] % 2 === 0 ? 'control' : 'treatment'
}

const visitorPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

// The visitor id lives in a first-party cookie that carries no personal data.
export function visitorId(request: Request, response: Response): string {
  const cookies = (request.headers.cookie ?? '').split(';').map(part => part.trim().split('='))
  const existing = cookies.find(([name]) => name === 'tg_visitor')?.[1]
  if (existing && visitorPattern.test(existing)) return existing
  const id = randomUUID()
  response.setHeader('Set-Cookie', `tg_visitor=${id}; Path=/; SameSite=Lax; Max-Age=2592000`)
  return id
}

// Events are JSON lines appended to the file named by TG_EVENTS.
export function record(event: ExperimentEvent, path = process.env.TG_EVENTS): void {
  if (!path) return
  appendFileSync(path, `${JSON.stringify(event)}\n`)
}
