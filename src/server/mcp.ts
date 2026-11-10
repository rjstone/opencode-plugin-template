// MCP domain: MCP servers the plugin brings along. The example registers the
// stdio server in mcp/hello_mcp.js; its tools reach the model as
// "hello-mcp_<tool>" (Code Mode: tools["hello-mcp"].<tool>()).
// A remote server instead: editor.set(name, { type: "remote", url: "https://..." }).
import { existsSync } from "node:fs"
import { PLUGIN_ID } from "../shared/constants.js"
import { mcpFile } from "../shared/paths.js"
import type { Deps, MCPEditor } from "./types.js"

/**
 * Checks the server file now, outside the transform. Throws when it is
 * missing; setup() catches that and skips only this registration.
 * The runtime defaults to `node`; set the plugin option `node` to another
 * command (e.g. "bun") or a full path.
 */
export function mcpEditor({ options }: Deps) {
  const server = mcpFile("hello_mcp.js")
  if (!existsSync(server)) throw new Error(`[${PLUGIN_ID}] MCP server missing: ${server}`)
  const runtime = typeof options.node === "string" ? options.node : "node"
  return (editor: MCPEditor) => {
    editor.set("hello-mcp", {
      type: "local",
      command: [runtime, server],
      // environment: { HELLO_MCP_GREETING: "Hi" },
    })
  }
}
