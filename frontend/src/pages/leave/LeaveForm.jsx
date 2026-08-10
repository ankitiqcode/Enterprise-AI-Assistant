// src/pages/leave/LeaveForm.jsx

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiFileText,
  FiUser,
} from "react-icons/fi";

import employeeService from "../../services/employeeService";

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
];

const LeaveForm = ({
  defaultValues,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      leave_type: "Casual Leave",
      start_date: "",
      end_date: "",
      reason: "",
      ...defaultValues,
    },
  });

  // ======================================================
  // Load Employees
  // ======================================================

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeesLoading(true);
        setEmployeeError("");

        const data =
          await employeeService.getAllEmployees();

        setEmployees(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load employees:",
          error
        );

        setEmployeeError(
          error?.friendlyMessage ||
            error?.response?.data?.detail ||
            "Failed to load employees."
        );
      } finally {
        setEmployeesLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // ======================================================
  // Reset Form
  // ======================================================

  useEffect(() => {
    reset({
      employee_id: "",
      leave_type: "Casual Leave",
      start_date: "",
      end_date: "",
      reason: "",
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  // ======================================================
  // Submit
  // ======================================================

  const submitForm = (data) => {
    const payload = {
      employee_id: Number(data.employee_id),
      leave_type: data.leave_type,
      start_date: data.start_date,
      end_date: data.end_date,
      reason: data.reason.trim(),
    };

    onSubmit(payload);
  };

  // ======================================================
  // Employee Display
  // ======================================================

  const getEmployeeLabel = (employee) => {
    const employeeCode =
      employee.employee_id ||
      employee.employee_code ||
      `EMP${String(employee.id).padStart(3, "0")}`;

    const fullName = [
      employee.first_name,
      employee.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName
      ? `${employeeCode} - ${fullName}`
      : employeeCode;
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      {/* ==================================================
          Employee Information
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiUser className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Employee Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the employee for this leave request.
            </p>
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Employee */}

          <div className="md:col-span-2">

            <label
              htmlFor="employee_id"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Employee *
            </label>

            <select
              id="employee_id"
              {...register("employee_id", {
                required: "Employee is required",
              })}
              disabled={
                employeesLoading || loading
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">
                {employeesLoading
                  ? "Loading employees..."
                  : "Select employee"}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {getEmployeeLabel(employee)}
                </option>
              ))}
            </select>

            {errors.employee_id && (
              <p className="mt-1 text-xs text-red-500">
                {errors.employee_id.message}
              </p>
            )}

            {employeeError && (
              <p className="mt-1 text-xs text-red-500">
                {employeeError}
              </p>
            )}

            {!employeesLoading &&
              !employeeError &&
              employees.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No employees found. Create an employee first.
                </p>
              )}

          </div>

          {/* Leave Type */}

          <div>

            <label
              htmlFor="leave_type"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Leave Type *
            </label>

            <select
              id="leave_type"
              {...register("leave_type", {
                required: "Leave type is required",
              })}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              {LEAVE_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            {errors.leave_type && (
              <p className="mt-1 text-xs text-red-500">
                {errors.leave_type.message}
              </p>
            )}

          </div>

        </div>
      </div>

      {/* ==================================================
          Leave Details
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiCalendar className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Leave Details
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the leave dates and provide a reason.
            </p>
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Start Date */}

          <div>

            <label
              htmlFor="start_date"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Start Date *
            </label>

            <input
              id="start_date"
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

            {errors.start_date && (
              <p className="mt-1 text-xs text-red-500">
                {errors.start_date.message}
              </p>
            )}

          </div>

          {/* End Date */}

          <div>

            <label
              htmlFor="end_date"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              End Date *
            </label>

            <input
              id="end_date"
              type="date"
              {...register("end_date", {
                required: "End date is required",

                validate: (
                  value,
                  formValues
                ) =>
                  !formValues.start_date ||
                  value >= formValues.start_date ||
                  "End date cannot be earlier than start date.",
              })}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

            {errors.end_date && (
              <p className="mt-1 text-xs text-red-500">
                {errors.end_date.message}
              </p>
            )}

          </div>

          {/* Reason */}

          <div className="md:col-span-2">

            <label
              htmlFor="reason"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason *
            </label>

            <div className="relative">

              <FiFileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for leave..."
                {...register("reason", {
                  required: "Reason is required",
                  minLength: {
                    value: 5,
                    message:
                      "Reason must be at least 5 characters",
                  },
                  maxLength: {
                    value: 255,
                    message:
                      "Reason cannot exceed 255 characters",
                  },
                })}
                disabled={loading}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />

            </div>

            {errors.reason && (
              <p className="mt-1 text-xs text-red-500">
                {errors.reason.message}
              </p>
            )}

          </div>

        </div>
      </div>

      {/* ==================================================
          Buttons
      ================================================== */}

      <div className="flex items-center justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            employeesLoading ||
            employees.length === 0
          }
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Leave"}
        </button>

      </div>
    </form>
  );
};

LeaveForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
};

export default LeaveForm;