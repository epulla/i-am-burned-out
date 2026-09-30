#!/usr/bin/env bash
# Prints AGENTS.md from the skill: AGENTS-specific intro, then the skill body
# without frontmatter, title, Levels, and Examples. Regenerate with:
#   bash scripts/agents-md.sh > AGENTS.md
set -euo pipefail

cat <<'EOF'
# i-am-burned-out

Instruction-only ruleset for agents that read `AGENTS.md` (Codex, Copilot CLI, Amp, Jules, Junie, Qoder, and others). Generated from `skills/i-am-burned-out/SKILL.md` by `scripts/agents-md.sh`; same rules, no commands or levels.

EOF

awk '
  /^---$/ { front++; next }
  front < 2 || /^# i-am-burned-out$/ { next }
  /^## Levels$/ { exit }
  /^$/ { blank = 1; next }
  { if (started && blank) print ""; print; started = 1; blank = 0 }
' skills/i-am-burned-out/SKILL.md
