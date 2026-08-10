/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/pages/auth/Login.jsx
 * ==========================================================
 */

import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Already Logged In
  // ==========================================

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // Login
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);

      setError(
        err.friendlyMessage ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-3xl font-bold">
          Enterprise AI Assistant
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Sign in to continue
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}