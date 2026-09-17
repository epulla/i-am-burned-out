# i-am-burned-out

*He has energy for the answer. Not for the intro.*

## Contents

- [Before and after](#before-and-after)
- [The rules](#the-rules)
- [Install](#install)
- [Levels](#levels)
- [FAQ](#faq)
- [Related](#related)
- [License](#license)

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burned-out puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## Before and after

Illustrative before/after replies to concrete coding tasks. The fix comes first; the code stays small.

| Prompt | Before | After — i-am-burned-out |
| --- | --- | --- |
| Inside my async function, `jobs.forEach(async (job) => await save(job)); done();` calls `done()` too early. Save jobs in order and stop if one fails. | The callback passed to `forEach` is asynchronous, but `forEach` itself does not consume the promises it returns. There are several alternatives, including mapping to promises or building a promise chain with `reduce`. Because you need sequential execution, you should use an iteration construct that lets you await each operation before continuing. | `forEach` doesn't await the callbacks. Use a sequential loop; a rejected save stops it before `done()`:<br><br>`for (const job of jobs) {`<br>`  await save(job);`<br>`}`<br>`done();` |
| My React list doesn't update after `items.push(item); setItems(items);`. | React uses reference equality when deciding whether a state update changes the value. Arrays are reference types, and pushing into an array mutates it without creating a new reference. To address this, you need an immutable update that creates another array containing the previous elements and the new item. | You're passing React the same array you mutated. Replace both statements with:<br><br>`setItems(previous => [...previous, item]);` |
| `const timeout = options.timeout \|\| 30;` turns my zero-second timeout into 30 seconds. Keep zero; default only when missing or null. | JavaScript distinguishes between falsy values and absent values. Zero belongs to the falsy category, along with empty strings and false, so the logical OR operator selects the fallback. You need to check specifically for null and undefined rather than using a general truthiness check. | `\|\|` discards zero. `??` defaults only for `null` or `undefined`:<br><br>`const timeout = options.timeout ?? 30;` |
| In Python, remove duplicate names from `names = ["api", "web", "api"]` while keeping the first occurrence's order. | I'll track the names we've already encountered in a set and keep a separate list for the result. For each name, we'll check membership in the set, add unseen names to both collections, and return the accumulated list once the loop finishes. | Dictionaries preserve insertion order:<br><br>`names = list(dict.fromkeys(names))`<br><br>Result: `["api", "web"]`. |
| I have a valid JavaScript `Date` named `date`. Display it in London time with the date and time, including daylight-saving changes. | I'll add a date-formatting library and a helper that accepts a date, a time-zone identifier, and a format string. The helper will convert the instant into the selected zone and format the result, giving us a reusable place to handle future display requirements. | `Intl` handles the time zone and daylight saving:<br><br>`new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" }).format(date)` |

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

Then start Claude Code. Run `/i-am-burned-out:level` to check the level, `/i-am-burned-out:level ultra` when the codebase has wronged you, or `/i-am-burned-out:burnedout-review` for a delete-list from the current diff.

### OpenCode

```bash
npx skills add epulla/i-am-burned-out -a opencode -g -y
```

Restart OpenCode, then invoke the skill by name. Optional slash-command install is in [INSTALL.md](INSTALL.md).

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
