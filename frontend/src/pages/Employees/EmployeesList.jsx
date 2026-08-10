// src/pages/Employees/EmployeesList.jsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import employeeService from "../../services/employeeService";

// ==========================================================
// Departments
// ==========================================================

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Sales",
  "Marketing",
  "Finance",
];

const STATUS_FILTERS = [
  "All",
  "Active",
  "Inactive",
];

// ==========================================================
// Helpers
// ==========================================================

const getInitials = (fullName = "") => {
  return fullName
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const statusStyles = {
  Active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Inactive:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// ==========================================================
// Convert Backend Employee -> UI Employee
// ==========================================================

const formatEmployee = (employee) => {
  return {
    id: employee.id,

    employee_id: employee.employee_id,

    name: `${employee.first_name || ""} ${
      employee.last_name || ""
    }`.trim(),

    email: employee.email || "",

    department: employee.department || "",

    role: employee.designation || "",

    designation: employee.designation || "",

    phone: employee.phone || "",

    salary: employee.salary || 0,

    status: employee.status || "Active",

    created_at: employee.created_at,

    updated_at: employee.updated_at,
  };
};

// ==========================================================
// Employees List
// ==========================================================

const EmployeesList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ========================================================
  // State
  // ========================================================

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState(
      location.state?.successMessage || ""
    );

  // ========================================================
  // Filters
  // ========================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // ========================================================
  // Load Employees From Backend
  // ========================================================

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data =
        await employeeService.getAllEmployees();

      const formattedEmployees =
        Array.isArray(data)
          ? data.map(formatEmployee)
          : [];

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error(
        "Failed to load employees:",
        error
      );

      const backendMessage =
        error?.response?.data?.detail;

      if (backendMessage) {
        setErrorMessage(
          String(backendMessage)
        );
      } else {
        setErrorMessage(
          "Unable to load employees. Please check that the backend server is running."
        );
      }

      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {
    loadEmployees();
  }, []);

  // ========================================================
  // Clear Success Message
  // ========================================================

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  // ========================================================
  // Filtering
  // ========================================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === "" ||
        employee.name
          ?.toLowerCase()
          .includes(search) ||
        employee.email
          ?.toLowerCase()
          .includes(search) ||
        employee.employee_id
          ?.toLowerCase()
          .includes(search) ||
        employee.role
          ?.toLowerCase()
          .includes(search);

      const matchesDepartment =
        departmentFilter ===
          "All Departments" ||
        employee.department ===
          departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchTerm,
    departmentFilter,
    statusFilter,
  ]);

  const isEmpty =
    filteredEmployees.length === 0;

  // ========================================================
  // View Employee
  // ========================================================

  const handleView = (employee) => {
    navigate(
      `/employees/${employee.id}`
    );
  };

  // ========================================================
  // Edit Employee
  // ========================================================

  const handleEdit = (employee) => {
    navigate(
      `/employees/${employee.id}/edit`
    );
  };

  // ========================================================
  // Delete Employee
  // ========================================================

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(employee.id);
      setErrorMessage("");

      await employeeService.deleteEmployee(
        employee.id
      );

      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (item) =>
            item.id !== employee.id
        )
      );

      setSuccessMessage(
        "Employee deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete employee:",
        error
      );

      const backendMessage =
        error?.response?.data?.detail;

      setErrorMessage(
        backendMessage
          ? String(backendMessage)
          : "Failed to delete employee."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================================
  // Add Employee
  // ========================================================

  const handleAddEmployee = () => {
    navigate("/employees/add");
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
            Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your organization's workforce,
            roles, and departments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEmployee}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-indigo-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-sm
            transition-colors
            hover:bg-indigo-700
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
          "
        >
          <FiPlus className="h-4 w-4" />

          Add Employee
        </button>

      </div>

      {/* ==================================================
          Success Message
      ================================================== */}

      {successMessage && (
        <div
          className="
            rounded-lg
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-sm
            text-emerald-700
            dark:border-emerald-900
            dark:bg-emerald-950/30
            dark:text-emerald-400
          "
        >
          {successMessage}
        </div>
      )}

      {/* ==================================================
          Error Message
      ================================================== */}

      {errorMessage && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{errorMessage}</span>
        </div>
      )}

      {/* ==================================================
          Filters
      ================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Search */}

          <div className="relative flex-1">

            <FiSearch
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search by name, email, employee ID..."
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                py-2.5
                pl-10
                pr-4
                text-sm
                text-gray-900
                placeholder-gray-400
                focus:border-indigo-500
                focus:bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500/20
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-100
              "
            />

          </div>

          {/* Department */}

          <div className="relative sm:w-56">

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
              className="
                w-full
                appearance-none
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                py-2.5
                pl-4
                pr-9
                text-sm
                text-gray-700
                focus:border-indigo-500
                focus:outline-none
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-300
              "
            >
              <option value="All Departments">
                All Departments
              </option>

              {DEPARTMENTS.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>

            <FiChevronDown
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

          {/* Status */}

          <div className="relative sm:w-44">

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                w-full
                appearance-none
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                py-2.5
                pl-4
                pr-9
                text-sm
                text-gray-700
                focus:border-indigo-500
                focus:outline-none
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-300
              "
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

            <FiChevronDown
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

        </div>
      </div>

      {/* ==================================================
          Employee Table
      ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        {/* Loading */}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">

            <FiLoader className="h-8 w-8 animate-spin text-indigo-600" />

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading employees...
            </p>

          </div>
        ) : isEmpty ? (

          /* Empty State */

          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gray-100
                dark:bg-gray-800
              "
            >
              <FiUsers className="h-6 w-6 text-gray-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No employees found
              </p>

              <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              {/* Table Head */}

              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Employee
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Employee ID
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Department
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Role
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Email
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* Table Body */}

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">

                {filteredEmployees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >

                      {/* Employee */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-indigo-600
                              text-xs
                              font-semibold
                              text-white
                            "
                          >
                            {getInitials(
                              employee.name
                            )}
                          </div>

                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.name}
                          </span>

                        </div>

                      </td>

                      {/* Employee ID */}

                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {employee.employee_id}
                      </td>

                      {/* Department */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {employee.department}
                      </td>

                      {/* Role */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {employee.role}
                      </td>

                      {/* Email */}

                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {employee.email}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-3.5">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[
                              employee.status
                            ] ||
                            statusStyles.Inactive
                          }`}
                        >
                          {employee.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center justify-end gap-1">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(employee)
                            }
                            className="
                              rounded-lg
                              p-2
                              text-gray-400
                              hover:bg-indigo-50
                              hover:text-indigo-600
                              dark:hover:bg-indigo-500/10
                              dark:hover:text-indigo-400
                            "
                            aria-label={`View ${employee.name}`}
                            title="View employee"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(employee)
                            }
                            className="
                              rounded-lg
                              p-2
                              text-gray-400
                              hover:bg-amber-50
                              hover:text-amber-600
                              dark:hover:bg-amber-500/10
                              dark:hover:text-amber-400
                            "
                            aria-label={`Edit ${employee.name}`}
                            title="Edit employee"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                employee
                              )
                            }
                            disabled={
                              deletingId ===
                              employee.id
                            }
                            className="
                              rounded-lg
                              p-2
                              text-gray-400
                              hover:bg-red-50
                              hover:text-red-600
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              dark:hover:bg-red-500/10
                              dark:hover:text-red-400
                            "
                            aria-label={`Delete ${employee.name}`}
                            title="Delete employee"
                          >
                            {deletingId ===
                            employee.id ? (
                              <FiLoader className="h-4 w-4 animate-spin" />
                            ) : (
                              <FiTrash2 className="h-4 w-4" />
                            )}
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

        {/* ==================================================
            Pagination
        ================================================== */}

        {!loading && !isEmpty && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-3
              border-t
              border-gray-200
              px-5
              py-4
              sm:flex-row
              dark:border-gray-800
            "
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">

              Showing{" "}

              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredEmployees.length}
              </span>

              {" "}of{" "}

              <span className="font-medium text-gray-700 dark:text-gray-300">
                {employees.length}
              </span>

              {" employees"}

            </p>

            <div className="flex items-center gap-1.5">

              <button
                type="button"
                disabled
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-gray-200
                  px-3
                  py-1.5
                  text-sm
                  text-gray-400
                  disabled:cursor-not-allowed
                  dark:border-gray-800
                  dark:text-gray-600
                "
              >
                <FiChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                className="
                  rounded-lg
                  bg-indigo-600
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                "
              >
                1
              </button>

              <button
                type="button"
                disabled
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-gray-200
                  px-3
                  py-1.5
                  text-sm
                  text-gray-400
                  disabled:cursor-not-allowed
                  dark:border-gray-800
                  dark:text-gray-600
                "
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

export default EmployeesList;