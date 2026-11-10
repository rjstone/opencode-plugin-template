// Agent domain: agents/<id>.md, one agent each. Frontmatter holds
// description, mode (primary | subagent | all) and an optional color; the
// body is the agent's system prompt.
import { readFileSync } from "node:fs"
import { PLUGIN_ID } from "../shared/constants.js"
import { agentFile } from "../shared/paths.js"
import { field, parseFrontmatter } from "./frontmatter.js"
import type { AgentEditor } from "./types.js"

/** Agent ids = file names in agents/. */
const AGENT_IDS = ["example"] as const

const MODES = ["primary", "subagent", "all"] as const
type Mode = (typeof MODES)[number]

function loadAgent(id: string) {
  const path = agentFile(id)
  const fm = parseFrontmatter(readFileSync(path, "utf8"), path)
  const mode = field(fm, "mode", path)
  if (!(MODES as readonly string[]).includes(mode)) {
    throw new Error(`[${PLUGIN_ID}] agent has bad mode "${mode}": ${path}`)
  }
  return {
    id,
    description: field(fm, "description", path),
    mode: mode as Mode,
    color: fm.fields.color,
    system: fm.body.trim(),
  }
}

export type AgentDef = ReturnType<typeof loadAgent>

/** Reads every agent file (throws on a missing one). Shared by V2 (below) and V1 (v1.ts). */
export function loadAgents(): AgentDef[] {
  return AGENT_IDS.map(loadAgent)
}

/** Reads every agent file now (a missing file fails setup), then returns the transform. */
export function agentsEditor() {
  const agents = loadAgents()
  return (editor: AgentEditor) => {
    // AgentEditor has no add(): update() creates the agent when the id is
    // new, so set every field.
    for (const a of agents) {
      editor.update(a.id, (agent) => {
        agent.description = a.description
        agent.mode = a.mode
        if (a.color !== undefined) agent.color = a.color
        agent.system = a.system
      })
    }
  }
}
