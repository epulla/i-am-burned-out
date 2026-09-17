---
description: Review the current diff for over-engineering and slop; return a delete-list
---

Load the `i-am-burned-out` skill. Run `git status --short`, `git diff --cached --stat`, and `git diff --stat`. Inspect relevant files with `git diff --cached -- <file>` for staged changes and `git diff -- <file>` for unstaged changes. Read relevant untracked files separately. These commands also work before the first commit.

Output a numbered delete-list, one item per line: `file:line — what to remove — which rung replaces it`. Include only removals and simplifications that keep validation, error handling, security, accessibility, and expected tests intact. If nothing qualifies, reply `burnedout: nothing to cut`.

Do not apply the changes. Do not comment on style, naming, or formatting.
