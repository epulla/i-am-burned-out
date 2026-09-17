import type { Plugin } from "@opencode-ai/plugin"

const LEVELS = ["full", "ultra", "off"] as const
type Level = (typeof LEVELS)[number]

const DEFAULT: Level = "full"
const bySession = new Map<string, Level>()

const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."

const isLevel = (value: string): value is Level => (LEVELS as readonly string[]).includes(value)

// Rewrites the command's own part; a new one would need a valid id, sessionID, and messageID.
function reply(parts: { type: string; text?: string }[], line: string) {
  const part = parts.find((p) => p.type === "text")
  if (part) part.text = `Reply with exactly this and nothing else: ${line}`
}

export default (async () => ({
  "command.execute.before": async (input, output) => {
    if (input.command !== "burnedout") return

    const argument = input.arguments.trim()
    if (argument !== "" && !isLevel(argument)) {
      reply(output.parts, "burnedout: invalid level (use full, ultra, or off)")
      return
    }
    if (argument !== "") bySession.set(input.sessionID, argument)
    reply(output.parts, `burnedout: ${bySession.get(input.sessionID) ?? DEFAULT}`)
  },

  // experimental.* is unstable; a throw here would break every request in the session.
  "experimental.chat.system.transform": async (input, output) => {
    try {
      if (bySession.get(input.sessionID ?? "") === "ultra") output.system.push(ULTRA)
    } catch {
      return
    }
  },
})) satisfies Plugin
