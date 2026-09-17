// Makes the burnedout level real state instead of an instruction the model has to remember.
// The skill still carries the rules; this only owns the level and re-injects the ultra clause
// on every request, because that is the part that decays as the context window grows.
import type { Plugin } from "@opencode-ai/plugin"

const LEVELS = ["full", "ultra", "off"] as const
type Level = (typeof LEVELS)[number]

const DEFAULT: Level = "full"
const bySession = new Map<string, Level>()

const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."

const isLevel = (value: string): value is Level => (LEVELS as readonly string[]).includes(value)

// The command template already produced a text part; rewriting it beats fabricating a new
// one, which would need a valid id, sessionID, and messageID.
function reply(parts: { type: string; text?: string }[], line: string) {
  const part = parts.find((p) => p.type === "text")
  if (part) part.text = `Reply with exactly this and nothing else: ${line}`
}

export default (async () => ({
  "command.execute.before": async (input, output) => {
    if (input.command !== "burnedout") return

    const argument = input.arguments.trim()
    if (argument !== "" && !isLevel(argument)) {
      // Rejected here, so an invalid level never reaches the model or mutates state.
      reply(output.parts, "burnedout: invalid level (use full, ultra, or off)")
      return
    }
    if (argument !== "") bySession.set(input.sessionID, argument)
    reply(output.parts, `burnedout: ${bySession.get(input.sessionID) ?? DEFAULT}`)
  },

  // experimental.* is explicitly unstable: a throw here would break every request in the
  // session, so failure degrades to the plain skill behavior instead.
  "experimental.chat.system.transform": async (input, output) => {
    try {
      if (bySession.get(input.sessionID ?? "") === "ultra") output.system.push(ULTRA)
    } catch {
      return
    }
  },
})) satisfies Plugin
