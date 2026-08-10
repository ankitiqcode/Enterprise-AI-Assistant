/**
 * =====================================================
 * Enterprise AI Assistant
 * File: src/utils/constants.js
 * =====================================================
 */

// =====================================================
// API Configuration
// =====================================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

// =====================================================
// API Endpoints
// =====================================================

export const ENDPOINTS = {
  // ===================================================
  // Authentication
  // ===================================================

  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // ===================================================
  // Employees
  // ===================================================

  EMPLOYEES: {
    BASE: "/employees",

    BY_ID: (id) =>
      `/employees/${id}`,
  },

  // ===================================================
  // Departments
  // ===================================================

  DEPARTMENTS: {
    BASE: "/departments",

    BY_ID: (id) =>
      `/departments/${id}`,
  },

  // ===================================================
  // Attendance
  // ===================================================

  ATTENDANCE: {
    LIST: "/attendance",

    BY_ID: (id) =>
      `/attendance/${id}`,

    BY_EMPLOYEE: (employeeId) =>
      `/attendance/employee/${employeeId}`,
  },

  // ===================================================
  // Leave
  // ===================================================

  LEAVE: {
    BASE: "/leave",

    BY_ID: (id) =>
      `/leave/${id}`,

    BY_EMPLOYEE: (employeeId) =>
      `/leave/employee/${employeeId}`,

    APPROVE: (id) =>
      `/leave/${id}/approve`,

    REJECT: (id) =>
      `/leave/${id}/reject`,
  },

  // ===================================================
  // Documents
  // ===================================================

  DOCUMENTS: {
    BASE: "/documents",

    UPLOAD: "/documents/upload",

    REINDEX: (id) =>
      `/documents/${id}/reindex`,

    BY_ID: (id) =>
      `/documents/${id}`,
  },

  // ===================================================
  // AI Assistant
  // ===================================================

  AI: {
    CHAT: "/ai/chat",

    HISTORY: "/ai/conversations",
  },
};

// =====================================================
// Local Storage Keys
// =====================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",

  USER: "current_user",

  THEME: "theme",
};

// =====================================================
// User Roles
// =====================================================

export const ROLES = {
  ADMIN: "admin",

  HR: "hr",

  MANAGER: "manager",

  EMPLOYEE: "employee",
};

// =====================================================
// HTTP Status Codes
// =====================================================

export const HTTP_STATUS = {
  OK: 200,

  CREATED: 201,

  BAD_REQUEST: 400,

  UNAUTHORIZED: 401,

  FORBIDDEN: 403,

  NOT_FOUND: 404,

  SERVER_ERROR: 500,
};

// =====================================================
// Pagination
// =====================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,

  DEFAULT_LIMIT: 10,
};

// =====================================================
// Application
// =====================================================

export const APP_NAME =
  "Enterprise AI Assistant";