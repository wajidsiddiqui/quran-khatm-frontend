// Shared fetch wrapper for every backend call — one place that knows the
// base URL, attaches the JWT, and turns non-2xx responses into thrown
// Errors with the backend's own message (matches its
// `{ success: false, message }` error shape).

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let result = null;
  try {
    result = await res.json();
  } catch {
    // non-JSON response (e.g. the API is down) — fall through, res.ok is false
  }

  if (!res.ok) {
    throw new Error(result?.message || `Request failed (${res.status})`);
  }

  return result;
}
