import type { Plugin } from "@opencode-ai/plugin"

const LEVELS = ["full", "ultra", "off"] as const
type Level = (typeof LEVELS)[number]

const DEFAULT: Level = "full"
const bySession = new Map<string, Level>()

const POINTER = "burnedout: follow i-am-burned-out skill instructions."
const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."
const SUBAGENT =
  "burnedout: reply with findings only, file:line references, no narration, no restatement of the brief."

const isLevel = (value: string): value is Level => (LEVELS as readonly string[]).includes(value)

function reply(parts: { type: string; text?: string; synthetic?: boolean }[], line: string) {
  const part = parts.find((p) => p.type === "text")
  if (!part || part.synthetic) return
  part.synthetic = true
  part.text = `${part.text ?? ""}\n\nConfirm with ${line}. If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`
}

function subagentPrompt(prompt: string, level: Level) {
  if (level === "off" || prompt.includes(POINTER)) return prompt
  return `${prompt}\n\n${POINTER}\n\n${SUBAGENT}${level === "ultra" ? `\n\n${ULTRA}` : ""}`
}

const server = (async () => ({
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

  // A subagent runs in a new session, so the task prompt is the only route the level has.
  "tool.execute.before": async (input, output) => {
    if (input.tool !== "task") return

    const level = bySession.get(input.sessionID)
    if (!level || level === "off") return

    const prompt = output.args?.prompt
    if (typeof prompt !== "string" || prompt.includes(POINTER)) return

    output.args.prompt = subagentPrompt(prompt, level)
  },

  // experimental.* is unstable; a throw here would break every request in the session.
  "experimental.chat.system.transform": async (input, output) => {
    try {
      const level = bySession.get(input.sessionID ?? "")
      if (!level || level === "off") return
      if (!output.system.includes(POINTER)) output.system.push(POINTER)
      if (level === "ultra" && !output.system.includes(ULTRA)) output.system.push(ULTRA)
    } catch {
      return
    }
  },
})) satisfies Plugin

type V2ContextEvent = { sessionID: string; system?: { type: string; text?: string }[]; prompt?: { text: string } }
type V2ToolEvent = { tool: string; sessionID: string; input: { prompt: string } }
type V2Context = { tool: { hook: (name: string, callback: (event: V2ToolEvent) => void) => Promise<void> }
  session: { hook: (name: string, callback: (event: V2ContextEvent) => void) => Promise<void> } }

export default {
  id: "burnedout",
  server,
  setup: async (ctx: V2Context) => {
    await ctx.tool.hook("execute.before", (event) => {
      if (event.tool !== "subagent") return
      const level = bySession.get(event.sessionID)
      if (level) event.input.prompt = subagentPrompt(event.input.prompt, level)
    })
    await ctx.session.hook("context", (event) => {
      const level = bySession.get(event.sessionID)
      if (!level || level === "off" || !event.system) return
      if (!event.system.some((part) => part.type === "text" && part.text === POINTER)) event.system.push({ type: "text", text: POINTER })
      if (level === "ultra" && !event.system.some((part) => part.type === "text" && part.text === ULTRA)) event.system.push({ type: "text", text: ULTRA })
    })
    await ctx.session.hook("prompt", (event) => {
      const argument = event.prompt?.text.match(/^1\. Unless `([^`]*)` is `off`/)?.[1]
      if (argument && isLevel(argument)) bySession.set(event.sessionID, argument)
    })
  },
}
