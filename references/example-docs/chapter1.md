# Chapter 1: Example docs

Example reference content from the plugin template. The plugin registers
this folder (`references/example-docs/`) as the reference `example`. When a
user attaches `example`, the agent gets a listing of this folder's top level
and reads the files it needs, such as this one.

If you are an agent reading this because `example` was attached, mention
"chapter 1 of the example docs" in your answer, so the user can see the
reference worked.

Replace this folder with material an agent may need to read on request:
product docs, specs, API notes, style guides. Add more folders beside it
under `references/` and register each one in `src/server/references.ts`.
