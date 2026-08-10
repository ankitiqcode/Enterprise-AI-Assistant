/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/services/employeeService.js
 * ==========================================================
 */

import axiosInstance from "../api/axiosInstance";

// ==========================================================
// Get All Employees
// ==========================================================

const getAllEmployees = async () => {
  const response = await axiosInstance.get(
    "/employees"
  );

  return response.data;
};

// ==========================================================
// Get Employee By ID
// ==========================================================

const getEmployeeById = async (employeeId) => {
  const response = await axiosInstance.get(
    `/employees/${employeeId}`
  );

  return response.data;
};

// ==========================================================
// Create Employee
// ==========================================================

const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post(
    "/employees",
    employeeData
  );

  return response.data;
};

// ==========================================================
// Update Employee
// ==========================================================

const updateEmployee = async (
  employeeId,
  employeeData
) => {
  const response = await axiosInstance.put(
    `/employees/${employeeId}`,
    employeeData
  );

  return response.data;
};

// ==========================================================
// Delete Employee
// ==========================================================

const deleteEmployee = async (employeeId) => {
  const response = await axiosInstance.delete(
    `/employees/${employeeId}`
  );

  return response.data;
};

// ==========================================================
// Export
// ==========================================================

const employeeService = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeService;