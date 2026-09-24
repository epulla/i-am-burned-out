# i-am-burned-out

<p align="center">
  <img src="assets/burned-out-logo.png" alt="Hand-drawn stick figure with a frowning face and arms raised, standing in front of red, orange, and yellow flames" width="240">
</p>

*He has energy for the answer. Not for the intro.*

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burned-out puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## What it does

Full rules in [skills/i-am-burned-out/SKILL.md](skills/i-am-burned-out/SKILL.md).

- **Answer first.** The fix or next action in the first sentence, with file and line. Numbered steps, max 5. One next step, no recap.
- **Minimum code.** Skip → reuse → stdlib → native → installed dep → one line → minimum that works. What you ask for still gets built; if it's overkill, he says so in one sentence first.
- **Comments and tests carry the same weight as code.** A comment only when the code cannot say why. One test per behavior; it stays only if reverting the change would break it.
- **A safety floor.** Never cuts validation, error handling, security, accessibility, or tests. He has been paged for every one of those.
- **Small commands.** `jq -r .version package.json`, not `cat`. Long output capped on the first run; build logs go to a file.
- **Review.** [`burnedout-review`](skills/burnedout-review/SKILL.md) returns a numbered `file:line` delete-list for the current diff. It never applies the edits.

## Before and after

Real run, same prompt, model, and repo: Claude Code v2.1.274, Opus 5, `coursillo-app`. Skill loaded on the right.

**Prompt:** `let's plan a fix to update for sorting the groups from the group page by created_time instead of alphabetically`

| Without | With i-am-burned-out |
| --- | --- |
| <img src="assets/sample-no-burnedout-2026-09-17.png" alt="Claude Code answering without the skill: a What's there now header, options A and B, an Either way section, and Option A marked recommended" width="480"> | <img src="assets/sample-with-burnedout-2026-09-17.png" alt="Claude Code answering with the skill loaded: the answer first, a three-step plan for the recommended option, an alternate option, and one next step" width="480"> |

- Opens with the answer: "The sort lives in the API, not the page: `apps/api/src/routes/cf/groups.ts:20`".
- Makes the recommendation explicit and plans only that option, in three steps.
- Keeps the test step, because the repo has tests.

## Install

Every host, plus verify, update, and uninstall: [INSTALL.md](INSTALL.md).

**Claude Code**

```bash
claude plugin marketplace add epulla/i-am-burned-out
claude plugin install i-am-burned-out@i-am-burned-out
```

Run `/burnedout ultra` when the codebase has wronged you, or `/burnedout-review` for a delete-list.

**OpenCode**

```bash
npx skills add epulla/i-am-burned-out -a opencode -g -y
```

**Other Agent Skills hosts** (Cursor, Amp, Windsurf, Cline, Copilot)

```bash
npx skills add epulla/i-am-burned-out
```

**Instruction-only agents** (Copilot CLI, Amp, Jules, Junie, Qoder): copy [AGENTS.md](AGENTS.md) into the project root. Other destinations in [INSTALL.md](INSTALL.md#always-on-rules).

## Levels

| Level | Effect |
| --- | --- |
| `full` | Everything. Default. |
| `ultra` | Full, plus answers of 3 sentences or fewer, no headers, diffs only. |
| `off` | He took the PTO. Normal behavior. |

Levels are per conversation. Details in [INSTALL.md](INSTALL.md).

## FAQ

**Can I use it with [caveman](https://github.com/JuliusBrussee/caveman)?** Yes. They overlap only on prose style, where caveman's fragments win; the safety floor, code ladder, and tool rules are i-am-burned-out's alone.

## Related

Three skills did the parts first: structure from [i-have-adhd](https://github.com/ayghri/i-have-adhd), brevity from [caveman](https://github.com/JuliusBrussee/caveman), the YAGNI ladder and safety floor from [ponytail](https://github.com/DietrichGebert/ponytail). i-am-burned-out is the three in one small file, in readable English, with a guy attached, and one difference that matters: he never refuses to write the code you asked for. Minimum means no padding, not no feature. If you want caveman-style compression or ponytail's audit and debt tooling, install those instead.

## License

MIT. He did not read it either.
