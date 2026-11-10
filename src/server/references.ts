// Reference domain: named directories users attach by alias in their client
// (https://opencode.ai/docs/references/). An attachment holds a listing of
// the directory's top level; the agent then reads the files it needs, under
// the normal external-directory permission. A reference with a description
// is also advertised in agent instructions. A source is a local directory
// ({ type: "local", path }) or a Git repository
// ({ type: "git", repository: "owner/repo", branch? }).
import { Reference } from "@opencode/plugin"
import { REFERENCES_DIR } from "../shared/paths.js"
import type { ReferenceEditor } from "./types.js"

// Typed with the schema (Reference.Source), not the editor's parameter type:
// in 2.2.6 the editor takes the generated client type, which lacks the
// `description` and `hidden` fields the schema and the config docs have.
// Whether the server keeps them for plugin-added references is unverified.
const REFERENCES: readonly { readonly name: string; readonly source: Reference.Source }[] = [
  {
    name: "special",
    source: {
      type: "local",
      path: Reference.LocalSource.fields.path.make(REFERENCES_DIR), // absolute; holds special-prompt.md
      description: "Example from the plugin template: attach for the special prompt",
      // hidden: true, // keep it out of client pickers (still in the API and instructions)
    },
  },
]

export function referencesEditor() {
  return (editor: ReferenceEditor) => {
    for (const ref of REFERENCES) editor.add(ref.name, ref.source)
  }
}
