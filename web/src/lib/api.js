// web/src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE;

function jsonHeaders(extra = {}) {
  return { "Content-Type": "application/json", ...extra };
}

async function readError(r) {
  try { return (await r.text()) || r.statusText; } catch { return r.statusText; }
}

export async function register(data) {
  const r = await fetch(`${BASE}/v1/auth/register`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await readError(r));
  return r.json();
}

export async function login(data) {
  const r = await fetch(`${BASE}/v1/auth/login`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await readError(r));
  const body = await r.json();
  localStorage.setItem("token", body.token);
  return body;
}

export function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function createPayment(data) {
  const r = await fetch(`${BASE}/v1/payments`, {
    method: "POST",
    headers: jsonHeaders(authHeaders()),
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await readError(r));
  return r.json();
}

export async function listPayments() {
  const r = await fetch(`${BASE}/v1/payments`, { headers: authHeaders() });
  if (!r.ok) throw new Error(await readError(r));
  return r.json();
}

export { login as loginUser };   

