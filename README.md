# i-am-burntout

*He has energy for the answer. Not for the intro.*

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burntout puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## Before and after

Same prompt, less padding. These illustrative comparisons show the response style and code choices i-am-burntout aims for.

| Prompt | Before | After — i-am-burntout |
| --- | --- | --- |
| My YAML has `description: Deploy target: production` and fails with `mapping values are not allowed in this context`. What's the smallest fix? | YAML uses colons to separate keys from values, and there are several ways to represent strings, including plain scalars, quoted scalars, and block scalars. In your case, the second colon is followed by a space, which is not allowed inside this unquoted value. You can resolve this by wrapping the description in double quotes. | The unquoted description contains a colon followed by a space. Quote the entire value:<br><br>`description: "Deploy target: production"` |
| In [`retry-client.ts`](evals/fixtures/retry-client.ts), where is the retry logic, how many attempts does it make, and will it retry HTTP 503? | The retry logic is implemented in the `fetchWithRetry` function. Let's walk through how it works. The loop starts at one and continues while the attempt number is at most three. Each iteration calls `fetch` inside a try/catch block. A rejection leads to another iteration unless this is the third attempt. HTTP 503 does not reject the fetch promise, so that response is returned without another attempt. | `evals/fixtures/retry-client.ts:2–7` makes up to three attempts when `fetch` rejects. HTTP 503 returns immediately without retrying. The third rejection is rethrown. |
| My Node app runs in Docker Compose. Postgres is the `db` service on the same network, listening on 5432. The app gets `ECONNREFUSED` connecting to `localhost:5432`. What do I change? | Docker containers have their own network namespaces. This means that the meaning of localhost inside a container differs from its meaning on your host machine. Docker Compose also provides service-name resolution between containers on the same network. Since your database service is named `db`, update the database hostname from `localhost` to `db`, then recreate the app container to apply the environment change. | `localhost` points to the app container. Change `PGHOST=localhost` to `PGHOST=db`. Recreate the app container to apply the changed environment. |
| Add an accent-color picker to my HTML settings form. Submit an `accent` field, defaulting to `#2563eb`. We only need an opaque hex color. | I'll build a reusable color-picker widget with a swatch grid, a hex text field, a preview, and a hidden `accent` input for form submission. It will need JavaScript to synchronize the selected value, keyboard navigation for the swatches, and custom styles for the selection state. We'll also validate the hex value on the server. | Use the browser's color input inside the existing form:<br><br>`<label for="accent">Accent color</label>`<br>`<input id="accent" name="accent" type="color" value="#2563eb">`<br><br>Validate the submitted value on the server as `#` followed by six hexadecimal digits. |
| My feature branch is shared with another developer. Should I rebase onto main or merge main into it? | Both merge and rebase integrate changes from another branch, but they do so differently. Merge preserves existing commits and can create a merge commit, while rebase replays commits on a new base to produce a linear history. The right choice depends on your collaboration workflow. Since another developer is using this branch, merging is preferable because rebasing would rewrite commits they already have. | Merge `main` into the shared branch. Rebase rewrites commits your teammate already has. From the feature branch with a clean worktree, run:<br><br>`git fetch origin`<br>`git merge origin/main` |
| Review this Node/Postgres query. `email` comes from the request body.<br><br>``const result = await pool.query(`SELECT id FROM users WHERE email = '${email}'`);`` | There is a security concern with the way this query is constructed. Template literals insert the value directly into the SQL string. Since the value comes from the request body, an attacker can provide text that changes the query's meaning. PostgreSQL supports parameterized queries, which separate values from SQL syntax. Replace the interpolated value with `$1` and pass `[email]` as the second argument to `pool.query`. | `email` is interpolated into SQL, allowing SQL injection. Pass it as a query parameter:<br><br>`const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);` |

## Live sample

This response was written in OpenCode after loading `i-am-burntout` at `full` and reading [`evals/fixtures/retry-client.ts`](evals/fixtures/retry-client.ts).

| Sample question | Actual response |
| --- | --- |
| Does `fetchWithRetry` retry HTTP 503, and does it wait between attempts? | No. `evals/fixtures/retry-client.ts:2–7` retries only rejected `fetch` calls, up to three attempts, with no backoff delay. HTTP 503 resolves to a response and returns immediately; the third rejection is rethrown. |

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

Then start Claude Code. Run `/i-am-burntout:level` to check the level, `/i-am-burntout:level ultra` when the codebase has wronged you, or `/i-am-burntout:burntout-review` for a delete-list from the current diff.

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
| `full` | Everything. Default. |
| `ultra` | Full, plus answers of 3 sentences or fewer, no headers, chat responses show diffs only. |
| `off` | He took the PTO. Normal behavior. |

Levels are per conversation; there are no hooks and changing levels writes nothing to disk. Only `full`, `ultra`, and `off` are valid; invalid levels are rejected without changing the current level. The active level can be lost after context compaction, so run the host command again when needed.

## Related

Three skills did the parts first: structure from [i-have-adhd](https://github.com/ayghri/i-have-adhd), brevity from [caveman](https://github.com/JuliusBrussee/caveman), the YAGNI ladder and safety floor from [ponytail](https://github.com/DietrichGebert/ponytail). i-am-burntout is the three in one small file, in readable English, with a guy attached, and one difference that matters: he never refuses to write the code you asked for. Minimum means no padding, not no feature. If you want caveman-style compression or ponytail's audit and debt tooling, install those instead.

## License

MIT. He did not read it either.
