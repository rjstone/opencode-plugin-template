// Types the domain files share. The editor interfaces are not re-exported
// from "@opencode/plugin"; its "./*" export maps
// "@opencode/plugin/promise/<area>" to dist/promise/<area>.d.ts. Uncomment
// a line when you add that domain's file.
import type { Plugin } from "@opencode/plugin"

export type { AgentEditor } from "@opencode/plugin/promise/agent"
export type { SkillEditor } from "@opencode/plugin/promise/skill"
export type { ToolContext, ToolEditor } from "@opencode/plugin/promise/tool"
// export type { CommandDefinition, CommandEditor, CommandInvocation } from "@opencode/plugin/promise/command"
export type { MCPEditor } from "@opencode/plugin/promise/mcp"
// export type { ModelEditor } from "@opencode/plugin/promise/model"
// export type { ProviderEditor } from "@opencode/plugin/promise/provider"
export type { ReferenceEditor } from "@opencode/plugin/promise/reference"
// export type { IntegrationEditor } from "@opencode/plugin/promise/integration"
// export type { VcsEditor } from "@opencode/plugin/promise/vcs"
// export type { WebSearchEditor } from "@opencode/plugin/promise/websearch"
// export type { WorktreeEditor } from "@opencode/plugin/promise/worktree"
// export type { ArtifactEditor } from "@opencode/plugin/promise/artifact"
// export type { SessionPrompt } from "@opencode/plugin/promise/session"

export type Ctx = Plugin.Context

/** What setup() hands to domain files that need more than their editor. */
export interface Deps {
  readonly ctx: Ctx
  /** This plugin's `options` from the user's opencode.json(c) entry. */
  readonly options: Ctx["options"]
}
