// src/services/leaveService.js

import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../utils/constants";

const leaveService = {
  // =====================================================
  // Get All Leave Requests
  // GET /leave
  // =====================================================

  async getAll() {
    const response = await axiosInstance.get(
      ENDPOINTS.LEAVE.BASE
    );

    return response.data;
  },

  // =====================================================
  // Get Leave By ID
  // GET /leave/{id}
  // =====================================================

  async getById(id) {
    const response = await axiosInstance.get(
      `${ENDPOINTS.LEAVE.BASE}/${id}`
    );

    return response.data;
  },

  // =====================================================
  // Get Employee Leave History
  // GET /leave/employee/{employeeId}
  // =====================================================

  async getByEmployee(employeeId) {
    const response = await axiosInstance.get(
      `${ENDPOINTS.LEAVE.BASE}/employee/${employeeId}`
    );

    return response.data;
  },

  // =====================================================
  // Apply Leave
  // POST /leave
  // =====================================================

  async create(data) {
    const response = await axiosInstance.post(
      ENDPOINTS.LEAVE.BASE,
      data
    );

    return response.data;
  },

  // =====================================================
  // Update Leave
  // PUT /leave/{id}
  // =====================================================

  async update(id, data) {
    const response = await axiosInstance.put(
      `${ENDPOINTS.LEAVE.BASE}/${id}`,
      data
    );

    return response.data;
  },

  // =====================================================
  // Approve Leave
  // PATCH /leave/{id}/approve
  // =====================================================

  async approve(id) {
    const response = await axiosInstance.patch(
      ENDPOINTS.LEAVE.APPROVE(id)
    );

    return response.data;
  },

  // =====================================================
  // Reject Leave
  // PATCH /leave/{id}/reject
  // =====================================================

  async reject(id) {
    const response = await axiosInstance.patch(
      ENDPOINTS.LEAVE.REJECT(id)
    );

    return response.data;
  },

  // =====================================================
  // Delete Leave
  // DELETE /leave/{id}
  // =====================================================

  async remove(id) {
    const response = await axiosInstance.delete(
      `${ENDPOINTS.LEAVE.BASE}/${id}`
    );

    return response.data;
  },
};

export default leaveService;