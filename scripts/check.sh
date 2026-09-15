#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'FAIL %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS %s\n' "$1"
}

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
cd "$ROOT"

if ! command -v jq >/dev/null 2>&1; then
  fail 'jq is required to run checks'
fi

while IFS= read -r -d '' file; do
  if ! jq empty "$file" >/dev/null 2>&1; then
    fail "invalid JSON: $file"
  fi
done < <(git ls-files -z -- '*.json')
pass 'tracked JSON syntax'

VERSION_FILES=(
  'package.json'
  'qwen-extension.json'
  'kimi.plugin.json'
  'plugin.json'
  'gemini-extension.json'
  '.codex-plugin/plugin.json'
  '.claude-plugin/plugin.json'
  '.claude-plugin/marketplace.json'
)

if ! package_version=$(jq -er '.version | select(type == "string" and length > 0)' package.json); then
  fail 'package.json must contain nonempty string version'
fi

for file in "${VERSION_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    fail "missing expected version-bearing file: $file"
  fi
  if ! jq -e --arg expected "$package_version" '
    [.. | objects | select(has("version")) | .version] as $versions |
    ($versions | length > 0) and
    all($versions[]; type == "string" and length > 0 and . == $expected)
  ' "$file" >/dev/null; then
    fail "version mismatch or missing version in: $file"
  fi
done

while IFS= read -r -d '' file; do
  case "$file" in
    package.json|qwen-extension.json|kimi.plugin.json|plugin.json|gemini-extension.json|.codex-plugin/plugin.json|.claude-plugin/plugin.json|.claude-plugin/marketplace.json|opencode.json|evals/evals.json|.agents/plugins/marketplace.json)
      ;;
    *)
      if jq -e '[.. | objects | select(has("version"))] | length > 0' "$file" >/dev/null 2>&1; then
        fail "unexpected version-bearing JSON file: $file"
      fi
      ;;
  esac
done < <(git ls-files -z -- '*.json')
pass 'version synchronization across eight expected files'

SKILL='skills/i-am-burntout/SKILL.md'
if ! awk '
  NR == 1 { if ($0 != "---") exit 1; next }
  $0 == "---" { closed = 1; exit }
  END { if (!closed) exit 1 }
' "$SKILL"; then
  fail "$SKILL must have frontmatter delimiters"
fi

if ! frontmatter=$(awk '
  NR == 1 { in_frontmatter = 1; next }
  in_frontmatter && $0 == "---" { exit }
  in_frontmatter { print }
' "$SKILL"); then
  fail "cannot read $SKILL frontmatter"
fi
if ! printf '%s\n' "$frontmatter" | grep -Fqx 'name: i-am-burntout'; then
  fail "$SKILL frontmatter name must be i-am-burntout"
fi
if ! description=$(printf '%s\n' "$frontmatter" | awk '
  /^description:[[:space:]]+/ {
    value = $0
    sub(/^description:[[:space:]]+/, "", value)
    print value
    found = 1
    exit
  }
  END { if (!found) exit 1 }
'); then
  fail "$SKILL frontmatter description is required"
fi
if [ -z "$description" ]; then
  fail "$SKILL frontmatter description must be nonempty"
fi
if [ "${#description}" -gt 1024 ]; then
  fail "$SKILL frontmatter description exceeds 1024 characters"
fi
word_count=$(wc -w < "$SKILL" | tr -d '[:space:]')
if [ "$word_count" -gt 700 ]; then
  fail "$SKILL exceeds 700 words"
fi
pass 'SKILL.md frontmatter and word limits'

normalize_command() {
  awk '
    NR == 1 { in_frontmatter = ($0 == "---"); print; next }
    in_frontmatter && $0 == "---" { in_frontmatter = 0; print; next }
    in_frontmatter && $0 ~ /^argument-hint:[[:space:]]*/ { next }
    { print }
  ' "$1"
}

if [ ! -f commands/level.md ]; then
  fail 'missing Claude command: commands/level.md'
fi
if [ ! -f .opencode/commands/i-am-burntout.md ]; then
  fail 'missing OpenCode command: .opencode/commands/i-am-burntout.md'
fi
if ! tmp_dir=$(mktemp -d "${TMPDIR:-/tmp}/i-am-burntout-check.XXXXXX"); then
  fail 'cannot create temporary directory'
fi
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT
normalize_command commands/level.md > "$tmp_dir/claude-command"
normalize_command .opencode/commands/i-am-burntout.md > "$tmp_dir/opencode-command"
if ! cmp -s "$tmp_dir/claude-command" "$tmp_dir/opencode-command"; then
  fail 'Claude and OpenCode level command bodies differ'
fi
if ! cmp -s commands/burntout-review.md .opencode/commands/burntout-review.md; then
  fail 'Claude and OpenCode review commands differ'
fi
pass 'normalized command parity'

for file in README.md INSTALL.md GEMINI.md skills/i-am-burntout/SKILL.md skills/i-am-burntout/agents/gemini.toml commands/*.md .opencode/commands/*.md; do
  [ -f "$file" ] || continue
  if grep -nE '(^|[^[:alnum:]_])lite([^[:alnum:]_]|$)' "$file" >/dev/null; then
    fail "retired standalone lite level in: $file"
  fi
  if grep -nF '/i-am-burntout:i-am-burntout' "$file" >/dev/null; then
    fail "retired Claude command in: $file"
  fi
  if grep -nE '(^|[^[:alnum:]_./])commands/i-am-burntout\.md([^[:alnum:]_]|$)' "$file" >/dev/null; then
    fail "retired Claude command path in: $file"
  fi
done
pass 'retired interface checks'

if ! jq -e '
  if type != "object" then false
  elif .skill_name != "i-am-burntout" then false
  elif (.evals | type) != "array" then false
  else all(.evals[];
    if type != "object" then false
    else has("id")
      and (.prompt? | type == "string")
      and (.expected_output? | type == "string")
      and (.files? | type == "array")
      and all(.files[]; type == "string" and length > 0)
    end
  )
  end
' evals/evals.json >/dev/null; then
  fail 'evals/evals.json has invalid required fields'
fi
while IFS= read -r fixture; do
  [ -n "$fixture" ] || continue
  case "$fixture" in
    /*|..|../*|*/../*|*/..)
      fail "eval fixture path escapes evals/: $fixture"
      ;;
  esac
  if [ -L "evals/$fixture" ] || [ ! -f "evals/$fixture" ]; then
    fail "missing eval fixture: evals/$fixture"
  fi
  if ! git ls-files --error-unmatch -- "evals/$fixture" >/dev/null 2>&1; then
    fail "eval fixture is not tracked: evals/$fixture"
  fi
done < <(jq -r '.evals[].files[]' evals/evals.json)
pass 'evaluation schema and fixtures'

details_count=$(awk '$0 == "<details>" { count++ } END { print count + 0 }' INSTALL.md)
if [ "$details_count" -ne 15 ]; then
  fail "INSTALL.md must contain 15 <details> sections; found $details_count"
fi
pass 'INSTALL.md structure'
