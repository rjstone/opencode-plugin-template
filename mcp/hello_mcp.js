#!/usr/bin/env node
// Bare-bones MCP server shipped with the plugin (src/server/mcp.ts registers
// it as "hello-mcp"). Stdio transport: one JSON-RPC message per line on
// stdin/stdout; logs go to stderr only (stdout is the protocol). No
// dependencies, so it runs on Node or Bun without an install step. For a
// real server, use the MCP SDK (@modelcontextprotocol/sdk) instead.
import { createInterface } from "node:readline"

const SERVER = { name: "hello-mcp", version: "0.1.0" }
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"]

const TOOLS = [
  {
    name: "hello",
    description: "Say hello to someone. Example MCP tool from the plugin template.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Who to greet." } },
      required: ["name"],
      additionalProperties: false,
    },
    run: ({ name }) => `Hello from the MCP server, ${name}!`,
  },
]

const handlers = {
  initialize: (params) => ({
    // Answer with the client's version when we support it, else our newest.
    protocolVersion: PROTOCOL_VERSIONS.includes(params?.protocolVersion)
      ? params.protocolVersion
      : PROTOCOL_VERSIONS[0],
    capabilities: { tools: {} },
    serverInfo: SERVER,
  }),
  ping: () => ({}),
  "tools/list": () => ({
    tools: TOOLS.map(({ run, ...tool }) => tool),
  }),
  "tools/call": (params) => {
    const tool = TOOLS.find((t) => t.name === params?.name)
    if (!tool) throw { code: -32602, message: `Unknown tool: ${params?.name}` }
    try {
      return { content: [{ type: "text", text: tool.run(params.arguments ?? {}) }] }
    } catch (err) {
      // Tool failures are results the model can read, not protocol errors.
      return { content: [{ type: "text", text: String(err) }], isError: true }
    }
  },
}

function send(message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...message }) + "\n")
}

createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    return send({ id: null, error: { code: -32700, message: "Parse error" } })
  }
  if (msg.id === undefined) return // notification (e.g. notifications/initialized): no reply
  const handler = handlers[msg.method]
  if (!handler) {
    return send({ id: msg.id, error: { code: -32601, message: `Method not found: ${msg.method}` } })
  }
  try {
    send({ id: msg.id, result: handler(msg.params) })
  } catch (err) {
    send({ id: msg.id, error: { code: err?.code ?? -32603, message: err?.message ?? String(err) } })
  }
})
