// MCP domain: MCP servers the plugin brings along. The example registers the
// stdio server in mcp/hello_mcp.js; its tools reach the model as
// "hello-mcp_<tool>" (Code Mode: tools["hello-mcp"].<tool>()).
// A remote server instead: editor.set(name, { type: "remote", url: "https://..." }).
import { existsSync } from "node:fs"
import { PLUGIN_ID } from "../shared/constants.js"
import { mcpFile } from "../shared/paths.js"
import type { Deps, MCPEditor } from "./types.js"

export interface McpServerDef {
  readonly name: string
  readonly command: string[]
}

/**
 * Resolves the server's command line. Throws when the server file is
 * missing; callers catch that and skip only this registration. The runtime
 * defaults to `node`; set the plugin option `node` to another command (e.g.
 * "bun") or a full path. Shared by V2 (below) and V1 (v1.ts).
 */
export function mcpServer(options: Readonly<Record<string, unknown>>): McpServerDef {
  const server = mcpFile("hello_mcp.js")
  if (!existsSync(server)) throw new Error(`[${PLUGIN_ID}] MCP server missing: ${server}`)
  const runtime = typeof options.node === "string" ? options.node : "node"
  return { name: "hello-mcp", command: [runtime, server] }
}

/** Resolves the server now, outside the transform (throws as mcpServer does). */
export function mcpEditor({ options }: Deps) {
  const { name, command } = mcpServer(options)
  return (editor: MCPEditor) => {
    editor.set(name, {
      type: "local",
      command,
      // environment: { HELLO_MCP_GREETING: "Hi" },
    })
  }
}
