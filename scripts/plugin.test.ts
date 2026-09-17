import assert from "node:assert/strict"
import test from "node:test"
import plugin from "../.opencode/plugins/burnedout.ts"

const RENDERED_COMMAND = "rendered command template"
const ULTRA =
  "burnedout level ultra: keep chat replies to 3 sentences or fewer unless a list is required, no headers, diffs only, never re-print unchanged lines."

const hooks = await plugin()
const commandBefore = hooks["command.execute.before"]
const systemTransform = hooks["experimental.chat.system.transform"]

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
    `${RENDERED_COMMAND}\n\nReply with exactly this and nothing else: burnedout: full`,
  )
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
    `${RENDERED_COMMAND}\n\nReply with exactly this and nothing else: burnedout: invalid level (use full, ultra, or off)`,
  )

  const queryParts = [textPart(sessionID)]
  await commandBefore(
    { command: "burnedout", arguments: "", sessionID },
    { parts: queryParts },
  )
  assert.equal(
    queryParts[0].text,
    `${RENDERED_COMMAND}\n\nReply with exactly this and nothing else: burnedout: ultra`,
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
    `${RENDERED_COMMAND}\n\nReply with exactly this and nothing else: burnedout: full`,
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
  assert.deepEqual(system, [ULTRA])
})

test("full and off do not inject a system instruction", async () => {
  const sessionID = "plugin-test-no-injection"
  const system: string[] = []

  await commandBefore(
    { command: "burnedout", arguments: "full", sessionID },
    { parts: [textPart(sessionID)] },
  )
  await systemTransform({ sessionID }, { system })
  assert.deepEqual(system, [])

  await commandBefore(
    { command: "burnedout", arguments: "off", sessionID },
    { parts: [textPart(sessionID)] },
  )
  await systemTransform({ sessionID }, { system })
  assert.deepEqual(system, [])
})
