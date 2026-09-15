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
if ! command -v ruby >/dev/null 2>&1; then
  fail 'Ruby with its standard YAML library is required to run checks'
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

pass 'version synchronization across eight expected files'

ruby -ryaml <<'RUBY'
path = "skills/i-am-burntout/SKILL.md"
frontmatter = File.read(path).match(/\A---\r?\n(.*?)^---\r?$/m)
abort "FAIL #{path} must have frontmatter delimiters" unless frontmatter
begin
  data = YAML.safe_load(frontmatter[1])
rescue Psych::Exception => error
  abort "FAIL invalid YAML in #{path}: #{error.message}"
end
unless data.is_a?(Hash) && data["name"] == "i-am-burntout"
  abort "FAIL #{path} frontmatter name must be i-am-burntout"
end
description = data["description"]
unless description.is_a?(String) && !description.strip.empty? && description.length <= 1024
  abort "FAIL #{path} description must be a nonempty string of at most 1024 characters"
end
RUBY
pass 'SKILL.md YAML frontmatter'

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
