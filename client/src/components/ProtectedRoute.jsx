import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-ink/50">
        Loading…
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
