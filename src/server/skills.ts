// Skill domain: skills/<id>/SKILL.md, one skill each. Frontmatter holds the
// description (when to use the skill); the first "# " heading is its name.
import { readFileSync } from "node:fs"
import { Skill } from "@opencode/plugin"
import { skillFile } from "../shared/paths.js"
import { field, parseFrontmatter } from "./frontmatter.js"
import type { SkillEditor } from "./types.js"

/** Skill ids = folder names in skills/. */
const SKILL_IDS = ["example"] as const

function loadSkill(id: string) {
  const path = skillFile(id)
  const fm = parseFrontmatter(readFileSync(path, "utf8"), path)
  const title = /^#\s+(.+)$/m.exec(fm.body)?.[1]?.trim() ?? id
  return {
    id: Skill.ID.make(id),
    name: Skill.Name.make(title),
    description: field(fm, "description", path),
    path: Skill.Info.fields.path.make(path),
    content: fm.body.trim(),
  }
}

/** Reads every skill file now (a missing file fails setup), then returns the transform. */
export function skillsEditor() {
  const skills = SKILL_IDS.map(loadSkill)
  return (editor: SkillEditor) => {
    for (const skill of skills) editor.add(skill)
  }
}
