import assert from "node:assert/strict"
import test from "node:test"
import { spawn, execFileSync } from "node:child_process"
import { once } from "node:events"
import { mkdtemp, mkdir, copyFile, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"

test("V2 file command preserves plugin state despite config-command precedence", { timeout: 90000 }, async () => {
  const binary = process.env.OPENCODE_V2_BIN ?? "opencode"
  assert.match(execFileSync(binary, ["--version"], { encoding: "utf8" }), /opencode v2\./)
  const home = await mkdtemp(path.join(tmpdir(), "burnedout-v2-"))
  const config = path.join(home, ".config/opencode")
  const project = path.join(home, "project")
  let server
  try {
    for (const dir of [project, path.join(config, "plugins"), path.join(config, "commands")]) {
      await mkdir(dir, { recursive: true })
    }
    await copyFile(new URL("../.opencode/plugins/burnedout.ts", import.meta.url), path.join(config, "plugins/burnedout.ts"))
    await copyFile(new URL("../.opencode/commands/burnedout.md", import.meta.url), path.join(config, "commands/burnedout.md"))
    await writeFile(path.join(config, "opencode.json"), JSON.stringify({
      experimental: { policies: [{ action: "provider.use", resource: "*", effect: "deny" }] },
    }))
    server = spawn(binary, ["serve", "--hostname", "127.0.0.1", "--port", "0"], {
      cwd: project,
      env: {
        ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("OPENCODE_"))),
        HOME: home, XDG_CONFIG_HOME: path.join(home, ".config"),
        XDG_DATA_HOME: path.join(home, ".local/share"), XDG_CACHE_HOME: path.join(home, ".cache"),
        XDG_STATE_HOME: path.join(home, ".local/state"),
      },
      stdio: ["ignore", "pipe", "pipe"],
    })
    const { url, password } = await new Promise<{ url: string; password: string }>((resolve, reject) => {
      let output = ""
      const timer = setTimeout(() => reject(new Error("V2 server startup timed out")), 20000)
      const read = (chunk: Buffer) => {
        output += chunk.toString()
        const url = output.match(/server listening on (http:\/\/\S+)/)?.[1]
        const password = output.match(/server password (\S+)/)?.[1]
        if (url && password) { clearTimeout(timer); resolve({ url, password }) }
      }
      server.stdout.on("data", read)
      server.stderr.on("data", read)
      server.once("error", (error) => { clearTimeout(timer); reject(error) })
      server.once("exit", () => { clearTimeout(timer); reject(new Error("V2 server exited during startup")) })
    })
    const request = async (endpoint: string, body?: object) => {
      const response = await fetch(url + endpoint, {
        method: body === undefined ? "GET" : "POST",
        headers: { Authorization: "Basic " + Buffer.from(`opencode:${password}`).toString("base64"), "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      })
      assert.ok(response.ok, `API ${endpoint}: ${response.status}`)
      const text = await response.text()
      return text ? JSON.parse(text).data : undefined
    }
    const session = await request("/api/session", {
      location: { directory: project }, model: { providerID: "burnedout-unavailable", id: "no-model" },
    })
    for (const [argument, expected] of [
      ["", "full"], ["ultra", "ultra"], ["", "ultra"],
      ["nonsense", "invalid level (use full, ultra, or off)"], ["", "ultra"], ["off", "off"], ["", "off"],
    ]) {
      await request(`/api/session/${session.id}/command`, { name: "burnedout", text: argument })
      let messages = []
      for (let attempt = 0; attempt < 100; attempt++) {
        messages = await request(`/api/session/${session.id}/context`)
        if (messages.at(-1)?.type === "idle") break
        await delay(50)
      }
      const prompt = messages.filter((message) => message.type === "user").at(-1)
      assert.ok(prompt?.text.includes(`Confirm with burnedout: ${expected}.`), `Missing plugin confirmation for ${JSON.stringify(argument)}`)
      assert.equal(messages.at(-1)?.type, "idle", "Unavailable model must finish without a model request")
      assert.equal(messages.at(-1)?.outcome, "failed", "Unavailable model should fail locally")
    }
  } finally {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = once(server, "exit")
      server.kill("SIGTERM")
      await exited
    }
    await rm(home, { recursive: true, force: true })
  }
})
