# i-am-burntout

*He has energy for the answer. Not for the intro.*

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burntout puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## What changes

| Before | After |
| --- | --- |
| Great question! This is a common error that many Python developers run into. The issue is that you're modifying a dictionary while iterating over it... There are several approaches you could take... Hope this helps! | You're deleting keys from `cache` inside `for k in cache:`. Iterate over a snapshot: `for k in list(cache):`. Next: run it again and paste the traceback if it moves. |
| Request: add debounce to the search input. Agent writes another hook, a `DEBOUNCE_MS` constant, JSDoc, a test file, and a paragraph about lodash. | A `useDebounce` hook already exists: import it. One changed component, nothing else. |

## The rules

Eleven for prose, seven rungs for code. Full text in [skills/i-am-burntout/SKILL.md](skills/i-am-burntout/SKILL.md).

**Prose:** answer first · numbered steps, max 5 · no closers · no unbacked hedging · say what you do not know · normal grammar · specifics over vagueness · minimal formatting · flat errors · one next step · code and errors stay exact.

**Code ladder:** skip → reuse → stdlib → native → installed dep → one line → minimum that works. Read the code first. The ladder is a preference, not a veto: what you ask for gets built. Never cut validation, error handling, security, accessibility, or tests. He has been paged for every one of those.

**Tools:** scope commands before running them · locate files before reading bodies · inspect summaries before full diffs · use targeted searches and file ranges · preserve test exit status and diagnostics.

## Install

Use [INSTALL.md](INSTALL.md) for install, verify, update, uninstall, activation, and troubleshooting across 15 install sections covering 18 named hosts. Quick installs:

### Claude Code

```bash
claude plugin marketplace add epulla/i-am-burntout
claude plugin install i-am-burntout@i-am-burntout
```

Then start Claude Code. Run `/i-am-burntout:i-am-burntout` to check the level, `/i-am-burntout:i-am-burntout ultra` when the codebase has wronged you, or `/i-am-burntout:burntout-review` for a delete-list from the current diff.

### OpenCode

```bash
npx skills add epulla/i-am-burntout -a opencode -g -y
```

Restart OpenCode, then invoke the skill by name. Optional slash-command install is in [INSTALL.md](INSTALL.md).

### Agent Skills CLI

```bash
npx skills add epulla/i-am-burntout
```

Use this interactive route for Cursor, Amp, Windsurf, Cline, Copilot, OpenCode, and other supported Agent Skills harnesses. Host-native routes for Codex, Gemini CLI, and others are in [INSTALL.md](INSTALL.md).

### Instruction-only agents (Copilot CLI, Amp, Jules, Junie, Qoder)

Copy [AGENTS.md](AGENTS.md) into the project root or the host's persistent instruction file. Exact destinations are in [INSTALL.md](INSTALL.md#always-on-rules).

## Levels

| Level | Effect |
| --- | --- |
| `lite` | Prose rules only. Code untouched. |
| `full` | Everything. Default. |
| `ultra` | Full, plus answers of 3 sentences or fewer, no headers, chat responses show diffs only. |
| `off` | He took the PTO. Normal behavior. |

Levels are per conversation; there are no hooks and changing levels writes nothing to disk. The active level can be lost after context compaction, so run `/i-am-burntout <level>` again when needed.

## Related

Three skills did the parts first: structure from [i-have-adhd](https://github.com/ayghri/i-have-adhd), brevity from [caveman](https://github.com/JuliusBrussee/caveman), the YAGNI ladder and safety floor from [ponytail](https://github.com/DietrichGebert/ponytail). i-am-burntout is the three in one small file, in readable English, with a guy attached, and one difference that matters: he never refuses to write the code you asked for. Minimum means no padding, not no feature. If you want caveman-style compression or ponytail's audit and debt tooling, install those instead.

## License

MIT. He did not read it either.
