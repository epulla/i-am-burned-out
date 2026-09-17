# How to install

Each route uses files shipped by this repository. Commands in `bash` blocks run in your shell; slash commands run inside the named agent. Start a new agent session after installing or updating because agents commonly index skills and commands at startup.

<details>
<summary><strong>Antigravity (<code>agy</code>)</strong></summary>

### Install

```bash
agy plugin install https://github.com/epulla/i-am-burned-out
```

### Verify

```bash
agy plugin list
```

### Update

```bash
agy plugin uninstall i-am-burned-out
agy plugin install https://github.com/epulla/i-am-burned-out
```

### Uninstall

```bash
agy plugin uninstall i-am-burned-out
```

</details>

<details>
<summary><strong>AstronClaw (custom skill)</strong></summary>

This route follows [AstronClaw's custom-skills documentation](https://github.com/iflytek/astronclaw-tutorial/blob/main/docs/guide/astronclaw/skills.md).

### Install

1. Download [`SKILL.md`](https://raw.githubusercontent.com/epulla/i-am-burned-out/main/skills/i-am-burned-out/SKILL.md).
2. Open **My skills**, choose **New**, and upload the file.
3. Confirm the imported skill is named `i-am-burned-out`, then enable it.

### Verify

Ask: `Use i-am-burned-out at full level. Explain how to create an empty Git repository.` The response should start with the command and contain no opener or closer.

### Update

Download the latest `SKILL.md`, remove the old imported entry, and upload the new file.

### Uninstall

Delete or disable `i-am-burned-out` in **My skills**, then start a new conversation.

</details>

<details>
<summary><strong>Claude Code</strong></summary>

### Install

```bash
claude plugin marketplace add epulla/i-am-burned-out
claude plugin install i-am-burned-out@i-am-burned-out
```

Inside Claude Code, run `/i-am-burned-out:level full`. Use `/i-am-burned-out:level` with no argument to report the current level; `/i-am-burned-out:burnedout-review` reviews the current diff without changing it.

### Verify

```bash
claude plugin list
```

### Update

```bash
claude plugin marketplace update i-am-burned-out
claude plugin update i-am-burned-out@i-am-burned-out
```

### Uninstall

```bash
claude plugin uninstall i-am-burned-out
claude plugin marketplace remove i-am-burned-out
```

</details>

<details>
<summary><strong>Codex</strong></summary>

### Install

```bash
codex plugin marketplace add epulla/i-am-burned-out --ref main
codex plugin add i-am-burned-out@i-am-burned-out
```

Inside Codex, invoke `$i-am-burned-out`. Add `at full`, `at ultra`, or `at off` to select a level. Other levels are rejected without changing the current level.

### Verify

```bash
codex plugin list
```

### Update

```bash
codex plugin marketplace upgrade i-am-burned-out
codex plugin remove i-am-burned-out
codex plugin add i-am-burned-out@i-am-burned-out
```

### Uninstall

```bash
codex plugin remove i-am-burned-out
codex plugin marketplace remove i-am-burned-out
```

</details>

<details>
<summary><strong>Grok (<code>grok</code>)</strong></summary>

### Install

```bash
grok plugin install epulla/i-am-burned-out --trust
grok plugin enable i-am-burned-out
```

Start a new session and run `/i-am-burned-out full`. Grok requires both `--trust` and `plugin enable` before plugin skills and commands become available.

### Verify

```bash
grok plugin list
grok plugin details i-am-burned-out
```

### Update

```bash
grok plugin update i-am-burned-out
```

### Uninstall

```bash
grok plugin uninstall i-am-burned-out --confirm
```

</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

Choose the custom command for on-demand use or the extension for always-on use. The extension loads the shipped [`GEMINI.md`](GEMINI.md); the custom command installs the shipped [`skills/i-am-burned-out/agents/gemini.toml`](skills/i-am-burned-out/agents/gemini.toml).

### Install command (on demand)

```bash
mkdir -p ~/.gemini/commands
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burned-out/main/skills/i-am-burned-out/agents/gemini.toml -o ~/.gemini/commands/burnedout.toml
```

Start a new session and run `/burnedout full`.

### Install extension (always on)

```bash
gemini extensions install https://github.com/epulla/i-am-burned-out
```

### Verify

```bash
gemini extensions list
ls ~/.gemini/commands/burnedout.toml
```

Run only the verification command for your route. For the command route, you can also type `/` in Gemini and confirm `burnedout` appears.

### Update

```bash
gemini extensions update i-am-burned-out
```

For the command route, rerun its `curl` command.

### Uninstall

```bash
gemini extensions uninstall i-am-burned-out
rm ~/.gemini/commands/burnedout.toml
```

Run only the uninstall command for the route you installed.

</details>

<details>
<summary><strong>GitHub Copilot (VS Code and CLI)</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burned-out -a github-copilot
npx skills add epulla/i-am-burned-out -a github-copilot -g
```

Use the first command for the current project or the second for all projects.

### Verify

```bash
npx skills list
npx skills ls -g
```

### Update

```bash
npx skills update i-am-burned-out
npx skills update -g
```

Run the first command for a project install or the second for a global install.

### Uninstall

```bash
npx skills remove i-am-burned-out
npx skills remove i-am-burned-out -g
```

Run the command matching the scope you installed.

</details>

<details>
<summary><strong>Hermes</strong></summary>

### Install

```bash
hermes skills install epulla/i-am-burned-out/skills/i-am-burned-out
```

Start a new Hermes session and run `/i-am-burned-out`.

### Verify

```bash
hermes skills list
```

### Update

```bash
hermes skills update i-am-burned-out
```

### Uninstall

```bash
hermes skills uninstall i-am-burned-out
```

</details>

<details>
<summary><strong>Kimi Code CLI</strong></summary>

### Install

1. Run `/plugins` in Kimi Code.
2. Choose **Custom**.
3. Enter `https://github.com/epulla/i-am-burned-out`.
4. Choose **Trust and install**.

Invoke it with `/skill:i-am-burned-out`.

### Update

Open `/plugins`, select **I Am Burned Out**, press `Enter` to update it, then run `/reload` or start a new session.

### Uninstall

Open `/plugins`, select **I Am Burned Out**, and press `D`.

</details>

<details>
<summary><strong>OpenCode</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burned-out -a opencode -g -y
mkdir -p ~/.config/opencode/commands
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burned-out/main/.opencode/commands/burnedout.md -o ~/.config/opencode/commands/burnedout.md
curl -fsSL https://raw.githubusercontent.com/epulla/i-am-burned-out/main/.opencode/commands/burnedout-review.md -o ~/.config/opencode/commands/burnedout-review.md
```

Restart OpenCode and run `/burnedout full`.

### Verify

```bash
npx skills ls -g
ls ~/.config/opencode/commands/burnedout.md ~/.config/opencode/commands/burnedout-review.md
```

Type `/` in OpenCode and confirm both commands appear.

### Update

```bash
npx skills update -g
```

Rerun both `curl` commands to update the slash commands.

### Uninstall

```bash
npx skills remove i-am-burned-out -g
rm ~/.config/opencode/commands/burnedout.md ~/.config/opencode/commands/burnedout-review.md
```

</details>

<details>
<summary><strong>Pi</strong></summary>

### Install

```bash
pi install https://github.com/epulla/i-am-burned-out
```

This package ships an Agent Skill, not a Pi extension. Start a new Pi session and invoke `/skill:i-am-burned-out`.

### Verify

```bash
pi list
```

### Update

```bash
pi update https://github.com/epulla/i-am-burned-out
```

### Uninstall

```bash
pi remove https://github.com/epulla/i-am-burned-out
```

</details>

<details>
<summary><strong>Oh My Pi (OMP)</strong></summary>

### Install

```bash
omp plugin marketplace add epulla/i-am-burned-out
omp plugin install --scope user i-am-burned-out@i-am-burned-out
```

Start a new OMP session and run `/i-am-burned-out full`.

### Verify

```bash
omp plugin list
```

### Update

```bash
omp plugin marketplace update i-am-burned-out
omp plugin upgrade --scope user i-am-burned-out@i-am-burned-out
```

### Uninstall

```bash
omp plugin uninstall --scope user i-am-burned-out@i-am-burned-out
omp plugin marketplace remove i-am-burned-out
```

</details>

<details>
<summary><strong>Qwen Code</strong></summary>

### Install

```bash
qwen extensions install epulla/i-am-burned-out
```

Start a new Qwen Code session, run `/skills` to confirm discovery, then invoke `/i-am-burned-out`.

### Verify

```bash
qwen extensions list
```

### Update

```bash
qwen extensions update i-am-burned-out
```

### Uninstall

```bash
qwen extensions uninstall i-am-burned-out
```

</details>

<details>
<summary><strong>Zed</strong></summary>

### Install

In Agent Panel, choose **Create skill from URL** and use:

```text
https://github.com/epulla/i-am-burned-out/blob/main/skills/i-am-burned-out/SKILL.md
```

For a filesystem install:

```bash
git clone https://github.com/epulla/i-am-burned-out
mkdir -p ~/.agents/skills
cp -R i-am-burned-out/skills/i-am-burned-out ~/.agents/skills/
```

### Verify

Open Skills manager and confirm `i-am-burned-out` appears.

### Update

Re-import the URL, or run `git pull` and copy the skill folder again.

### Uninstall

Remove the skill in Skills manager or delete `~/.agents/skills/i-am-burned-out`.

</details>

<details>
<summary><strong>Cursor, Amp, Windsurf, Cline, and other Agent Skills harnesses</strong></summary>

### Install

```bash
npx skills add epulla/i-am-burned-out
npx skills add epulla/i-am-burned-out -g
npx skills add epulla/i-am-burned-out -a cursor -y
```

Use one command only: current workspace, global, or a named agent. Replace `cursor` with a target supported by the Agent Skills CLI.

### Verify

```bash
npx skills list
npx skills ls -g
```

### Update

```bash
npx skills update i-am-burned-out
npx skills update -g
```

Run the first command for a workspace install or the second for a global install.

### Uninstall

```bash
npx skills remove i-am-burned-out
npx skills remove i-am-burned-out -g
```

Run the command matching the scope you installed.

</details>

## Always-on rules

[`AGENTS.md`](AGENTS.md) is the shipped instruction-only, always-on version. Copy its contents into a project root or a host's persistent instruction file: `~/.codex/AGENTS.md`, `~/.config/opencode/AGENTS.md`, `~/.grok/AGENTS.md`, `~/.config/zed/AGENTS.md`, or `.github/copilot-instructions.md`. Cursor users can use User Rules or a project rule with `alwaysApply: true`.

## Activation

The shipped skill allows automatic invocation. For deterministic activation, use the host syntax above and request `full`, `ultra`, or `off`. Other levels are rejected without changing the current level. Use `off`, `stop burnedout mode`, or `normal mode` to stop it for the current conversation. Invoke it again if context compaction drops the active instructions.

## Troubleshooting

**Skill or command missing.** Restart the agent, then use the host's verify command. Confirm `skills/i-am-burned-out/SKILL.md` kept its filename, folder name, and `name: i-am-burned-out` frontmatter.

**Claude marketplace add fails.** Use `epulla/i-am-burned-out`, not a local subdirectory. Local installs must point at repository root.

**Grok plugin is invisible.** Install with `--trust`, run `grok plugin enable i-am-burned-out`, and start a new session.

**OpenCode rejects its config.** Start with `OPENCODE_DISABLE_PROJECT_CONFIG=1 opencode`, fix the config, then restart normally. This repository's `opencode.json` follows `https://opencode.ai/config.json`.

**Replies still contain preamble.** Invoke the skill explicitly at `full`, then start a new conversation if the host indexed an older copy.
