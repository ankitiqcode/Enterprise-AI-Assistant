/**
 * =====================================================
 * Enterprise AI Assistant
 * File: src/context/AuthContext.jsx
 * =====================================================
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import authService from "../services/authService";
import tokenStorage from "../utils/tokenStorage";

// =====================================================
// Auth Context
// =====================================================

export const AuthContext = createContext(null);

// =====================================================
// Auth Provider
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ===================================================
  // Restore Session
  // ===================================================

  const restoreSession = useCallback(async () => {
    // No token means no authenticated session
    if (!tokenStorage.hasToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser =
        await authService.getCurrentUser();

      setUser(currentUser);

      tokenStorage.saveUser(currentUser);
    } catch (error) {
      console.error(
        "Session Restore Failed:",
        error
      );

      tokenStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===================================================
  // Restore Session on App Load
  // ===================================================

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ===================================================
  // Listen for Global Logout
  // ===================================================

  useEffect(() => {
    const handleLogout = () => {
      tokenStorage.clear();
      setUser(null);
    };

    window.addEventListener(
      "auth:logout",
      handleLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleLogout
      );
    };
  }, []);

  // ===================================================
  // Login
  // ===================================================

  const login = useCallback(
    async (email, password) => {
      const response =
        await authService.login(
          email,
          password
        );

      const accessToken =
        response?.access_token;

      if (!accessToken) {
        throw new Error(
          "Login successful but access token was not received."
        );
      }

      // Save JWT token
      tokenStorage.setToken(accessToken);

      // Get authenticated user
      const currentUser =
        await authService.getCurrentUser();

      // Save user
      tokenStorage.saveUser(currentUser);

      // Update React state
      setUser(currentUser);

      return currentUser;
    },
    []
  );

  // ===================================================
  // Logout
  // ===================================================

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // ===================================================
  // Role Check
  // ===================================================

  const hasRole = useCallback(
    (roles = []) => {
      // User not logged in
      if (!user) {
        return false;
      }

      // No role restriction
      if (!Array.isArray(roles) || roles.length === 0) {
        return true;
      }

      // Normalize current user's role
      const userRole = String(
        user.role || ""
      )
        .trim()
        .toLowerCase();

      // Normalize allowed roles
      const allowedRoles = roles.map((role) =>
        String(role)
          .trim()
          .toLowerCase()
      );

      return allowedRoles.includes(userRole);
    },
    [user]
  );

  // ===================================================
  // Context Value
  // ===================================================

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),

      login,
      logout,
      hasRole,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      hasRole,
    ]
  );

  // ===================================================
  // Provider
  // ===================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// PropTypes
// =====================================================

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// =====================================================
// Export
// =====================================================

export default AuthContext;