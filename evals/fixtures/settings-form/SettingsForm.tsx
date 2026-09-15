import { FormEvent, useState } from "react";

type Settings = {
  name: string;
  email: string;
};

function validate(settings: Settings) {
  const errors: Partial<Record<keyof Settings, string>> = {};

  if (!settings.name.trim()) errors.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(settings.email)) errors.email = "Email is invalid";

  return errors;
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({ name: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Settings, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(settings);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    console.log("Saved", settings);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input value={settings.name} onChange={(event) => setSettings({ ...settings, name: event.target.value })} />
      </label>
      {errors.name && <p>{errors.name}</p>}

      <label>
        Email
        <input type="email" value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} />
      </label>
      {errors.email && <p>{errors.email}</p>}

      <button type="submit">Save</button>
    </form>
  );
}
