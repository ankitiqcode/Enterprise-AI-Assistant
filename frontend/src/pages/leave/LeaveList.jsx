// src/pages/leave/LeaveList.jsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

import leaveService from "../../services/leaveService";
import employeeService from "../../services/employeeService";

// ==========================================================
// Leave Types
// ==========================================================

const LEAVE_TYPES = [
  "All Types",
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
];

// ==========================================================
// Status Filters
// ==========================================================

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

// ==========================================================
// Status Styles
// ==========================================================

const statusStyles = {
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Rejected:
    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  Cancelled:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

// ==========================================================
// Helpers
// ==========================================================

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const difference =
    end.getTime() - start.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  ) + 1;
};

// ==========================================================
// Component
// ==========================================================

const LeaveList = () => {
  const navigate = useNavigate();

  // ========================================================
  // State
  // ========================================================

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [leaveTypeFilter, setLeaveTypeFilter] =
    useState("All Types");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // ========================================================
  // Load Data
  // ========================================================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [leaveData, employeeData] =
        await Promise.all([
          leaveService.getAll(),
          employeeService.getAllEmployees(),
        ]);

      setLeaves(
        Array.isArray(leaveData)
          ? leaveData
          : []
      );

      setEmployees(
        Array.isArray(employeeData)
          ? employeeData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load leave data:",
        error
      );

      const detail =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to load leave requests.";

      setError(
        Array.isArray(detail)
          ? detail
              .map((item) => item.msg)
              .join(", ")
          : String(detail)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========================================================
  // Employee Lookup
  // ========================================================

  const employeeMap = useMemo(() => {
    const map = {};

    employees.forEach((employee) => {
      map[employee.id] = employee;
    });

    return map;
  }, [employees]);

  // ========================================================
  // Prepare Leave Data For UI
  // ========================================================

  const formattedLeaves = useMemo(() => {
    return leaves.map((leave) => {
      const employee =
        employeeMap[leave.employee_id];

      const employeeName = employee
        ? `${employee.first_name || ""} ${
            employee.last_name || ""
          }`.trim()
        : `Employee #${leave.employee_id}`;

      return {
        ...leave,

        employeeName,

        employeeId:
          employee?.employee_id ||
          leave.employee_id,

        department:
          employee?.department_name ||
          employee?.department ||
          "-",

        leaveType: leave.leave_type,

        fromDate: formatDate(
          leave.start_date
        ),

        toDate: formatDate(
          leave.end_date
        ),

        days: calculateDays(
          leave.start_date,
          leave.end_date
        ),

        status: leave.status,
      };
    });
  }, [leaves, employeeMap]);

  // ========================================================
  // Filtering
  // ========================================================

  const filteredLeaves = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return formattedLeaves.filter((leave) => {
      const matchesSearch =
        search === "" ||
        leave.employeeName
          .toLowerCase()
          .includes(search) ||
        String(leave.employeeId)
          .toLowerCase()
          .includes(search) ||
        leave.leaveType
          .toLowerCase()
          .includes(search);

      const matchesType =
        leaveTypeFilter === "All Types" ||
        leave.leaveType ===
          leaveTypeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        leave.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    formattedLeaves,
    searchTerm,
    leaveTypeFilter,
    statusFilter,
  ]);

  // ========================================================
  // Add
  // ========================================================

  const handleAddLeave = () => {
    navigate("/leave/add");
  };

  // ========================================================
  // View
  // ========================================================

  const handleView = (leave) => {
    navigate(`/leave/${leave.id}`);
  };

  // ========================================================
  // Edit
  // ========================================================

  const handleEdit = (leave) => {
    navigate(`/leave/${leave.id}/edit`);
  };

  // ========================================================
  // Delete
  // ========================================================

  const handleDelete = async (leave) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${leave.employeeName}'s leave request?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await leaveService.remove(
        leave.id
      );

      setSuccessMessage(
        "Leave request deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Failed to delete leave:",
        error
      );

      const detail =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to delete leave request.";

      setError(
        Array.isArray(detail)
          ? detail
              .map((item) => item.msg)
              .join(", ")
          : String(detail)
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================================
  // Approve
  // ========================================================

  const handleApprove = async (leave) => {
    const confirmed = window.confirm(
      `Approve ${leave.employeeName}'s leave request?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await leaveService.approve(
        leave.id
      );

      setSuccessMessage(
        "Leave request approved successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Failed to approve leave:",
        error
      );

      const detail =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to approve leave request.";

      setError(
        Array.isArray(detail)
          ? detail
              .map((item) => item.msg)
              .join(", ")
          : String(detail)
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================================
  // Reject
  // ========================================================

  const handleReject = async (leave) => {
    const confirmed = window.confirm(
      `Reject ${leave.employeeName}'s leave request?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await leaveService.reject(
        leave.id
      );

      setSuccessMessage(
        "Leave request rejected successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Failed to reject leave:",
        error
      );

      const detail =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to reject leave request.";

      setError(
        Array.isArray(detail)
          ? detail
              .map((item) => item.msg)
              .join(", ")
          : String(detail)
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Leave Management
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage employee leave requests and approvals.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadData}
            disabled={loading || actionLoading}
            title="Refresh"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleAddLeave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <FiPlus className="h-4 w-4" />
            Apply Leave
          </button>

        </div>

      </div>

      {/* ==================================================
          Success Message
      ================================================== */}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
          {successMessage}
        </div>
      )}

      {/* ==================================================
          Error Message
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ==================================================
          Filters
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search employee..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

          </div>

          {/* Leave Type */}

          <div className="relative sm:w-56">

            <select
              value={leaveTypeFilter}
              onChange={(e) =>
                setLeaveTypeFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {LEAVE_TYPES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          </div>

          {/* Status */}

          <div className="relative sm:w-44">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {STATUS_FILTERS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          </div>

        </div>

      </div>

      {/* ==================================================
          Table
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {loading ? (

          <div className="flex flex-col items-center justify-center py-16">

            <FiRefreshCw className="h-7 w-7 animate-spin text-indigo-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading leave requests...
            </p>

          </div>

        ) : filteredLeaves.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-16">

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No leave requests found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left">

              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Employee
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Leave Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Dates
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Days
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                {filteredLeaves.map(
                  (leave) => (

                    <tr
                      key={leave.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >

                      {/* Employee */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                            {getInitials(
                              leave.employeeName
                            )}
                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {leave.employeeName}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID: {leave.employeeId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Department */}

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {leave.department}
                      </td>

                      {/* Leave Type */}

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {leave.leaveType}
                      </td>

                      {/* Dates */}

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {leave.fromDate}
                        </p>

                        <p className="text-xs text-gray-400">
                          to {leave.toDate}
                        </p>

                      </td>

                      {/* Days */}

                      <td className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {leave.days}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[
                              leave.status
                            ] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {leave.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                leave
                              )
                            }
                            title="View"
                            disabled={
                              actionLoading
                            }
                            className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                leave
                              )
                            }
                            title="Edit"
                            disabled={
                              actionLoading
                            }
                            className="rounded-lg p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>

                          {/* Approve */}

                          {leave.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(
                                  leave
                                )
                              }
                              title="Approve"
                              disabled={
                                actionLoading
                              }
                              className="rounded-lg p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          )}

                          {/* Reject */}

                          {leave.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleReject(
                                  leave
                                )
                              }
                              title="Reject"
                              disabled={
                                actionLoading
                              }
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                leave
                              )
                            }
                            title="Delete"
                            disabled={
                              actionLoading
                            }
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default LeaveList;