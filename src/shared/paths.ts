// Paths to the files the plugin ships. Uses node:path and node:url, so only
// parts that run on Bun import it (server, TUI). GUI windows get inert
// placeholders for node:* modules: don't import this from src/gui/.
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/** Package root (holds package.json, agents/, skills/). This file sits in src/shared/, hence "..", "..". */
export const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")

/** agents/<id>.md: one agent per file. */
export const AGENTS_DIR = join(PACKAGE_ROOT, "agents")

/** skills/<id>/SKILL.md: one skill per folder. */
export const SKILLS_DIR = join(PACKAGE_ROOT, "skills")

/** references/: the directory the "special" reference points at. */
export const REFERENCES_DIR = join(PACKAGE_ROOT, "references")

/** mcp/: MCP servers the plugin ships (registered in src/server/mcp.ts). */
export const MCP_DIR = join(PACKAGE_ROOT, "mcp")

export const mcpFile = (name: string): string => join(MCP_DIR, name)

export const agentFile = (id: string): string => join(AGENTS_DIR, `${id}.md`)

export const skillFile = (id: string): string => join(SKILLS_DIR, id, "SKILL.md")
