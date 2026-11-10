/** @jsxImportSource @opentui/solid */
// TUI part of the plugin (runs in the terminal UI process, on Bun; no build:
// opencode runs this file). Each area lives in its own file and hands setup()
// what context.<area> needs. Only wiring here.
//
// JSX here is OpenTUI's Solid (the pragma above). Before rendering JSX, add
// @opentui/core, @opentui/solid and solid-js to devDependencies and
// peerDependencies (see README).
//
// The commented-out lines cover every other context area. To add one:
// create the file, then uncomment its import and its line in setup().
import { Plugin } from "@opencode/plugin/tui"
import { PLUGIN_ID } from "../shared/constants.js"
import { keymapLayer } from "./keymap.js"
// import { sessionWatcher } from "./events.js"         // context.data.on(event, cb): server events, cached data
// import { codeBlockRenderer } from "./markdown.js"    // context.markdown.registerCodeBlockRenderer(lang, render)
// import { examplePage } from "./routes.js"            // context.ui.router.register(page), .navigate(destination)
// import { sidebarSlot } from "./slots.js"             // context.ui.slot(claim): render into a host slot
// import { settingsStore } from "./storage.js"         // context.storage.store(key, { initial })
// Called directly where needed: context.ui.toast / .dialog / .panel / .tabs /
// .model, context.attention, context.client (incl. .rpc(Contract)), context.theme.

export default Plugin.define({
  // A TUI part declares its own id, unlike the GUI part.
  id: `${PLUGIN_ID}.tui`,
  setup(context) {
    context.keymap.layer(keymapLayer(context))
    // const stopEvents = sessionWatcher(context)
    // const stopRenderer = context.markdown.registerCodeBlockRenderer("example", codeBlockRenderer(context))
    // const stopPage = context.ui.router.register(examplePage(context))
    // const stopSlot = context.ui.slot(sidebarSlot(context))
    // const [settings, updateSettings] = settingsStore(context)

    // Return a cleanup for anything setup() started that the host does not
    // remove itself (keymap layers are removed for you).
    // return () => { stopEvents(); stopRenderer(); stopPage(); stopSlot() }
  },
})
