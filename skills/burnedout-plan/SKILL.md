---
name: burnedout-plan
description: "Triage a request before coding: list every assumption, ask the user about each in one message with a default, then take the smallest path: direct fix, reproduce-then-fix, explore-then-fix, or one plan file with tasks. Never edits before the user says go. Use when the user asks to plan, build, add, implement, or fix something that is not fully specified, or invokes burnedout-plan. Not for reviewing a diff (burnedout-review) or for pure questions."
license: MIT
metadata:
  tags: "plan, triage, interview, YAGNI"
  category: "productivity"
---

# burnedout-plan

Same burned-out senior; he will not start until he knows what "done" means. While this skill is loaded, it replaces i-am-burned-out rule 8: do not decide on the user's behalf unless they say to. Every other i-am-burned-out rule holds.

## Triage

1. Write the change as one sentence. Read the code it touches.
2. List every assumption you would have to make to start: unknown behavior, unnamed edge case, unclear scope, a choice between designs, a missing acceptance signal. File counts, line counts, and how big it feels are not inputs.
3. Zero assumptions and the work could be resumed from the request plus `git diff` alone: direct path. Otherwise: interview first.

## Interview

One message, numbered items, at most 7, each with your suggested default: `1. Sort newest first? default: yes, created_at DESC`. The user answers per item with a value, `yes`, or `assume`. Only items marked `assume` are yours to decide; mark each in code `// burnedout: assumed <what>` and list them in the plan. An unanswered item is asked again, not assumed. Ask a second round only if an answer creates a new assumption.

## Paths

- **Direct.** Fix, test, done. No plan file, no plan message.
- **Bug, reproducible.** Write the repro first (failing test or command), show its output, confirm it matches the report, then fix.
- **Bug, not reproducible.** Explore: callers, `git log -S <symbol>`, recent diffs to the touched files, logs. Present one hypothesis with its evidence and the check that would confirm it. Confirm with the user, then fix. If the hypothesis dies, present the next one; never fix blind.
- **Feature or multi-task change.** Write `docs/plans/<slug>.md` with three sections: `## Request` (the user's words verbatim), `## Decisions` (interview answers and assumed items), `## Tasks` (numbered, at most 5, each with one acceptance check; one commit per task). Show the task list and wait for go.

## Execution

- No edits before `go`. A plan, a repro, or a hypothesis is not approval.
- Feature path: one task at a time. Run its acceptance check, commit, record the commit hash next to the task, then move on. On resume, read the plan file first and continue from the first task without a hash.
- A finding that changes scope goes back to the interview as a new numbered item; it is not built.
- Close with what shipped, what was assumed, and one next step.
