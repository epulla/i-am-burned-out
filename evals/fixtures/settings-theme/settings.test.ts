import assert from "node:assert/strict";
import test from "node:test";
import { validateSettings } from "./settings.ts";
import { loadSettings, saveSettings, type Storage } from "./settingsStore.ts";

test("validates name and email format", () => {
  assert.deepEqual(validateSettings({ name: " Ada ", email: "ada@example.com" }), {});
  assert.equal(validateSettings({ name: "Ada", email: "bad" }).email, "Email is invalid");
});

test("loads and saves settings through storage", () => {
  const data = new Map<string, string>();
  const storage: Storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } };
  const settings = { name: "Ada", email: "ada@example.com" };
  assert.equal(loadSettings(storage), null);
  saveSettings(storage, settings);
  assert.deepEqual(loadSettings(storage), settings);
});
