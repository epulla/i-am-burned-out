---
name: burnedout-review
description: "Review the current diff or branch for over-engineering, slop, and useless tests; return a numbered delete-list without applying it. Use when the user asks to review a diff, branch, PR, or change for bloat, slop, YAGNI, dead code, or low-value tests, or invokes burnedout-review. Do not load for /burnedout, the burnedout plugin, terse mode, or general coding requests; those use i-am-burned-out."
license: MIT
metadata:
  tags: "review, YAGNI, tests, diff"
  category: "productivity"
---

# burnedout-review

Review a change as a burned-out senior developer who has to maintain it: find what can go, and leave everything that keeps it safe.

## Scope the diff

1. Resolve the review base, stopping at the first that resolves: the user-supplied base when non-empty, then `git merge-base origin/HEAD HEAD`, then `git merge-base origin/main HEAD`. Confirm a candidate with `git rev-parse --verify` before using it.
2. With a base, run `git status --short` and `git diff <base> --stat`. The single-ref form diffs the base against the working tree, so one pass covers committed, staged, and unstaged changes. Inspect files with `git diff <base> -- <file>`.
3. If none resolve, because the repository has no remote, no `origin/HEAD`, a detached HEAD, or no commit yet, review the working tree alone: `git status --short`, `git diff --cached --stat`, and `git diff --stat`, inspecting files with `git diff --cached -- <file>` and `git diff -- <file>`.
4. Read relevant untracked files separately. Read `--stat` first and diff only the files that matter; never dump the whole diff at once.

## What to cut in code

Check each addition against the ladder and stop at the first rung that holds: skip it, reuse existing code, standard library, native platform feature, installed dependency, one clear line, minimum that works. Flag speculative abstractions, one-implementation interfaces, one-case config, single-use helpers, wrappers around working code, unrelated cleanup, and comments that restate the code, narrate the next statement, or are commented-out code.

## What to cut in tests

A test stays only if reverting the change it covers would make it fail. Flag:

- Assertions that a mock was called, or that a stub returned what the test told it to return.
- Tests that mirror the implementation step by step, so any refactor breaks them and no bug does.
- Tests that repeat another test with different literals through the same branch.
- Tests of the language, framework, or a constant: getters, type shapes, `expect(true).toBe(true)`.
- Tests for code the diff did not touch.
- `skip`, `todo`, empty bodies, and snapshots of whole outputs no one will read.
- Fixtures, factories, or helpers used by one test.
- Mocks of code the repo owns when the real thing runs fast and offline; mock only at boundaries such as network, clock, and filesystem.

Never flag the only test of a changed behavior, a test for a failure branch that can lose data, or a regression test for a reported bug.

## Output

Numbered delete-list, one item per line: `file:line — what to remove — rung or test rule that replaces it`. Include only removals and simplifications that keep trust-boundary validation, data-loss error handling, auth and injection defenses, accessibility, and at least one test per changed behavior. If nothing qualifies, reply `burnedout: nothing to cut`.

Do not apply the changes. Do not comment on style, naming, or formatting.
