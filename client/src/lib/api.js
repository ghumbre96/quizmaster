export const API_BASE = import.meta.env.VITE_API || "http://localhost:4000";

export async function apiGet(path) {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(`GET ${path} failed`);
  return r.json();
}

export async function apiPost(path, body, token) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text() || `POST ${path} failed`);
  return r.json();
}
