# i-am-burned-out

*He has energy for the answer. Not for the intro.*

## Contents

- [What it does](#what-it-does)
- [Before and after](#before-and-after)
- [The rules](#the-rules)
- [Install](#install)
- [Levels](#levels)
- [FAQ](#faq)
- [Related](#related)
- [License](#license)

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burned-out puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## What it does

- **Answer first.** The first sentence is the fix or the next action, with the file and line that holds it. No "What's there now" preamble, no closer.
- **One recommendation, not a menu.** It picks an option and says why in one sentence instead of laying out A and B and leaving you to decide.
- **Numbered steps, capped at five.** One action per line, nothing hidden by grouping.
- **Minimum code that works.** A seven-rung ladder: skip it, reuse it, stdlib, native platform feature, installed dependency, one line, then the smallest thing that does the job. No helper called once, no config for one case, no interface with one implementation.
- **A safety floor it will not cut.** Input validation at trust boundaries, error handling where data can be lost, auth, secrets, injection defenses, UI accessibility, and a test when the repo has tests.
- **Builds what you asked for.** If your idea is overkill it says so in one sentence, then builds it anyway.
- **Scoped tool use.** Locate files before reading bodies, read large files by range, `git diff --stat` before the full diff, native test filters instead of full-suite dumps.
- **Two levels and an off switch.** `full`, `ultra` for three sentences and diffs only, `off` when you want the padding back.

## Before and after

Real run, not a mock-up. Same prompt, same model, same repository: Claude Code v2.1.274, Opus 5, `coursillo-app`. The only difference is that the skill was loaded on the right.

**Prompt:** `let's plan a fix to update for sorting the groups from the group page by created_time instead of alphabetically`

| Without | With i-am-burned-out |
| --- | --- |
| <img src="assets/sample-no-burnedout-2026-09-17.png" alt="Claude Code answering without the skill: a What's there now header, options A and B, an Either way section, and no recommendation" width="480"> | <img src="assets/sample-with-burnedout-2026-09-17.png" alt="Claude Code answering with the skill loaded: the answer in the first sentence, a three-step plan, a recommendation, and one next step" width="480"> |

What the skill changed in that run:

- Opens with the answer — "The sort lives in the API, not the page: `apps/api/src/routes/cf/groups.ts:20`" — instead of a section header.
- Names the catch once, with the two files that share the endpoint, rather than repeating it under three headings.
- Three numbered steps instead of an Option A / Option B / Either way layout.
- Commits to a choice: "I'd go with A, since you only asked about the groups page."
- Ends with exactly one next step and no recap.
- Keeps the test step. The plan still updates `groups.test.tsx`, because the repository has tests.

## The rules

Eleven for prose, seven rungs for code. Full text in [skills/i-am-burned-out/SKILL.md](skills/i-am-burned-out/SKILL.md).

**Prose:** answer first · numbered steps, max 5 · no closers · no unbacked hedging · say what you do not know · normal grammar · specifics over vagueness · minimal formatting · flat errors · one next step · code and errors stay exact.

**Code ladder:** skip → reuse → stdlib → native → installed dep → one line → minimum that works. Read the code first. The ladder is a preference, not a veto: what you ask for gets built. Never cut validation, error handling, security, accessibility, or tests. He has been paged for every one of those.

**Tools:** scope commands before running them · locate files before reading bodies · inspect summaries before full diffs · use targeted searches and file ranges · preserve test exit status and diagnostics.

## Install

Use [INSTALL.md](INSTALL.md) for install, verify, update, uninstall, activation, and troubleshooting across 15 install sections covering 18 named hosts. Quick installs:

### Claude Code

```bash
claude plugin marketplace add epulla/i-am-burned-out
claude plugin install i-am-burned-out@i-am-burned-out
```

Then start Claude Code. Run `/burnedout` to check the level, `/burnedout ultra` when the codebase has wronged you, or `/burnedout-review` for a delete-list from the current diff. If another command already owns those names, use the namespaced forms `/i-am-burned-out:burnedout` and `/i-am-burned-out:burnedout-review`, which are always available.

### OpenCode

```bash
npx skills add epulla/i-am-burned-out -a opencode -g -y
```

Restart OpenCode, then invoke the skill by name. Optional slash-command and plugin install is in [INSTALL.md](INSTALL.md); the plugin makes `/burnedout <level>` real per-session state instead of an instruction the model has to remember, and OpenCode is the only host where levels are enforced that way.

### Agent Skills CLI

```bash
npx skills add epulla/i-am-burned-out
```

Use this interactive route for Cursor, Amp, Windsurf, Cline, Copilot, OpenCode, and other supported Agent Skills harnesses. Host-native routes for Codex, Gemini CLI, and others are in [INSTALL.md](INSTALL.md).

### Instruction-only agents (Copilot CLI, Amp, Jules, Junie, Qoder)

Copy [AGENTS.md](AGENTS.md) into the project root or the host's persistent instruction file. Exact destinations are in [INSTALL.md](INSTALL.md#always-on-rules).

## Levels

| Level | Effect |
| --- | --- |
| `full` | Everything. Default. |
| `ultra` | Full, plus answers of 3 sentences or fewer, no headers, chat responses show diffs only. |
| `off` | He took the PTO. Normal behavior. |

Levels are per conversation; there are no hooks and changing levels writes nothing to disk. Only `full`, `ultra`, and `off` are valid; invalid levels are rejected without changing the current level. The active level can be lost after context compaction, so run the host command again when needed.

## FAQ

### Can I use i-am-burned-out with caveman?

Yes. Both can be active. i-am-burned-out governs safety, code decisions, and tool discipline; caveman governs prose compression. When they overlap, caveman's article-dropping and fragments override i-am-burned-out's normal-grammar preference.

### Do they conflict?

Only on prose style. Their core rules agree: remove filler, keep technical substance, and leave code unchanged.

### Does caveman replace i-am-burned-out?

No. Caveman does not provide i-am-burned-out's safety floor, code ladder, or testing rules. Use both when you want those rules with more compressed replies.

### Can I use only one?

Yes. Install either skill independently. Use [caveman](https://github.com/JuliusBrussee/caveman) for compression alone, or i-am-burned-out for concise normal-English coding guidance.

## Related

Three skills did the parts first: structure from [i-have-adhd](https://github.com/ayghri/i-have-adhd), brevity from [caveman](https://github.com/JuliusBrussee/caveman), the YAGNI ladder and safety floor from [ponytail](https://github.com/DietrichGebert/ponytail). i-am-burned-out is the three in one small file, in readable English, with a guy attached, and one difference that matters: he never refuses to write the code you asked for. Minimum means no padding, not no feature. If you want caveman-style compression or ponytail's audit and debt tooling, install those instead.

## License

MIT. He did not read it either.
