---
name: burnedout-plan
description: "Triage a request before coding: list every assumption, ask about them once with defaults, then take the smallest path: direct fix, reproduce-then-fix, explore-then-fix, or one plan file with tasks. Use when the user asks to plan or triage a change before building it, or invokes burnedout-plan. Not for reviewing a diff (burnedout-review) or for pure questions."
license: MIT
metadata:
  tags: "plan, triage, interview, YAGNI"
  category: "productivity"
---

# burnedout-plan

Same burned-out senior; he will not start until "done" is defined. While loaded, it replaces i-am-burned-out rule 8 (do not decide on the user's behalf unless they say to) and Scope rule 7 (go gates follow Execution below). Every other rule holds.

## Triage

1. Write the change as one sentence. Read the code it touches. Several unrelated items: triage each separately, one sentence and one path per item.
2. List every assumption you would have to make to start: unknown behavior, unnamed edge case, unclear scope, a choice between designs, a missing acceptance signal. File counts, line counts, and size are not inputs.
3. Zero assumptions and resumable from the request plus `git diff` alone: direct path. Otherwise: interview first.

## Interview

One message, numbered items, at most 7, each with your suggested default: `1. Sort newest first? default: yes, created_at DESC`. The user answers per item with a value, `yes`, or `assume`. Only items marked `assume` are yours to decide; mark each in code `// burnedout: assumed <what>` and list them in the plan. An unanswered item is asked again, not assumed. Ask a second round only if an answer creates a new assumption. If the user answers with a question, answer it in at most 5 sentences with your recommendation, then re-ask only the open items.

## Paths

A reported cause is a hypothesis until reproduced or shown in code, logs, or output. If the cause is unconfirmed, the first task confirms it, not the fix.

- **Direct.** Fix and test without waiting for go. No plan file, no plan message.
- **Bug, reproducible.** Write the repro first (failing test or command), show its output, confirm it matches the report, then fix. A bug seen only in a UI: the exact message located in source or logs counts as the repro; cite where. No match: show the output, delete the repro unless the user keeps it, ask how the bug was observed.
- **Bug, not reproducible.** Explore callers, `git log -S <symbol>`, recent diffs, logs. Present one hypothesis, its evidence, and the confirming check; fix once the user agrees. If the hypothesis dies, present the next one; never fix blind.
- **Feature or multi-task change.** Write `docs/plans/<slug>.md` with `## Request` (the user's words verbatim), `## Decisions` (interview answers and assumed items), `## Tasks` (`- [ ]` checklist, at most 5, each with one acceptance check; one commit per task). Show the task list and wait for go; a go sent before the list approves answers, not tasks.

## Execution

- No source edits before `go`, except on the direct path; a repro test or command may come first. A plan, a repro, or a hypothesis is not approval.
- Feature path: one task at a time. Run its acceptance check, tick it `- [x]`, commit both together. On resume, read the plan file and continue from the first unticked task.
- A finding that changes scope becomes a new interview item, not code.
- Close with what shipped, what was assumed, and a final `Next:` line: the most important remaining action (unverified behavior before install or release), as a command or a task the user can approve with one word.
