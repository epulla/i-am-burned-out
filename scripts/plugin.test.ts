import assert from "node:assert/strict"
import test from "node:test"
import plugin from "../.opencode/plugins/burnedout.ts"

const RENDERED_COMMAND = "rendered command template"
const POINTER = "burnedout: follow i-am-burned-out skill instructions."
const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."

const hooks = await plugin()
const commandBefore = hooks["command.execute.before"]
const systemTransform = hooks["experimental.chat.system.transform"]
const duplicateCommandBefore = (await plugin())["command.execute.before"]
const duplicateSystemTransform = (await plugin())["experimental.chat.system.transform"]

function textPart(sessionID: string, text = RENDERED_COMMAND) {
  return {
    id: `${sessionID}-part`,
    sessionID,
    messageID: `${sessionID}-message`,
    type: "text" as const,
    text,
  }
}

test("default query preserves rendered command template exactly", async () => {
  const sessionID = "plugin-test-default-query"
  const parts = [textPart(sessionID)]

  await commandBefore(
    { command: "burnedout", arguments: "", sessionID },
    { parts },
  )

  assert.equal(
    parts[0].text,
    `${RENDERED_COMMAND}\n\nConfirm with burnedout: full. If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`,
  )
  assert.equal(parts[0].synthetic, true)

  const system: string[] = []
  await systemTransform({ sessionID }, { system })
  assert.deepEqual(system, [])
})

test("invalid level replies exactly and leaves session state unchanged", async () => {
  const sessionID = "plugin-test-invalid-level"
  const setParts = [textPart(sessionID)]
  await commandBefore(
    { command: "burnedout", arguments: "ultra", sessionID },
    { parts: setParts },
  )

  const invalidParts = [textPart(sessionID)]
  await commandBefore(
    { command: "burnedout", arguments: "nope", sessionID },
    { parts: invalidParts },
  )
  assert.equal(
    invalidParts[0].text,
    `${RENDERED_COMMAND}\n\nConfirm with burnedout: invalid level (use full, ultra, or off). If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`,
  )

  const queryParts = [textPart(sessionID)]
  await commandBefore(
    { command: "burnedout", arguments: "", sessionID },
    { parts: queryParts },
  )
  assert.equal(
    queryParts[0].text,
    `${RENDERED_COMMAND}\n\nConfirm with burnedout: ultra. If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`,
  )
})

test("session state stays isolated", async () => {
  const ultraSessionID = "plugin-test-isolation-ultra"
  const defaultSessionID = "plugin-test-isolation-default"
  await commandBefore(
    { command: "burnedout", arguments: "ultra", sessionID: ultraSessionID },
    { parts: [textPart(ultraSessionID)] },
  )

  const defaultParts = [textPart(defaultSessionID)]
  await commandBefore(
    { command: "burnedout", arguments: "", sessionID: defaultSessionID },
    { parts: defaultParts },
  )
  assert.equal(
    defaultParts[0].text,
    `${RENDERED_COMMAND}\n\nConfirm with burnedout: full. If no user request remains, output that line only; otherwise continue any remaining user request, including tool calls.`,
  )
})

test("ultra injects its system instruction", async () => {
  const sessionID = "plugin-test-ultra-injection"
  await commandBefore(
    { command: "burnedout", arguments: "ultra", sessionID },
    { parts: [textPart(sessionID)] },
  )

  const system: string[] = []
  await systemTransform({ sessionID }, { system })
  assert.deepEqual(system, [POINTER, ULTRA])
})

test("full injects pointer and off injects nothing", async () => {
  const fullSessionID = "plugin-test-full-injection"
  const fullSystem: string[] = []

  await commandBefore(
    { command: "burnedout", arguments: "full", sessionID: fullSessionID },
    { parts: [textPart(fullSessionID)] },
  )
  await systemTransform({ sessionID: fullSessionID }, { system: fullSystem })
  assert.deepEqual(fullSystem, [POINTER])

  const offSessionID = "plugin-test-off-injection"
  const offSystem: string[] = []
  await commandBefore(
    { command: "burnedout", arguments: "off", sessionID: offSessionID },
    { parts: [textPart(offSessionID)] },
  )
  await systemTransform({ sessionID: offSessionID }, { system: offSystem })
  assert.deepEqual(offSystem, [])
})

test("reply instruction is not appended twice", async () => {
  const sessionID = "plugin-test-idempotent-reply"
  const parts = [textPart(sessionID)]

  await commandBefore(
    { command: "burnedout", arguments: "full", sessionID },
    { parts },
  )
  const firstText = parts[0].text
  await duplicateCommandBefore(
    { command: "burnedout", arguments: "", sessionID },
    { parts },
  )

  assert.equal(parts[0].text, firstText)
})

test("system instructions are not injected twice", async () => {
  const sessionID = "plugin-test-idempotent-system"
  await commandBefore(
    { command: "burnedout", arguments: "ultra", sessionID },
    { parts: [textPart(sessionID)] },
  )

  const system: string[] = []
  await systemTransform({ sessionID }, { system })
  await duplicateSystemTransform({ sessionID }, { system })
  assert.deepEqual(system, [POINTER, ULTRA])
})

test("inactive sessions do not inject a pointer", async () => {
  const system: string[] = []
  await systemTransform({ sessionID: "plugin-test-inactive" }, { system })
  assert.deepEqual(system, [])
})
