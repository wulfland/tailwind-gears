// Chapter 12 reference file. Copy it to server/flags.ts in your fork.
//
// A small flag registry without a dependency or a service. Every flag has an
// owner, a creation date, an expiry date, and a default. The TG_FLAGS environment
// variable turns flags on ("sold-out-last") or off ("-sold-out-last") for one
// process without a code change, which is how a deployment environment can run
// with a different setting than the default in the repository.

export interface FlagDefinition {
  description: string
  owner: string
  created: string
  expires: string
  default: boolean
}

// Set `owner` to your account and `expires` to a date about two months after the
// day you create the flag. The expiry test in tests/flags.test.ts fails once that
// date has passed, so that a forgotten flag cannot stay in the code unnoticed.
export const flags = {
  'sold-out-last': {
    description: 'Show sold-out products after the in-stock products in the featured order.',
    owner: 'YOUR-USERNAME',
    created: '2026-10-22',
    expires: '2026-12-22',
    default: false,
  },
} as const satisfies Record<string, FlagDefinition>

export type FlagName = keyof typeof flags

export function isEnabled(name: FlagName, overrides = process.env.TG_FLAGS ?? ''): boolean {
  const entries = overrides.split(',').map(entry => entry.trim()).filter(Boolean)
  if (entries.includes(`-${name}`)) return false
  if (entries.includes(name)) return true
  return (flags as Record<string, FlagDefinition>)[name]?.default ?? false
}
