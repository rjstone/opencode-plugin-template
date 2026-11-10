# Agent instructions

This is an opencode v2 plugin (`@opencode/plugin`), made from
`rjstone/opencode-plugin-template`. v2 replaced the v1 API
(`@opencode-ai/plugin`, an exported async function returning hooks): don't
write plugin code from memory. Check, in this order:

1. the installed types: `node_modules/@opencode/plugin/dist/promise/<area>.d.ts`
   (server), `dist/tui/`, `dist/gui/`, and `node_modules/@opencode/schema/dist/rpc.d.ts`
2. the docs: https://opencode.ai/docs/build/plugins (any page as Markdown:
   replace the trailing `/` with `.md`)

When they disagree, the types win. Known gaps (2.2.6): an RPC method needs
both `input` and `output`, and a contract needs `events`, even when empty.

## Layout

| Folder | Entry | `exports` key | Runs in |
| --- | --- | --- | --- |
| `src/server/` | `server.ts` | `.` and `./server` | opencode server (Bun; Node APIs, `ctx`) |
| `src/tui/` | `tui.tsx` | `./tui` | terminal UI (Bun, OpenTUI + Solid), no build |
| `src/gui/` | `gui.tsx` | `./gui-experimental` -> `./dist/gui-experimental.cjs` | Desktop windows + Electron main, Vite build |
| `src/rpc/` | `rpc.ts` | `./rpc` | imported by every part and outside callers |
| `src/shared/` | — | — | code more than one part imports |

- Keep both `.` and `./server` pointing at the server entry. opencode tries
  `./server` first, so one key is enough on a fresh start. But after
  `/reload` a running opencode can keep the previous `exports` map: if an
  older version had `".": "./src/index.ts"`, the stale `.` wins and loading
  fails on the deleted file. Declaring both is harmless and avoids that.
- Parts talk to each other only through the RPC contract, never by
  importing each other's folders. `rpc.ts` imports only
  `@opencode/plugin/rpc` and pure `src/shared/` code.
- `src/shared/`: `constants.ts` is pure (every part, GUI included).
  `paths.ts` uses `node:*`, so server and TUI only: GUI windows get inert
  placeholders for Node built-ins. Move code here only when a second part
  needs it.
- GUI: import only modules the desktop app provides (docs "Shared
  modules"). `dist/` is gitignored; `bun run build` makes it.

## One domain per file

Each part's entry is wiring only. A domain (server), area (TUI) or registry
(GUI) gets its own file in that part's folder, exporting a factory:

- server: returns a sync `(editor) => void` for `ctx.<domain>.transform(...)`,
  or a callback for `ctx.<domain>.hook(name, ...)`. Hooks go in their own
  `*-hooks.ts` file, apart from the domain's transform file.
- TUI: takes `context` and returns what `context.<area>` needs.
- GUI: takes `ctx` and calls `ctx.add(<Registry>, ...)`.

Multi-item files keep a list of `{ name, description, ..., run }` at the top,
the `run` functions below it, then the factory that iterates the list
(`src/server/tools.ts`).

Every domain not implemented yet appears in the entry file as a commented
import (naming the call it feeds) and a commented line in `setup()`. To add
one: create the file, uncomment both lines, and on the server uncomment its
editor type in `src/server/types.ts`. Don't delete the remaining comments
unless asked: they are the map of what the plugin could extend.

Agents (`agents/<id>.md`) and skills (`skills/<id>/SKILL.md`) are files, read
once in `setup()` before anything registers; list each id in `AGENT_IDS` /
`SKILL_IDS`. A reference (`src/server/references.ts`) is a named
directory, not a file: `references/` is registered as `special`. MCP
servers the plugin ships live in `mcp/` (`src/server/mcp.ts` registers
them); an optional piece like this one skips only its own registration when
it can't start, and logs why.
`tests/layout.test.ts` checks that the lists, the `exports` map and
`files` match what is on disk.

## Checks

Run all three before committing:

```bash
bun run typecheck   # tsc --noEmit over src/, tests/, vite.config.ts
bun test
bun run build       # GUI bundle
```

Pin `@opencode/plugin` to the `opencode --version` the plugin targets.

## Paths

Committed files must work for any account on any machine: no user, account
or machine names, and no absolute paths. Use `~/`, `$HOME`,
`%USERPROFILE%`, `%APPDATA%` or a path relative to the repo root.
