// Server part of the plugin (runs inside the opencode server, on Bun). Each
// domain lives in its own file and hands setup() a function for
// ctx.<domain>.transform(...) or ctx.<domain>.hook(...). Only wiring here.
//
// The commented-out lines cover every other ctx domain. To add one: create
// the file, uncomment its import and its line in setup(), and uncomment its
// editor type in types.ts. The comment beside each import names the call.
//
// V1 support: the default export also carries server() (v1.ts), which
// opencode 1.x calls instead of setup(). Delete it and the spread if you
// target V2 only.
import { Plugin } from "@opencode/plugin"
import { Example } from "../rpc/rpc.js"
import { PLUGIN_ID } from "../shared/constants.js"
import { agentsEditor } from "./agents.js"
import { mcpEditor } from "./mcp.js"
import { referencesEditor } from "./references.js"
import { rpcHandlers } from "./rpc.js"
import { skillsEditor } from "./skills.js"
import { toolsEditor } from "./tools.js"
import type { Deps } from "./types.js"
import { v1Server } from "./v1.js"
// import { aisdkHook } from "./aisdk.js"               // ctx.aisdk.hook("sdk" | "language", ...)
// import { artifactsEditor } from "./artifacts.js"     // ctx.experimental.artifact.transform(...)
// import { commandsEditor } from "./commands.js"       // ctx.command.transform(...): /slash commands
// import { watchEvents } from "./events.js"            // ctx.event.subscribe(...): async iterable of server events
// import { integrationsEditor } from "./integrations.js" // ctx.integration.transform(...)
// import { modelsEditor } from "./models.js"           // ctx.model.transform(...)
// import { permissionHook } from "./permission-hooks.js" // ctx.permission.hook("evaluate", ...)
// import { providersEditor } from "./providers.js"     // ctx.provider.transform(...)
// import { promptHook } from "./session-hooks.js"      // ctx.session.hook("prompt" | "context" | "title" | ..., ...)
// import { shellHook } from "./shell-hooks.js"         // ctx.shell.hook("create.before", ...)
// import { toolAfterHook } from "./tool-hooks.js"      // ctx.tool.hook("execute.before" | "execute.after", ...)
// import { vcsEditor } from "./vcs.js"                 // ctx.vcs.transform(...)
// import { webSearchEditor } from "./websearch.js"     // ctx.websearch.transform(...)
// import { worktreesEditor } from "./worktrees.js"     // ctx.worktree.transform(...)
// No editor or hook, call directly where needed: ctx.storage (get/set/remove/scan),
// ctx.session (prompt, synthetic, switchAgent, ...), ctx.location, ctx.options.

// Spread Plugin.define(...) so the V2 definition type-checks on its own;
// V2 reads only id and setup(), V1 only server().
export default {
  ...Plugin.define({
    id: PLUGIN_ID,
    async setup(ctx) {
      const deps: Deps = { ctx, options: ctx.options }

      // These read shipped files and throw on a missing one, so build them
      // all before registering anything: a broken checkout registers nothing.
      const agents = agentsEditor()
      const skills = skillsEditor()

      // Optional piece: a missing MCP server skips only its registration (the
      // reason goes to the server log); everything else still loads.
      let mcp: ReturnType<typeof mcpEditor> | undefined
      try {
        mcp = mcpEditor(deps)
      } catch (err) {
        console.error(`[${PLUGIN_ID}] MCP server not registered:`, err instanceof Error ? err.message : err)
      }

      await ctx.agent.transform(agents)
      await ctx.skill.transform(skills)
      await ctx.tool.transform(toolsEditor(deps))
      await ctx.reference.transform(referencesEditor())
      await ctx.rpc.register(Example, rpcHandlers(deps))
      if (mcp) await ctx.mcp.transform(mcp)
      // await ctx.command.transform(commandsEditor(deps))
      // await ctx.model.transform(modelsEditor(deps))
      // await ctx.provider.transform(providersEditor(deps))
      // await ctx.integration.transform(integrationsEditor(deps))
      // await ctx.vcs.transform(vcsEditor(deps))
      // await ctx.websearch.transform(webSearchEditor(deps))
      // await ctx.worktree.transform(worktreesEditor(deps))
      // await ctx.experimental.artifact.transform(artifactsEditor(deps))

      // Hooks live apart from their domain's transform file.
      // await ctx.session.hook("prompt", promptHook(deps))
      // await ctx.tool.hook("execute.after", toolAfterHook(deps))
      // await ctx.permission.hook("evaluate", permissionHook(deps))
      // await ctx.shell.hook("create.before", shellHook(deps))
      // await ctx.aisdk.hook("language", aisdkHook(deps))

      // Long-running work: start it without awaiting, and stop it in the
      // returned cleanup (runs when the plugin unloads or reloads).
      // const stop = watchEvents(deps)
      // return () => stop()
    },
  }),
  server: v1Server,
}
