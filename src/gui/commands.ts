// Command registry: entries in the Desktop command palette (published as
// "<plugin id>.<id>"), optionally in the composer's "/" menu. The example
// calls the server part through the RPC contract and shows the answer.
import { Command, type Plugin } from "@opencode/plugin/gui"
import { Example } from "../rpc/rpc.js"

/** Window setup context. With a definition.ts, use Plugin.Setup<typeof definition> instead. */
type Ctx = Parameters<Plugin.Setup>[0]

export function commands(ctx: Ctx): void {
  ctx.add(Command, {
    id: "ping",
    title: "Ping the plugin's server part",
    // slash: { name: "plugin-ping" },
    run: async () => {
      // Read ctx.client at call time: it changes when the server restarts.
      const result = (await ctx.client.rpc(Example).ping({})) as { text: string }
      await ctx.dialogs.alert({ title: result.text })
    },
  })
}
