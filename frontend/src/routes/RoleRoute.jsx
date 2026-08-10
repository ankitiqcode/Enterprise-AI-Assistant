/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/routes/RoleRoute.jsx
 * ==========================================================
 */

import PropTypes from "prop-types";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Spinner from "../components/common/Spinner";
import useAuth from "../hooks/useAuth";

function RoleRoute({ allowedRoles }) {
  const {
    isAuthenticated,
    isLoading,
    hasRole,
  } = useAuth();

  const location = useLocation();

  // ========================================================
  // Session Loading
  // ========================================================

  if (isLoading) {
    return <Spinner />;
  }

  // ========================================================
  // Not Logged In
  // ========================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ========================================================
  // Role Check
  // ========================================================

  if (!hasRole(allowedRoles)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ========================================================
  // Access Granted
  // ========================================================

  return <Outlet />;
}

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
};

export default RoleRoute;