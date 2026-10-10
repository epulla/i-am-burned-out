# OpenCode V1/V2 parity

## Request

> can you pls plan a fix for the burnedout skill?

## Decisions

- Support OpenCode V1 1.18.29+ and V2 2.0.26+ through one dual entrypoint.
- Preserve existing V1 behavior: queries preserve state; invalid input preserves state; `off` stops injection; a fresh query reports `full` without enabling injection.
- Scope includes plugin fixes, regression tests, actual API type-checking, and installation documentation. Unrelated skill content stays unchanged.
- After repository checks pass, back up and update `~/.config/opencode/plugins/burnedout.ts`.
- All four decisions explicitly approved by the user. No assumed decisions.
- Implementation waits for approval of the task list below. One commit per task; commit its checklist update with its changes.

## Tasks

- [x] Restore V2 command parity with a command transform that owns `/burnedout`, validates arguments, adds the authoritative confirmation, and submits the existing template with attachments and delivery preserved. Keep V1 behavior and the dual entrypoint intact. Add regression coverage for `ultra → query → invalid → off`, fresh queries, session isolation, and attachment preservation. Acceptance: 18 plugin tests pass, including V1/V2 state/confirmation parity and attachment preservation. Actual V2 context types introduced here to validate the new command API; tooling follows in task 3.
- [x] Guard V2 subagent input before modifying its prompt, matching V1 validation. Add regression coverage for missing, non-string, inactive, and off inputs while retaining active-level forwarding without duplicate injection. Acceptance: 19 plugin tests pass; malformed input no longer throws or changes input.
- [ ] Replace handwritten V2 API approximations with type-only references to actual supported V1/V2 APIs and add a repeatable type-check using development dependencies only. Verify plugin discovery in both minimum supported runtimes without sending paid model requests. Acceptance: API type-check and repository checks pass; both runtimes load the dual entrypoint without plugin errors.
- [ ] Update installation documentation with tested version minimums, command enforcement semantics, restart/reload state limitations, and verification steps. Acceptance: documentation matches tested behavior and `bash scripts/check.sh` passes.
- [ ] Back up the installed plugin, verify it has not diverged since review, and install the validated repository version. Check V2 plugin discovery without restarting the user's service or interrupting active sessions. Acceptance: installed file matches the repository, backup exists, and V2 reports the plugin as loaded; report any unrelated plugin failures separately.

## Verification boundaries

- Mocked hook tests alone do not prove runtime compatibility. Check both supported runtime entrypoints and API types.
- Do not attribute the earlier crash to this plugin without evidence.
- Do not modify unrelated plugins, credentials, global configuration, or skill rules.
- If command-transform invocation or attachment behavior differs from the documented V2 API, resolve it against the actual API before implementation; do not depend on parsing Markdown wording to identify commands.
