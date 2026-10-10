# OpenCode V2 plugin support

## Request

> does opencode v2 have breaking changes for this plugin to work well?
>
> but what about this: https://opencode.ai/v2/docs/migrate-v1/
>
> how would you be able to make it work for v1 and v2?

## Decisions

Probed against opencode 2.0.26 in a scratch env:

- V2 rejects the current file: `Plugin must export a default definition with an id and an effect or setup function`.
- V2 subagent tool is `subagent`; prompt is in `input.prompt` (string). V1 stays `task`.
- V2 has no `command.execute.before`. A plugin command named `burnedout` is shadowed by `.opencode/commands/burnedout.md`.
- The V2 `prompt` hook sees the expanded template: ``1. Unless `<arg>` is `off` ...`` for no argument, `ultra`, and `off`.

Answered:

1. One file serves both: default export `{ id, setup, server }`. V1 >= 1.18.29 calls `server()`, V2 calls `setup()`.
2. Option A: V2 `prompt` hook reads the level with ``/^1\. Unless `([^`]*)` is `off`/``; `scripts/check.sh` fails if the template line changes.

Defaults, confirmed by `go`:

3. Level state stays the in-memory `bySession` map; no `ctx.storage`.
4. Type-only imports (`@opencode-ai/plugin`, `@opencode/plugin`); `node --test` strips them, so no new runtime dependency and the single-file `curl` install keeps working. `.opencode/package.json` unchanged.
5. Tests: one `test()` block per V2 hook in `scripts/plugin.test.ts`, matching existing style.
6. `INSTALL.md` notes V2 support; curl paths unchanged.

## Tasks

- [x] Dual export in `.opencode/plugins/burnedout.ts`: wrap existing hooks as `server`, add `id`. Check: `node --test scripts/plugin.test.ts` passes unchanged.
- [ ] V2 `setup`: `tool` `execute.before` for `subagent`, `session` `context` pushing `{type:"text"}` parts, `session` `prompt` parsing the level. Check: new V2 tests in `scripts/plugin.test.ts` pass.
- [x] Template guard in `scripts/check.sh` for ``1. Unless `$ARGUMENTS` is `off` ``. Check: `bash scripts/check.sh` passes; fails when the line is edited.
- [ ] `INSTALL.md` OpenCode section states V1 and V2 support. Check: `bash scripts/check.sh` passes.
- [ ] Manual V2 run: `/burnedout ultra` then a subagent call in scratch opencode2. Check: no plugin-load toast; subagent prompt contains the burnedout pointer.
