/**
 * =====================================================
 * Enterprise AI Assistant
 * File: src/services/authService.js
 * =====================================================
 */

import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../utils/constants";

const authService = {
  // =====================================================
  // Login
  // =====================================================
  /**
   * Authenticate user using OAuth2PasswordRequestForm.
   *
   * Backend expects:
   * Content-Type: application/x-www-form-urlencoded
   *
   * Fields:
   * - username (email)
   * - password
   */

  async login(email, password) {
    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.LOGIN,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // Current Logged-in User
  // =====================================================

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.AUTH.ME
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // Logout
  // =====================================================

  logout() {
    // Backend has no logout endpoint.
    // AuthContext will clear local storage.
    return Promise.resolve();
  },
};

export default authService;