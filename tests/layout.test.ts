// Layout checks: package.json "exports" and the source tree agree, and the
// agents and skills the server part lists exist. Run with `bun test`.
import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { PACKAGE_ROOT, REFERENCES_DIR, agentFile, mcpFile, skillFile } from "../src/shared/paths.js"

const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8")) as {
  exports: Record<string, string>
}

/** exports key -> source entry that must exist (the GUI's export is a build output). */
const ENTRIES: Record<string, string> = {
  ".": "src/server/server.ts",
  "./server": "src/server/server.ts",
  "./tui": "src/tui/tui.tsx",
  "./gui-experimental": "src/gui/gui.tsx",
  "./rpc": "src/rpc/rpc.ts",
}

describe("package exports", () => {
  test("every key is a known plugin part", () => {
    for (const key of Object.keys(pkg.exports)) expect(Object.keys(ENTRIES)).toContain(key)
  })

  test("every part's source entry exists", () => {
    for (const key of Object.keys(pkg.exports)) {
      expect(existsSync(join(PACKAGE_ROOT, ENTRIES[key]!))).toBe(true)
    }
  })

  test("the GUI export is the Vite preset's default output", () => {
    expect(pkg.exports["./gui-experimental"]).toBe("./dist/gui-experimental.cjs")
  })
})

describe("shipped files", () => {
  function listed(file: string, name: string): string[] {
    const src = readFileSync(join(PACKAGE_ROOT, "src/server", file), "utf8")
    const list = new RegExp(`${name} = \\[([^\\]]*)\\]`).exec(src)?.[1] ?? ""
    return [...list.matchAll(/"([^"]+)"/g)].map((m) => m[1]!)
  }

  test("every agent in AGENT_IDS has agents/<id>.md", () => {
    const ids = listed("agents.ts", "AGENT_IDS")
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(existsSync(agentFile(id))).toBe(true)
  })

  test("every skill in SKILL_IDS has skills/<id>/SKILL.md", () => {
    const ids = listed("skills.ts", "SKILL_IDS")
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(existsSync(skillFile(id))).toBe(true)
  })

  test("the special reference's directory holds special-prompt.md", () => {
    expect(existsSync(join(REFERENCES_DIR, "special-prompt.md"))).toBe(true)
  })

  test("the MCP server the plugin registers exists", () => {
    expect(existsSync(mcpFile("hello_mcp.js"))).toBe(true)
  })

  test("everything the server part reads ships in package.json files", () => {
    const files = (JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8")) as { files: string[] }).files
    for (const dir of ["src", "agents", "skills", "references", "mcp"]) expect(files).toContain(dir)
  })
})
