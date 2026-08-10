/**
 * =====================================================
 * Enterprise AI Assistant
 * File: src/utils/tokenStorage.js
 * =====================================================
 */

import { STORAGE_KEYS } from "./constants";

const tokenStorage = {
  // ==========================================
  // Access Token
  // ==========================================

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setToken(token) {
    if (!token) return;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // ==========================================
  // Authentication
  // ==========================================

  hasToken() {
    return !!this.getToken();
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // ==========================================
  // User Information
  // ==========================================

  saveUser(user) {
    if (!user) return;

    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(user)
    );
  },

  getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // ==========================================
  // Logout
  // ==========================================

  clear() {
    this.removeToken();
    this.removeUser();
  },
};

export default tokenStorage;