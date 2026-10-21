---
name: burnedout-execute
description: "Execute planned work when the user says ‘go’, says ‘execute the plan’, or invokes burnedout-execute. Do not use for planning (burnedout-plan) or reviewing (burnedout-review)."
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
3. Size it. Small (≤ ~50 changed lines, ≤ 2 files, no new module): do it directly, run the touched tests, and finish; no subagents. Medium or large: continue.
4. Existing code: one explore subagent returns paths, symbols, and test commands (≤ 20 lines, no code). New project: skip explore.
5. Write TODOs with explicit dependencies; assign one owner per file; parallelize independent tasks.
6. UI changes: main agent reads and edits directly because visual/product context matters. Everything else: delegate outcome, not steps. Each brief states one-sentence change, acceptance criteria with exact test command, owned files (others read-only), out of scope, and line budget. Paste into each brief: “Rules: minimum code that works; reuse existing code; no speculative abstractions, helpers, or unrelated cleanup; one test per behavior; report max 5 lines: status, files, +A/-D, checks, blockers. Report each deviation from the brief as file:line, what, why.”
7. Hard stops: report, do not edit, if work needs an unowned file or would change retry, error, alert, or skip behavior.
8. Main agent may read/grep code and run probes to diagnose bugs, and run builds, git, and app commands. It does not implement non-UI code.
9. Verify once per batch: one verification subagent runs the tests and build. If the batch diff is > ~50 lines or spans several files, it also loads burnedout-review and returns the delete-list. Forward delete items to the owner's session, or to a new subagent with the exact items.
10. Run `git diff --stat`; cut what the sentence does not need. Commit per repo convention.
11. Keep TODOs synced; never mark unverified work done; report real blockers. Remove unneeded temp files, plans, and DBs.
12. Finish with changes, total +A/-D, verification, blockers, and `Next:` only if work remains.
