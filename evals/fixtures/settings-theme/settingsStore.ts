import type { Settings } from "./settings.ts";

export interface Storage { getItem(key: string): string | null; setItem(key: string, value: string): void }
const KEY = "settings";

export function loadSettings(storage: Storage): Settings | null {
  const value = storage.getItem(KEY);
  if (!value) return null;
  try { return JSON.parse(value) as Settings; } catch { return null; }
}

export function saveSettings(storage: Storage, settings: Settings): void {
  storage.setItem(KEY, JSON.stringify(settings));
}
