// Tool domain: tools the model can call. The list comes first, the run
// functions after it, then the factory that registers them.
import { PLUGIN_ID } from "../shared/constants.js"
import type { Deps, ToolContext, ToolEditor } from "./types.js"

type ToolInput = Parameters<ToolEditor["add"]>[0]["input"]
type ToolResult = { content: string }

interface ExampleTool {
  readonly name: string
  readonly description: string
  readonly input: ToolInput
  readonly run: (deps: Deps, input: unknown, context: ToolContext) => Promise<ToolResult>
}

// Tool id = "<namespace>_<name>" ("my_opencode_plugin_hello" here; "-" and "."
// in the namespace become "_"). In Code Mode the model calls it as
// tools.my_opencode_plugin.hello(). Only options.namespace on each add()
// puts a tool in the namespace; editor.namespace() just describes it.
// Set codemode: false to offer the tool as a direct call instead.
const NAMESPACE = PLUGIN_ID.replaceAll("-", "_")
const OPTIONS = { namespace: NAMESPACE } as const

const TOOLS: readonly ExampleTool[] = [
  {
    name: "hello",
    description: "Say hello to someone. Example tool from the plugin template.",
    input: {
      type: "object",
      properties: { name: { type: "string", description: "Who to greet." } },
      required: ["name"],
      additionalProperties: false,
    },
    run: hello,
  },
]

async function hello(_deps: Deps, input: unknown): Promise<ToolResult> {
  const { name } = input as { name: string }
  return { content: `Hello, ${name}!` }
}

export function toolsEditor(deps: Deps) {
  return (editor: ToolEditor) => {
    editor.namespace({ name: NAMESPACE, description: "Example tools from the plugin template" })
    for (const tool of TOOLS) {
      editor.add({
        name: tool.name,
        description: tool.description,
        input: tool.input,
        options: OPTIONS,
        execute: (input, context) => tool.run(deps, input, context),
      })
    }
  }
}
