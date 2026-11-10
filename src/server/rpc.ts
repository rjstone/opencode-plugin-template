// RPC domain: the server-side implementation of the contract in
// src/rpc/rpc.ts. setup() registers it with ctx.rpc.register(Example, ...).
import type { Deps } from "./types.js"

export function rpcHandlers(_deps: Deps) {
  return {
    // Second argument: { signal, error(type, message, data) } for
    // cancellation and the contract's declared errors.
    ping: async () => ({ text: "pong from the server part" }),
  }
}
