---
description: Review the current diff for over-engineering and slop; return a delete-list
---

Load the `i-am-burned-out` skill.

Resolve the review base, stopping at the first that resolves: `$ARGUMENTS` when it is non-empty, then `git merge-base origin/HEAD HEAD`, then `git merge-base origin/main HEAD`. Confirm a candidate with `git rev-parse --verify` before using it.

If none resolve, because the repository has no remote, no `origin/HEAD`, a detached HEAD, or no commit yet, review the working tree alone: `git status --short`, `git diff --cached --stat`, and `git diff --stat`, inspecting files with `git diff --cached -- <file>` and `git diff -- <file>`.

With a base, run `git status --short` and `git diff <base> --stat`. The single-ref form diffs the base against the working tree, so one pass covers committed, staged, and unstaged changes. Inspect files with `git diff <base> -- <file>`. Read relevant untracked files separately. Read `--stat` first and diff only the files that matter; never dump the whole diff at once.

Output a numbered delete-list, one item per line: `file:line — what to remove — which rung replaces it`. Include only removals and simplifications that keep validation, error handling, security, accessibility, and expected tests intact. If nothing qualifies, reply `burnedout: nothing to cut`.

Do not apply the changes. Do not comment on style, naming, or formatting.
