#!/usr/bin/env bash
# Paid, manual Claude Code evals. Usage: RUNS=5 BASE=origin/main bash scripts/run-evals.sh 1 9
set -euo pipefail
repo=$(git rev-parse --show-toplevel)
python3 - "$repo" "$@" <<'PY'
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

repo = Path(sys.argv[1])
ids = [int(value) for value in sys.argv[2:]]
runs = int(os.environ.get("RUNS", "5"))
base = os.environ.get("BASE", "origin/main")
evals = json.loads((repo / "evals/evals.json").read_text())["evals"]
selected = [item for item in evals if item["id"] in ids]
if not ids or runs < 1 or set(ids) != {item["id"] for item in selected}:
    sys.exit("Usage: RUNS=5 BASE=origin/main bash scripts/run-evals.sh <valid eval ids>...")

def git(*args, cwd=repo):
    return subprocess.check_output(["git", *args], cwd=cwd, text=True)

# Allow intended dirty changes; detect new or changed tracked/untracked files after runs.
def workspace():
    import hashlib
    paths = git("ls-files", "-z", "--cached", "--others", "--exclude-standard").split("\0")
    return {name: hashlib.sha256((repo / name).read_bytes()).hexdigest()
            if (repo / name).is_file() else None for name in paths if name}

before = workspace()
root = Path(tempfile.mkdtemp(prefix="burnedout-evals-"))
print(f"Results: {root}", flush=True)
skills = {"candidate": (repo / "skills/i-am-burned-out/SKILL.md").read_text(),
          "base": git("show", f"{base}:skills/i-am-burned-out/SKILL.md")}
for variant, text in skills.items():
    (root / f"{variant}.md").write_text(text)

def run(job):
    item, variant, number = job
    name = f'{variant}-{item["id"]}-{number}'
    cwd = root / name
    cwd.mkdir()
    for filename in item["files"]:
        target = cwd / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes((repo / "evals" / filename).read_bytes())
    if item["id"] in (8, 9):
        (cwd / "package.json").write_text(json.dumps({"name": "demo", "version": "2.4.1",
            "type": "module", "scripts": {"test": "vitest"},
            "devDependencies": {"vitest": "3.2.0"}}))
    git("init", "-q", cwd=cwd)
    git("add", "-A", cwd=cwd)
    git("-c", "user.name=Eval", "-c", "user.email=eval@example.invalid",
        "commit", "--allow-empty", "-qm", "baseline", cwd=cwd)
    assert Path(git("rev-parse", "--show-toplevel", cwd=cwd).strip()).resolve() == cwd.resolve()
    command = ["claude", "-p", item["prompt"], "--disable-slash-commands", "--strict-mcp-config",
        "--append-system-prompt-file", str(root / f"{variant}.md"), "--permission-mode", "acceptEdits",
        "--max-turns", "30", "--output-format", "stream-json", "--verbose", "--allowedTools",
        "Read", "Edit", "Write", "Glob", "Grep", "Task", "Agent", "TaskCreate", "TaskUpdate",
        "TaskList", "TaskGet", "TodoWrite", "Bash(npx vitest:*)", "Bash(jq:*)", "Bash(grep:*)",
        "Bash(node:*)", "Bash(cat:*)", "Bash(ls:*)", "Bash(wc:*)", "Bash(head:*)",
        "Bash(git:*)", "Bash(rg:*)"]
    with (root / f"{name}.jsonl").open("w") as output, (root / f"{name}.err").open("w") as error:
        try:
            process = subprocess.run(command, cwd=cwd, stdin=subprocess.DEVNULL,
                                     stdout=output, stderr=error, timeout=600)
        except subprocess.TimeoutExpired:
            return {"run": name, "error": "timeout"}
    events = [json.loads(line) for line in (root / f"{name}.jsonl").read_text().splitlines() if line]
    init = next((e for e in events if e.get("type") == "system" and e.get("subtype") == "init"), {})
    result = next((e for e in reversed(events) if e.get("type") == "result"), {})
    if not init.get("cwd") or Path(init["cwd"]).resolve() != cwd.resolve():
        raise RuntimeError(f"Wrong Claude cwd: {name}")
    tools = [c for e in events if e.get("type") == "assistant"
             for c in e.get("message", {}).get("content", []) if c.get("type") == "tool_use"]
    git("add", "-A", cwd=cwd)
    diff = git("diff", "--cached", cwd=cwd)
    (root / f"{name}.diff").write_text(diff)
    stats = [line.split("\t") for line in git("diff", "--cached", "--numstat", cwd=cwd).splitlines()]
    return {"run": name, "error": bool(process.returncode or result.get("is_error") or not result),
        "words": len(result.get("result", "").split()), "tools": len(tools),
        "todo": any(t["name"] in ("TaskCreate", "TodoWrite") for t in tools),
        "added": sum(int(s[0]) for s in stats if s[0].isdigit()),
        "removed": sum(int(s[1]) for s in stats if s[1].isdigit()),
        "cost": result.get("total_cost_usd", 0), "model": init.get("model"),
        "expected": item["expected_output"]}

jobs = [(item, variant, number) for item in selected for variant in skills for number in range(1, runs + 1)]
try:
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        rows = list(pool.map(run, jobs))
finally:
    if workspace() != before:
        raise RuntimeError("Source workspace changed during evals; inspect before continuing")
(root / "summary.json").write_text(json.dumps(rows, indent=2))
print("run                      words  +lines -lines tools todo error")
for row in rows:
    print(f'{row["run"]:24} {row.get("words", 0):5} {row.get("added", 0):7} '
          f'{row.get("removed", 0):6} {row.get("tools", 0):5} {str(row.get("todo", False)):4} {row["error"]}')
print(f'Total cost: ${sum(row.get("cost", 0) for row in rows):.2f}; grade against expected_output manually.')
if any(row["error"] for row in rows):
    sys.exit(1)
PY
