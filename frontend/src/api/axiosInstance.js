/**
 * =====================================================
 * Enterprise AI Assistant
 * File: src/api/axiosInstance.js
 * =====================================================
 */

import axios from "axios";

import {
  API_BASE_URL,
  HTTP_STATUS,
} from "../utils/constants";

import tokenStorage from "../utils/tokenStorage";

// =====================================================
// Axios Instance
// =====================================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,

  // Do NOT set Content-Type globally.
  // Axios will automatically set the correct
  // Content-Type for JSON and FormData requests.
  headers: {
    Accept: "application/json",
  },
});

// =====================================================
// Request Interceptor
// Automatically Attach JWT Token
// =====================================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// Response Interceptor
// Global Error Handling
// =====================================================

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // ===================================================
    // Network Error
    // ===================================================

    if (!error.response) {
      error.friendlyMessage =
        "Unable to connect to server. Please check your server connection.";

      return Promise.reject(error);
    }

    const status =
      error.response.status;

    // ===================================================
    // HTTP Status Handling
    // ===================================================

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        tokenStorage.clear();

        window.dispatchEvent(
          new CustomEvent("auth:logout")
        );

        error.friendlyMessage =
          "Your session has expired. Please login again.";
        break;

      case HTTP_STATUS.FORBIDDEN:
        window.dispatchEvent(
          new CustomEvent("app:forbidden", {
            detail:
              error.response.data,
          })
        );

        error.friendlyMessage =
          "You don't have permission to perform this action.";
        break;

      case HTTP_STATUS.NOT_FOUND:
        error.friendlyMessage =
          "Requested resource not found.";
        break;

      case HTTP_STATUS.SERVER_ERROR:
        error.friendlyMessage =
          "Internal server error. Please try again later.";
        break;

      default:
        break;
    }

    // ===================================================
    // FastAPI Validation Errors
    // ===================================================

    if (!error.friendlyMessage) {
      const detail =
        error.response?.data?.detail;

      if (Array.isArray(detail)) {
        error.friendlyMessage =
          detail
            .map(
              (item) =>
                item?.msg ||
                String(item)
            )
            .join(", ");
      } else if (detail) {
        error.friendlyMessage =
          String(detail);
      } else {
        error.friendlyMessage =
          "Something went wrong.";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;