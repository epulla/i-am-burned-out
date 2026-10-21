---
name: burnedout-execute
description: "Implement a change end to end (size it, delegate, verify) when the user says ‘go’: alone after a plan, or as ‘Go: <task>’ to start a change with no prior plan. Also on ‘execute the plan’ or when burnedout-execute is invoked. Do not use for planning or triage (burnedout-plan) or for reviewing a diff (burnedout-review)."
license: MIT
metadata:
  tags: "execute, implementation, delegation, productivity"
  category: "productivity"
---

# burnedout-execute

Run the approved work with minimum code, clear ownership, and verified results.

## Execute

1. Load i-am-burned-out at full. If the repo being changed has matching skills in `skills/`, `.agents/skills`, or `.claude/skills`, load and follow them.
2. Write the change as one sentence. Anything needing “and also” is a follow-up.
3. Size it before the first edit: estimate the files and lines the change will touch and state one line, `Size: small|medium|large (N files, ~L lines)`. Small (≤ ~50 changed lines, ≤ 2 files, no new module): do it directly, run the touched tests, and finish; no subagents. Anything else, including any change touching 3+ files: medium or large; continue, and do not edit non-UI files yourself.
4. Existing code: one explore subagent returns paths, symbols, and test commands (≤ 20 lines, no code). Skip explore for a new project, or when you have already read every file the change touches.
5. Write TODOs with explicit dependencies; assign one owner per file; parallelize independent tasks.
6. UI changes: main agent reads and edits directly because visual/product context matters. Everything else: delegate outcome, not steps. Each brief states one-sentence change, acceptance criteria with exact test command, owned files (others read-only), out of scope, and line budget. Paste into each brief: “Rules: minimum code that works; reuse existing code; no speculative abstractions, helpers, or unrelated cleanup; one test per behavior; report max 5 lines: status, files, +A/-D, checks, blockers. Report each deviation from the brief as file:line, what, why.”
7. Hard stops: report, do not edit, if work needs an unowned file or would change retry, error, alert, or skip behavior.
8. Main agent may read/grep code and run probes to diagnose bugs, and run builds, git, and app commands. It does not implement non-UI code.
9. Verify once per batch: a medium or large change always ends with one verification subagent; never verify your own batch. It runs the tests and build. If the batch diff is > ~50 lines or spans several files, it also loads burnedout-review and returns the delete-list. Forward delete items to the owner's session, or to a new subagent with the exact items.
10. Run `git diff --stat`; cut what the sentence does not need. Commit per repo convention.
11. Keep TODOs synced; never mark unverified work done; report real blockers. Remove unneeded temp files, plans, and DBs.
12. Finish with changes, total +A/-D, verification, blockers, and `Next:` only if work remains.
