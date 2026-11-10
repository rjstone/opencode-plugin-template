// GUI part of the plugin (OpenCode Desktop, experimental). Vite builds this
// file into dist/gui-experimental.cjs (`bun run build`); opencode loads only
// that bundle. Both Desktop processes evaluate the whole bundle: windows run
// setup(), the Electron main process runs main(). Each area lives in its own
// file and hands setup() what ctx.add(<Registry>, ...) needs. Only wiring here.
//
// Imports: only the modules the app provides (effect, solid-js, @opencode/*
// listed in the docs' "Shared modules"); anything else gets bundled. Never
// import src/shared/paths.ts here (node:* is an inert placeholder in windows).
//
// The commented-out lines cover every other registry. To add one: create the
// file, then uncomment its import and its line in setup().
import { Plugin } from "@opencode/plugin/gui"
import { commands } from "./commands.js"
// import { definition } from "./definition.js"     // Plugin.define({ os, stores, i18n }): declarations only
// import { main } from "./main.js"                 // Plugin.MainSetup: Electron main process (MenubarItem, ctx.windows)
// import { codeBlocks } from "./code-blocks.js"    // ctx.add(CodeBlock, ...), ctx.add(CodeBlockAction, ...)
// import { composerPills } from "./composer.js"    // ctx.add(ComposerPill, ...)
// import { linkHandlers } from "./links.js"        // ctx.add(LinkHandler, ...)
// import { menuItems } from "./menus.js"           // ctx.add(MenuItem, ...)
// import { panels } from "./panels.js"             // ctx.add(Panel, ...): side panels / tabs
// import { servers } from "./servers.js"           // ctx.add(Server, ...)
// import { settingsPages } from "./settings.js"    // ctx.add(SettingsPage, ...)
// import { slots } from "./slots.js"               // ctx.add(Slot, ...)
// import { styles } from "./styles.js"             // ctx.add(Style, css), ctx.add(Theme, ...)
// import { titlebarItems } from "./titlebar.js"    // ctx.add(TitlebarItem, ...)
// Called directly where needed: ctx.dialogs, ctx.layout, ctx.sessions,
// ctx.client (incl. .rpc(Contract)), ctx.stores, ctx.t.

export default Plugin.define({
  // ...definition,
  setup(ctx) {
    commands(ctx)
    // codeBlocks(ctx)
    // composerPills(ctx)
    // linkHandlers(ctx)
    // menuItems(ctx)
    // panels(ctx)
    // servers(ctx)
    // settingsPages(ctx)
    // slots(ctx)
    // styles(ctx)
    // titlebarItems(ctx)
  },
  // main,
})
