export type Settings = { name: string; email: string };

export function validateSettings(settings: Settings) {
  const errors: Partial<Record<keyof Settings, string>> = {};
  if (!settings.name.trim()) errors.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(settings.email)) errors.email = "Email is invalid";
  return errors;
}
