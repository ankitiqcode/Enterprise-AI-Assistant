// =====================================================
// Enterprise AI Assistant
// File: src/services/attendanceService.js
// =====================================================

import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../utils/constants";

const attendanceService = {
  // =====================================================
  // Get All Attendance
  // GET /attendance
  // =====================================================

  async getAll() {
    const response = await axiosInstance.get(
      ENDPOINTS.ATTENDANCE.LIST
    );

    return response.data;
  },

  // =====================================================
  // Get Attendance By ID
  // GET /attendance/{id}
  // =====================================================

  async getById(id) {
    const response = await axiosInstance.get(
      ENDPOINTS.ATTENDANCE.BY_ID(id)
    );

    return response.data;
  },

  // =====================================================
  // Get Attendance By Employee
  // GET /attendance/employee/{employee_id}
  // =====================================================

  async getByEmployee(employeeId) {
    const response = await axiosInstance.get(
      ENDPOINTS.ATTENDANCE.BY_EMPLOYEE(employeeId)
    );

    return response.data;
  },

  // =====================================================
  // Create / Mark Attendance
  // POST /attendance
  // =====================================================

  async create(data) {
    const response = await axiosInstance.post(
      ENDPOINTS.ATTENDANCE.LIST,
      data
    );

    return response.data;
  },

  // =====================================================
  // Update Attendance
  // PUT /attendance/{id}
  // =====================================================

  async update(id, data) {
    const response = await axiosInstance.put(
      ENDPOINTS.ATTENDANCE.BY_ID(id),
      data
    );

    return response.data;
  },

  // =====================================================
  // Delete Attendance
  // DELETE /attendance/{id}
  // =====================================================

  async remove(id) {
    const response = await axiosInstance.delete(
      ENDPOINTS.ATTENDANCE.BY_ID(id)
    );

    return response.data;
  },
};

export default attendanceService;