import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
      <div className="text-lg font-semibold text-ink">Task Manager</div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-ink/60">{user.name}</span>}
        <button
          onClick={logout}
          className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
