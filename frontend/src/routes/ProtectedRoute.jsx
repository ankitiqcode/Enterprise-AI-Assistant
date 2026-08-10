/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/routes/ProtectedRoute.jsx
 * ==========================================================
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";

import Spinner from "../components/common/Spinner";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  // ==========================================
  // Wait until session restoration completes
  // ==========================================

  if (isLoading) {
    return (
      <Spinner
        fullScreen
        label="Restoring your session..."
      />
    );
  }

  // ==========================================
  // User not authenticated
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ==========================================
  // Authenticated
  // ==========================================

  return <Outlet />;
}

export default ProtectedRoute;