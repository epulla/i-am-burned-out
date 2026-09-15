# How to install

Each route uses files shipped by this repository. Commands in `bash` blocks run in your shell; slash commands run inside the named agent. Start a new agent session after installing or updating because agents commonly index skills and commands at startup.

<details>
<summary><strong>Antigravity (<code>agy</code>)</strong></summary>

### Install

```bash
agy plugin install https://github.com/epulla/i-am-burntout
```

### Verify

```bash
agy plugin list
```

### Update

```bash
agy plugin uninstall i-am-burntout
agy plugin install https://github.com/epulla/i-am-burntout
```

### Uninstall

```bash
agy plugin uninstall i-am-burntout
```

</details>

<details>
<summary><strong>AstronClaw (custom skill)</strong></summary>

This route follows [AstronClaw's custom-skills documentation](https://github.com/iflytek/astronclaw-tutorial/blob/main/docs/guide/astronclaw/skills.md).

### Install

1. Download [`SKILL.md`](https://raw.githubusercontent.com/epulla/i-am-burntout/main/skills/i-am-burntout/SKILL.md).
2. Open **My skills**, choose **New**, and upload the file.
3. Confirm the imported skill is named `i-am-burntout`, then enable it.

### Verify

Ask: `Use i-am-burntout at full level. Explain how to create an empty Git repository.` The response should start with the command and contain no opener or closer.

### Update

Download the latest `SKILL.md`, remove the old imported entry, and upload the new file.

### Uninstall

Delete or disable `i-am-burntout` in **My skills**, then start a new conversation.

</details>

<details>
<summary><strong>Claude Code</strong></summary>

### Install

```bash
claude plugin marketplace add epulla/i-am-burntout
claude plugin install i-am-burntout@i-am-burntout
```

Inside Claude Code, run `/i-am-burntout:level full`. Use `/i-am-burntout:level` with no argument to report the current level; `/i-am-burntout:burntout-review` reviews the current diff without changing it.

### Verify

```bash
claude plugin list
```

### Update

```bash
claude plugin marketplace update i-am-burntout
claude plugin update i-am-burntout@i-am-burntout
```

### Uninstall

```bash
claude plugin uninstall i-am-burntout
claude plugin marketplace remove i-am-burntout
```

</details>

<details>
<summary><strong>Codex</strong></summary>

### Install

```bash
codex plugin marketplace add epulla/i-am-burntout --ref main
codex plugin add i-am-burntout@i-am-burntout
```

Inside Codex, invoke `$i-am-burntout`. Add `at full`, `at ultra`, or `at off` to select a level. Other levels are rejected without changing the current level.

### Verify

```bash
codex plugin list
```

### Update

```bash
codex plugin marketplace upgrade i-am-burntout
codex plugin remove i-am-burntout
codex plugin add i-am-burntout@i-am-burntout
```

### Uninstall

```bash
codex plugin remove i-am-burntout
codex plugin marketplace remove i-am-burntout
```

</details>

<details>
<summary><strong>Grok (<code>grok</code>)</strong></summary>

### Install

```bash
grok plugin install epulla/i-am-burntout --trust
grok plugin enable i-am-burntout
```

Start a new session and run `/i-am-burntout full`. Grok requires both `--trust` and `plugin enable` before plugin skills and commands become available.

### Verify

```bash
grok plugin list
grok plugin details i-am-burntout
```

### Update

```bash
grok plugin update i-am-burntout
```

### Uninstall

```bash
grok plugin uninstall i-am-burntout --confirm
```

</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

Choose the custom command for on-demand use or the extension for always-on use. The extension loads the shipped [`GEMINI.md`](GEMINI.md); the custom command installs the shipped [`skills/i-am-burntout/agents/gemini.toml`](skills/i-am-burntout/agents/gemini.toml).

### Install command (on demand)

```bash
mkdir -p ~/.gemini/commands
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burntout/main/skills/i-am-burntout/agents/gemini.toml -o ~/.gemini/commands/i-am-burntout.toml
```

Start a new session and run `/i-am-burntout full`.

### Install extension (always on)

```bash
gemini extensions install https://github.com/epulla/i-am-burntout
```

### Verify

```bash
gemini extensions list
ls ~/.gemini/commands/i-am-burntout.toml
```

Run only the verification command for your route. For the command route, you can also type `/` in Gemini and confirm `i-am-burntout` appears.

### Update

```bash
gemini extensions update i-am-burntout
```

For the command route, rerun its `curl` command.

### Uninstall

```bash
gemini extensions uninstall i-am-burntout
rm ~/.gemini/commands/i-am-burntout.toml
```

Run only the uninstall command for the route you installed.

</details>

<details>
<summary><strong>GitHub Copilot (VS Code and CLI)</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burntout -a github-copilot
npx skills add epulla/i-am-burntout -a github-copilot -g
```

Use the first command for the current project or the second for all projects.

### Verify

```bash
npx skills list
npx skills ls -g
```

### Update

```bash
npx skills update i-am-burntout
npx skills update -g
```

Run the first command for a project install or the second for a global install.

### Uninstall

```bash
npx skills remove i-am-burntout
npx skills remove i-am-burntout -g
```

Run the command matching the scope you installed.

</details>

<details>
<summary><strong>Hermes</strong></summary>

### Install

```bash
hermes skills install epulla/i-am-burntout/skills/i-am-burntout
```

Start a new Hermes session and run `/i-am-burntout`.

### Verify

```bash
hermes skills list
```

### Update

```bash
hermes skills update i-am-burntout
```

### Uninstall

```bash
hermes skills uninstall i-am-burntout
```

</details>

<details>
<summary><strong>Kimi Code CLI</strong></summary>

### Install

1. Run `/plugins` in Kimi Code.
2. Choose **Custom**.
3. Enter `https://github.com/epulla/i-am-burntout`.
4. Choose **Trust and install**.

Invoke it with `/skill:i-am-burntout`.

### Update

Open `/plugins`, select **I Am Burntout**, press `Enter` to update it, then run `/reload` or start a new session.

### Uninstall

Open `/plugins`, select **I Am Burntout**, and press `D`.

</details>

<details>
<summary><strong>OpenCode</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burntout -a opencode -g -y
mkdir -p ~/.config/opencode/commands
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burntout/main/.opencode/commands/i-am-burntout.md -o ~/.config/opencode/commands/i-am-burntout.md
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burntout/main/.opencode/commands/burntout-review.md -o ~/.config/opencode/commands/burntout-review.md
```

Restart OpenCode and run `/i-am-burntout full`.

### Verify

```bash
npx skills ls -g
ls ~/.config/opencode/commands/i-am-burntout.md ~/.config/opencode/commands/burntout-review.md
```

Type `/` in OpenCode and confirm both commands appear.

### Update

```bash
npx skills update -g
```

Rerun both `curl` commands to update the slash commands.

### Uninstall

```bash
npx skills remove i-am-burntout -g
rm ~/.config/opencode/commands/i-am-burntout.md ~/.config/opencode/commands/burntout-review.md
```

</details>

<details>
<summary><strong>Pi</strong></summary>

### Install

```bash
pi install https://github.com/epulla/i-am-burntout
```

This package ships an Agent Skill, not a Pi extension. Start a new Pi session and invoke `/skill:i-am-burntout`.

### Verify

```bash
pi list
```

### Update

```bash
pi update https://github.com/epulla/i-am-burntout
```

### Uninstall

```bash
pi remove https://github.com/epulla/i-am-burntout
```

</details>

<details>
<summary><strong>Oh My Pi (OMP)</strong></summary>

### Install

```bash
omp plugin marketplace add epulla/i-am-burntout
omp plugin install --scope user i-am-burntout@i-am-burntout
```

Start a new OMP session and run `/i-am-burntout full`.

### Verify

```bash
omp plugin list
```

### Update

```bash
omp plugin marketplace update i-am-burntout
omp plugin upgrade --scope user i-am-burntout@i-am-burntout
```

### Uninstall

```bash
omp plugin uninstall --scope user i-am-burntout@i-am-burntout
omp plugin marketplace remove i-am-burntout
```

</details>

<details>
<summary><strong>Qwen Code</strong></summary>

### Install

```bash
qwen extensions install epulla/i-am-burntout
```

Start a new Qwen Code session, run `/skills` to confirm discovery, then invoke `/i-am-burntout`.

### Verify

```bash
qwen extensions list
```

### Update

```bash
qwen extensions update i-am-burntout
```

### Uninstall

```bash
qwen extensions uninstall i-am-burntout
```

</details>

<details>
<summary><strong>Zed</strong></summary>

### Install

In Agent Panel, choose **Create skill from URL** and use:

```text
https://github.com/epulla/i-am-burntout/blob/main/skills/i-am-burntout/SKILL.md
```

For a filesystem install:

```bash
git clone https://github.com/epulla/i-am-burntout
mkdir -p ~/.agents/skills
cp -R i-am-burntout/skills/i-am-burntout ~/.agents/skills/
```

### Verify

Open Skills manager and confirm `i-am-burntout` appears.

### Update

Re-import the URL, or run `git pull` and copy the skill folder again.

### Uninstall

Remove the skill in Skills manager or delete `~/.agents/skills/i-am-burntout`.

</details>

<details>
<summary><strong>Cursor, Amp, Windsurf, Cline, and other Agent Skills harnesses</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burntout
npx skills add epulla/i-am-burntout -g
npx skills add epulla/i-am-burntout -a cursor -y
```

Use one command only: current workspace, global, or a named agent. Replace `cursor` with a target supported by the Agent Skills CLI.

### Verify

```bash
npx skills list
npx skills ls -g
```

### Update

```bash
npx skills update i-am-burntout
npx skills update -g
```

Run the first command for a workspace install or the second for a global install.

### Uninstall

```bash
npx skills remove i-am-burntout
npx skills remove i-am-burntout -g
```

Run the command matching the scope you installed.

</details>

## Always-on rules

[`AGENTS.md`](AGENTS.md) is the shipped instruction-only, always-on version. Copy its contents into a project root or a host's persistent instruction file: `~/.codex/AGENTS.md`, `~/.config/opencode/AGENTS.md`, `~/.grok/AGENTS.md`, `~/.config/zed/AGENTS.md`, or `.github/copilot-instructions.md`. Cursor users can use User Rules or a project rule with `alwaysApply: true`.

## Activation

The shipped skill allows automatic invocation. For deterministic activation, use the host syntax above and request `full`, `ultra`, or `off`. Other levels are rejected without changing the current level. Use `off`, `stop burntout mode`, or `normal mode` to stop it for the current conversation. Invoke it again if context compaction drops the active instructions.

## Troubleshooting

**Skill or command missing.** Restart the agent, then use the host's verify command. Confirm `skills/i-am-burntout/SKILL.md` kept its filename, folder name, and `name: i-am-burntout` frontmatter.

**Claude marketplace add fails.** Use `epulla/i-am-burntout`, not a local subdirectory. Local installs must point at repository root.

**Grok plugin is invisible.** Install with `--trust`, run `grok plugin enable i-am-burntout`, and start a new session.

**OpenCode rejects its config.** Start with `OPENCODE_DISABLE_PROJECT_CONFIG=1 opencode`, fix the config, then restart normally. This repository's `opencode.json` follows `https://opencode.ai/config.json`.

**Replies still contain preamble.** Invoke the skill explicitly at `full`, then start a new conversation if the host indexed an older copy.
