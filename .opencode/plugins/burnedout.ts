import type { Plugin } from "@opencode-ai/plugin"

const LEVELS = ["full", "ultra", "off"] as const
type Level = (typeof LEVELS)[number]

const DEFAULT: Level = "full"
const bySession = new Map<string, Level>()

const POINTER = "burnedout: follow i-am-burned-out skill instructions."
const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."

const isLevel = (value: string): value is Level => (LEVELS as readonly string[]).includes(value)

function reply(parts: { type: string; text?: string; synthetic?: boolean }[], line: string) {
  const part = parts.find((p) => p.type === "text")
  if (!part || part.synthetic) return
  part.synthetic = true
  part.text = `${part.text ?? ""}\n\nConfirm with ${line}. If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`
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
      const level = bySession.get(input.sessionID ?? "")
      if (!level) return
      if (level === "full" && !output.system.includes(POINTER)) output.system.push(POINTER)
      if (level === "ultra") {
        if (!output.system.includes(POINTER)) output.system.push(POINTER)
        if (!output.system.includes(ULTRA)) output.system.push(ULTRA)
      }
    } catch {
      return
    }
  },
})) satisfies Plugin
