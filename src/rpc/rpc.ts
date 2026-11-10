// RPC part: the typed contract between the server part (which implements it,
// src/server/rpc.ts) and everything that calls it: the TUI and GUI parts,
// other plugins (import "my-opencode-plugin/rpc") and HTTP clients.
// Keep this file light: anyone importing the contract loads it, so import
// only "@opencode/plugin/rpc" and pure src/shared/ code here.
import { Rpc } from "@opencode/plugin/rpc"
import { PLUGIN_ID } from "../shared/constants.js"

export const Example = Rpc.define({
  id: PLUGIN_ID,
  methods: {
    // Schemas are JSON Schema here; any Standard Schema validator (Zod,
    // Valibot, ArkType) also works and infers the types. JSON Schema values
    // arrive as `unknown`: narrow before use. The 2.2.6 types require both
    // `input` and `output` (the docs say either may be left out), so a
    // method without arguments takes an empty object: ping({}).
    ping: {
      input: { type: "object", properties: {}, additionalProperties: false },
      output: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
        additionalProperties: false,
      },
      // errors: {
      //   not_ready: { type: "object", properties: {}, additionalProperties: false },
      // },
    },
  },
  // Events the server emits (registration.events.emit("pinged", {...})) and
  // callers subscribe to (client.rpc(Example).events.on("pinged", cb)).
  // Event data must be an object. Required by the 2.2.6 types even when empty.
  events: {
    // pinged: {
    //   schema: { type: "object", properties: { count: { type: "number" } }, required: ["count"] },
    // },
  },
})
