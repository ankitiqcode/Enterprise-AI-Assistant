// src/pages/Attendance/AttendanceList.jsx

import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";

import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";
import useAuth from "../../hooks/useAuth";

// ==========================================================
// Constants
// ==========================================================

const STATUS_FILTERS = [
  "All",
  "Present",
  "Absent",
  "Late",
  "Half-Day",
  "Leave",
  "WFH",
];

const statusStyles = {
  Present:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Absent:
    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  Late:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  "Half-Day":
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

  "Half Day":
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

  Leave:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",

  WFH:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
};

// ==========================================================
// Helpers
// ==========================================================

const getInitials = (fullName = "") =>
  fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const formatTime = (time) => {
  if (!time) return "—";

  const [hours, minutes] = String(time).split(":");

  if (
    hours === undefined ||
    minutes === undefined
  ) {
    return time;
  }

  const hour = Number(hours);

  if (Number.isNaN(hour)) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";

  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(
    2,
    "0"
  )}:${minutes} ${period}`;
};

const calculateWorkingHours = (
  checkIn,
  checkOut
) => {
  if (!checkIn || !checkOut) {
    return "—";
  }

  const [
    inHour,
    inMinute,
  ] = String(checkIn)
    .split(":")
    .map(Number);

  const [
    outHour,
    outMinute,
  ] = String(checkOut)
    .split(":")
    .map(Number);

  if (
    Number.isNaN(inHour) ||
    Number.isNaN(inMinute) ||
    Number.isNaN(outHour) ||
    Number.isNaN(outMinute)
  ) {
    return "—";
  }

  const startMinutes =
    inHour * 60 + inMinute;

  const endMinutes =
    outHour * 60 + outMinute;

  const difference =
    endMinutes - startMinutes;

  if (difference <= 0) {
    return "—";
  }

  const hours = Math.floor(
    difference / 60
  );

  const minutes = difference % 60;

  return `${hours}h ${String(minutes).padStart(
    2,
    "0"
  )}m`;
};

// ==========================================================
// Component
// ==========================================================

const AttendanceList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  // ========================================================
  // Role
  // ========================================================

  const isAdmin =
    String(user?.role || "")
      .trim()
      .toLowerCase() === "admin";

  // ========================================================
  // State
  // ========================================================

  const [attendance, setAttendance] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("All Departments");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState(
    location.state?.successMessage || ""
  );

  // ========================================================
  // Load Attendance + Employees
  // ========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        attendanceData,
        employeeData,
      ] = await Promise.all([
        attendanceService.getAll(),
        employeeService.getAllEmployees(),
      ]);

      setAttendance(
        Array.isArray(attendanceData)
          ? attendanceData
          : []
      );

      setEmployees(
        Array.isArray(employeeData)
          ? employeeData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load attendance:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.friendlyMessage ||
        "Failed to load attendance records.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : String(message)
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {
    loadData();
  }, []);

  // ========================================================
  // Clear Navigation Success Message
  // ========================================================

  useEffect(() => {
    if (location.state?.successMessage) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location.state]);

  // ========================================================
  // Department Options
  // ========================================================

  const departments = useMemo(() => {
    const values = employees
      .map(
        (employee) =>
          employee.department
      )
      .filter(Boolean);

    return [...new Set(values)];
  }, [employees]);

  // ========================================================
  // Convert Backend Data to UI Records
  // ========================================================

  const attendanceRecords = useMemo(() => {
    return attendance.map((record) => {
      const employee =
        employees.find(
          (item) =>
            item.id === record.employee_id
        );

      const employeeName = employee
        ? `${employee.first_name || ""} ${
            employee.last_name || ""
          }`.trim()
        : `Employee #${record.employee_id}`;

      return {
        id: record.id,

        employeeName,

        employeeId:
          employee?.employee_id ||
          `#${record.employee_id}`,

        department:
          employee?.department ||
          "—",

        date: formatDate(
          record.attendance_date
        ),

        checkIn: formatTime(
          record.check_in
        ),

        checkOut: formatTime(
          record.check_out
        ),

        workingHours:
          calculateWorkingHours(
            record.check_in,
            record.check_out
          ),

        status: record.status,
      };
    });
  }, [attendance, employees]);

  // ========================================================
  // Filters
  // ========================================================

  const filteredAttendance =
    useMemo(() => {
      return attendanceRecords.filter(
        (record) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            search === "" ||
            record.employeeName
              .toLowerCase()
              .includes(search) ||
            String(record.employeeId)
              .toLowerCase()
              .includes(search);

          const matchesDepartment =
            departmentFilter ===
              "All Departments" ||
            record.department ===
              departmentFilter;

          const matchesStatus =
            statusFilter === "All" ||
            record.status === statusFilter;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );
        }
      );
    }, [
      attendanceRecords,
      searchTerm,
      departmentFilter,
      statusFilter,
    ]);

  // ========================================================
  // Navigation
  // ========================================================

  const handleMarkAttendance = () => {
    navigate("/attendance/add");
  };

  const handleView = (record) => {
    navigate(
      `/attendance/${record.id}`
    );
  };

  const handleEdit = (record) => {
    navigate(
      `/attendance/${record.id}/edit`
    );
  };

  // ========================================================
  // Delete Attendance
  // ========================================================

  const handleDelete = async (record) => {
    if (!isAdmin) {
      setError(
        "Only Admin can delete attendance."
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete attendance for ${record.employeeName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await attendanceService.remove(
        record.id
      );

      setSuccessMessage(
        "Attendance deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Failed to delete attendance:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.friendlyMessage ||
        "Failed to delete attendance.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : String(message)
      );
    }
  };

  // ========================================================
  // Loading
  // ========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <FiClock className="h-5 w-5 animate-spin" />

          Loading attendance records...
        </div>
      </div>
    );
  }

  // ========================================================
  // JSX
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage employee attendance records.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleMarkAttendance
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <FiPlus className="h-4 w-4" />

          Mark Attendance
        </button>

      </div>

      {/* ==================================================
          Success Message
      ================================================== */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">

          <FiCheckCircle className="h-5 w-5 shrink-0" />

          <span>
            {successMessage}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
            className="ml-auto text-lg"
            aria-label="Close message"
          >
            ×
          </button>

        </div>
      )}

      {/* ==================================================
          Error
      ================================================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">

          <FiAlertCircle className="h-5 w-5 shrink-0" />

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="ml-auto text-lg"
            aria-label="Close error"
          >
            ×
          </button>

        </div>
      )}

      {/* ==================================================
          Search & Filters
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

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
              placeholder="Search by employee name or ID..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

          </div>

          {/* Department */}

          <div className="relative sm:w-56">

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option>
                All Departments
              </option>

              {departments.map(
                (dept) => (
                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept}
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
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
          Attendance Table
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {filteredAttendance.length ===
        0 ? (

          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiClock className="h-6 w-6 text-gray-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No attendance records found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your search or filters.
              </p>
            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[980px] text-left">

              <thead>

                <tr className="border-b border-gray-200 dark:border-gray-800">

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Employee
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Employee ID
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Department
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Check In
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Check Out
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Working Hours
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">

                {filteredAttendance.map(
                  (record) => (

                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >

                      {/* Employee */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">

                            {getInitials(
                              record.employeeName
                            )}

                          </div>

                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {record.employeeName}
                          </span>

                        </div>

                      </td>

                      {/* Employee ID */}

                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {record.employeeId}
                      </td>

                      {/* Department */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {record.department}
                      </td>

                      {/* Date */}

                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {record.date}
                      </td>

                      {/* Check In */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {record.checkIn}
                      </td>

                      {/* Check Out */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {record.checkOut}
                      </td>

                      {/* Working Hours */}

                      <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {record.workingHours}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-3.5">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[
                              record.status
                            ] ||
                            statusStyles.Absent
                          }`}
                        >
                          {record.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center justify-end gap-1">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                record
                              )
                            }
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                            title="View"
                            aria-label="View attendance"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                record
                              )
                            }
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10"
                            title="Edit"
                            aria-label="Edit attendance"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>

                          {/* Delete - Admin Only */}

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  record
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                              title="Delete"
                              aria-label="Delete attendance"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* ==================================================
            Pagination
        ================================================== */}

        {filteredAttendance.length >
          0 && (

          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredAttendance.length}
              </span>{" "}
              attendance records
            </p>

            <div className="flex items-center gap-1.5">

              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-700"
              >
                <FiChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                1
              </button>

              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-700"
              >
                Next
                <FiChevronRight className="h-4 w-4" />
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default AttendanceList;