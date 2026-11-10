// Minimal frontmatter reader for agents/*.md and skills/*/SKILL.md. Reads
// flat `key: value` lines only: no nesting, lists or multi-line values. Swap
// in a YAML parser if your files need more.
import { PLUGIN_ID } from "../shared/constants.js"

export interface Frontmatter {
  readonly fields: Readonly<Record<string, string>>
  readonly body: string
}

export function parseFrontmatter(text: string, path: string): Frontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)
  if (!match) throw new Error(`[${PLUGIN_ID}] no frontmatter: ${path}`)
  const fields: Record<string, string> = {}
  for (const line of match[1]!.split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (kv) fields[kv[1]!] = kv[2]!.trim().replace(/^(["'])(.*)\1$/, "$2")
  }
  return { fields, body: match[2]! }
}

/** The field's value; throws when a required field is missing or empty. */
export function field(fm: Frontmatter, key: string, path: string): string {
  const value = fm.fields[key]
  if (!value) throw new Error(`[${PLUGIN_ID}] frontmatter "${key}" missing: ${path}`)
  return value
}
