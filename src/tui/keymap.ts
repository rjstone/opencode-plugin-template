// Keymap area: palette, slash and keyboard commands. The example calls the
// server part through the RPC contract and shows the answer as a toast.
import type { Plugin } from "@opencode/plugin/tui"
import { Example } from "../rpc/rpc.js"
import { PLUGIN_ID } from "../shared/constants.js"

type Context = Plugin.Context
type LayerFactory = Parameters<Context["keymap"]["layer"]>[0]

/** The layer factory must be pure: opencode evaluates it more than once. */
export function keymapLayer(context: Context): LayerFactory {
  return () => ({
    mode: "global",
    commands: [
      {
        id: `${PLUGIN_ID}.ping`,
        title: "Ping the plugin's server part",
        group: PLUGIN_ID,
        palette: true,
        slash: { name: "plugin-ping" },
        // bind: "ctrl+g",
        run: async () => {
          const result = (await context.client.rpc(Example).ping({})) as { text: string }
          context.ui.toast.show({ message: result.text, variant: "success" })
        },
      },
    ],
  })
}
