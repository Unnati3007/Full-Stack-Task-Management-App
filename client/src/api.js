const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  register: (name, email, password) =>
    request("/api/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),

  me: (token) => request("/api/users/me", { token }),

  getTasks: (token, filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return request(`/api/tasks${qs ? `?${qs}` : ""}`, { token });
  },

  createTask: (token, task) => request("/api/tasks", { method: "POST", body: task, token }),

  updateTask: (token, id, updates) =>
    request(`/api/tasks/${id}`, { method: "PUT", body: updates, token }),

  deleteTask: (token, id) => request(`/api/tasks/${id}`, { method: "DELETE", token }),
};

export const WS_URL = BASE_URL.replace(/^http/, "ws");
