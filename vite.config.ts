// Builds the GUI part into the one CommonJS file that "./gui-experimental"
// exports. The preset compiles Solid JSX, inlines dynamic imports and keeps
// the modules the desktop app provides external. Only the GUI needs a build:
// opencode runs the server, TUI and RPC sources as they are.
import { defineConfig } from "vite"
import { gui } from "@opencode/plugin/gui/vite"

export default defineConfig({
  plugins: [
    gui({
      entry: "src/gui/gui.tsx", // the preset's default is src/gui.tsx
      // outFile: "dist/gui-experimental.cjs", // default; keep package.json in step
    }),
  ],
})
