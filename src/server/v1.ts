// V1 support: the server() entry for opencode 1.x (@opencode-ai/plugin).
// V1 calls server(input, options) and uses the hooks it returns, keyed by
// name; V2 reads only the default export's id and setup() and ignores this.
// Each version stays on its own API (no hook translation): shared code is
// the loaders both call (loadAgents, mcpServer), not the hooks.
//
// The object form (default export with server()) needs opencode 1.18.29 or
// later; older 1.x releases may expect function exports. Test with the
// oldest 1.x you support.
//
// Types are minimal local stand-ins so the template needs no V1 package.
// For the full types: add @opencode-ai/plugin (1.x) as a devDependency and
// use its `Hooks` / `PluginInput`.
import { PLUGIN_ID } from "../shared/constants.js"
import { loadAgents } from "./agents.js"
import { mcpServer, type McpServerDef } from "./mcp.js"

/** The part of the V1 config this example edits (opencode.json shape). */
interface V1Config {
  agent?: Record<string, { description?: string; mode?: string; prompt?: string; color?: string }>
  mcp?: Record<string, { type: "local"; command: string[]; enabled?: boolean }>
  [key: string]: unknown
}

interface V1Hooks {
  config?: (config: V1Config) => Promise<void>
  [hook: string]: unknown
}

export async function v1Server(
  _input: unknown, // V1 PluginInput: { client, project, directory, worktree, $ }
  options?: Readonly<Record<string, unknown>>,
): Promise<V1Hooks> {
  const agents = loadAgents()
  let mcp: McpServerDef | undefined
  try {
    mcp = mcpServer(options ?? {})
  } catch (err) {
    console.error(`[${PLUGIN_ID}] MCP server not registered (v1):`, err instanceof Error ? err.message : err)
  }

  return {
    // V1 adds agents and MCP servers by editing the loaded config.
    config: async (config) => {
      config.agent ??= {}
      for (const a of agents) {
        config.agent[a.id] = {
          description: a.description,
          mode: a.mode,
          prompt: a.system,
          ...(a.color !== undefined ? { color: a.color } : {}),
        }
      }
      if (mcp) {
        config.mcp ??= {}
        config.mcp[mcp.name] = { type: "local", command: mcp.command }
      }
    },
    // Other V1 hooks (input, output), with their V2 counterparts:
    // "tool.execute.before": async (input, output) => {},   // ctx.tool.hook("execute.before")
    // "tool.execute.after": async (input, output) => {},    // ctx.tool.hook("execute.after")
    // "chat.message": async (input, output) => {},          // ctx.session.hook("prompt")
    // "shell.env": async (input, output) => {},             // ctx.shell.hook("create.before")
    // "permission.ask": async (input, output) => {},        // ctx.permission.hook("evaluate")
    // event: async ({ event }) => {},                       // ctx.event.subscribe()
    // tool: { hello: tool({ ... }) },  // needs tool() and zod schemas from @opencode-ai/plugin
  }
}
