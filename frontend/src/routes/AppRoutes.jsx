import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AIAssistant from "../pages/AIAssistant/AIAssistant";

import Leave from "../pages/Leave/Leave";
import AddLeave from "../pages/Leave/AddLeave";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* AI Assistant */}
      <Route
        path="/ai-assistant"
        element={<AIAssistant />}
      />

      {/* Leave Management */}
      <Route
        path="/leave"
        element={<Leave />}
      />

      <Route
        path="/leave/add"
        element={<AddLeave />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}