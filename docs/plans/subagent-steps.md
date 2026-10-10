# Subagent steps and duplicate plugin toast

## Request

> I got the following:
> - (bug) whenever I open opencode in this repo, I got the `Plugin failed: burnedout` message.
> - (fix) gpt6-sol and other models tend to let the subagents to take a lot of control over their subprocesses. Subagents should follow a step-by-step along with very precise instructions for making code changes

## Decisions

- Bug cause: `~/.config/opencode/plugins/burnedout.ts` and `.opencode/plugins/burnedout.ts` both export `id: "burnedout"`; OpenCode 2.0.26 marks the second as failed (`Duplicate plugin ID`). The first (global) stays active, so the toast is cosmetic.
- Bug fix: document it in `INSTALL.md`; no code change, no moving `.opencode/` sources (raw install URLs stay valid).
- Subagent fix is eval-first: change rules only if the eval fails against current rules.
- Proposed rule if the eval fails: never delegate explore-and-edit together. Exploration subagents return findings only; code-editing subagents get numbered steps (file, symbol or line, edit, check) and stop and report on any mismatch; the main agent makes 1–2 file edits directly.
- Applies to all models. Version bump to `0.11.2` only if task 3 ships.
- `burnedout-plan` changes from this session stay general, not specific to this repo.
- No assumed decisions.

## Tasks

- [x] Add a one-line `INSTALL.md` note: a global plus project copy shows `Plugin failed: burnedout`; the first copy loaded stays active; keep one. Acceptance: `bash scripts/check.sh` passes.
- [x] Add an eval to `evals/evals.json`: a request that needs exploring `evals/fixtures` callers and editing them. Pass: the main agent explores first, then edits directly or delegates numbered steps; fail: one subagent both explores and edits. Run it against current rules. Acceptance: eval result recorded here (pass or fail, model, runs). Result: eval 12, `opencode run --standalone --auto -m openai/gpt-6.1-sol` with HEAD `AGENTS.md`, 3/3 fail. Each run sent one `general` subagent a goal plus constraints (smallest design, line budget, "locate matches") and it searched and edited; the main agent wrote no steps. Edits were correct (2 files, +9/-9), so the failure is process, not output.
- [ ] Only if task 2 failed: update rule 47 in `skills/i-am-burned-out/SKILL.md`, regenerate `AGENTS.md` with `scripts/agents-md.sh`, add the stop-on-mismatch sentence to `SUBAGENT` in `.opencode/plugins/burnedout.ts` with a test in `scripts/plugin.test.ts`, bump to `0.11.2`. Acceptance: the task 2 eval passes; `pnpm test` and `bash scripts/check.sh` pass.
- [ ] Generalize `skills/burnedout-plan/SKILL.md` (no repo-specific wording): triage multi-item requests per item; answer user questions in ≤5 sentences with a recommendation, then re-ask open items; confirm the premise before proposing a fix; UI-only bugs accept the exact message found in source or logs as the repro. Sync `skills/burnedout-plan/agents/*` if they copy the text. Acceptance: `bash scripts/check.sh` passes.
