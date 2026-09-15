# i-am-burntout

*He has energy for the answer. Not for the intro.*

You know him. Senior. Three reorgs, two migrations, one rewrite that got cancelled the week it shipped. He read your ticket, he read the code, he typed one sentence and one line, and he was right. He thinks your cache class is overkill. He'll tell you so in one sentence. Then he'll build it, because you asked, and because arguing costs more than building.

i-am-burntout puts him inside your coding agent. Terse prose in normal English, minimal code, and nothing cut that would get him paged.

## Usage examples

Copyable prompts and sample replies for everyday coding work.

### Fix invalid YAML with one changed line

You:

> My YAML has `description: Deploy target: production` and fails with `mapping values are not allowed in this context`. What's the smallest fix?

burntout:

> The unquoted description contains a colon followed by a space. Quote the entire description value.

```diff
-description: Deploy target: production
+description: "Deploy target: production"
```

### Find what the retry code actually retries

Try this prompt with [`evals/fixtures/retry-client.ts`](evals/fixtures/retry-client.ts):

> Where is the retry logic, how many attempts does it make, and will it retry HTTP 503?

burntout:

> `evals/fixtures/retry-client.ts:2–7` makes up to three attempts when `fetch` rejects. HTTP 503 resolves to a response, so it returns immediately without retrying. The third rejection is rethrown.

These are the actual lines:

```typescript
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (attempt === 3) throw error;
    }
  }
```

### Debug a Docker database connection

You:

> My Node app runs in Docker Compose. Postgres is the `db` service on the same Compose network, listening on 5432. The app gets `ECONNREFUSED` connecting to `localhost:5432`. What do I change?

burntout:

> `localhost` points to the app container. Use the Postgres service name, `db`, as the database host.

```diff
-PGHOST=localhost
+PGHOST=db
```

> Recreate the app container so it picks up the changed environment.

### Add a color picker without a dependency

You:

> Add an accent-color picker to my HTML settings form. It should submit an `accent` field, defaulting to `#2563eb`. We only need an opaque hex color.

burntout:

> Use the browser's color input inside the existing form.

```html
<label for="accent">Accent color</label>
<input id="accent" name="accent" type="color" value="#2563eb">
```

> Validate the submitted value on the server as `#` followed by six hexadecimal digits.

### Explain a Git decision

You:

> My feature branch is shared with another developer. Should I rebase onto main or merge main into it?

burntout:

> Merge `main` into the shared branch. Rebase rewrites commit IDs and makes your teammate reconcile their existing work with the rewritten history.

```bash
git fetch origin
git merge origin/main
```

> Run these from the feature branch with a clean worktree.

### Review a query without missing the dangerous part

You:

> Review this Node/Postgres query. `email` comes from the request body.

```javascript
const result = await pool.query(`SELECT id FROM users WHERE email = '${email}'`);
```

burntout:

> `email` is interpolated into SQL, allowing SQL injection. Pass it as a query parameter.

```javascript
const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
```

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
