// src/components/attendance/AttendanceForm.jsx

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  FiCalendar,
  FiClock,
  FiUser,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import employeeService from "../../services/employeeService";

const AttendanceForm = ({
  defaultValues = {},
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  // =====================================================
  // React Hook Form
  // =====================================================

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      status: "Present",
      ...defaultValues,
    },
  });

  // =====================================================
  // Load Employees
  // =====================================================

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeesLoading(true);
        setEmployeeError("");

        const data = await employeeService.getAllEmployees();

        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load employees:",
          error
        );

        const message =
          error?.response?.data?.detail ||
          "Unable to load employees. Please check the backend.";

        setEmployeeError(
          Array.isArray(message)
            ? message.map((item) => item.msg).join(", ")
            : String(message)
        );

        setEmployees([]);
      } finally {
        setEmployeesLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // =====================================================
  // Reset Form
  // =====================================================

  useEffect(() => {
    reset({
      employee_id: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      status: "Present",
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  // =====================================================
  // Watch Values
  // =====================================================

  const selectedEmployeeId = watch("employee_id");
  const checkIn = watch("check_in");

  const selectedEmployee = employees.find(
    (employee) =>
      String(employee.id) ===
      String(selectedEmployeeId)
  );

  // =====================================================
  // Submit
  // =====================================================

  const submitForm = (data) => {
    // -----------------------------------------------
    // Check employee
    // -----------------------------------------------

    if (!data.employee_id) {
      return;
    }

    // -----------------------------------------------
    // Check check-in / check-out
    // -----------------------------------------------

    if (
      data.check_in &&
      data.check_out &&
      data.check_out <= data.check_in
    ) {
      return;
    }

    // -----------------------------------------------
    // Prepare backend payload
    // -----------------------------------------------

    const payload = {
      employee_id: Number(data.employee_id),

      attendance_date:
        data.attendance_date,

      check_in:
        data.check_in || null,

      check_out:
        data.check_out || null,

      status: data.status,
    };

    console.log(
      "Attendance payload:",
      payload
    );

    onSubmit(payload);
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      {/* =================================================
          Employee Information
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-2">

          <FiUser className="h-5 w-5 text-indigo-600" />

          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Employee Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the employee for this attendance record.
            </p>
          </div>

        </div>

        {/* Employee API Error */}

        {employeeError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">

            <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <span>{employeeError}</span>

          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">

          {/* Employee */}

          <div>

            <label
              htmlFor="employee-id"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Employee *
            </label>

            <div className="relative">

              {employeesLoading && (
                <FiLoader className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-600" />
              )}

              <select
                id="employee-id"
                {...register("employee_id", {
                  required:
                    "Employee is required",
                })}
                disabled={
                  employeesLoading ||
                  loading
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">
                  {employeesLoading
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.first_name}{" "}
                      {employee.last_name}{" "}
                      ({employee.employee_id})
                    </option>
                  )
                )}
              </select>

            </div>

            {errors.employee_id && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.employee_id
                    .message
                }
              </p>
            )}

          </div>

          {/* Department */}

          <div>

            <label
              htmlFor="employee-department"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Department
            </label>

            <input
              id="employee-department"
              type="text"
              value={
                selectedEmployee?.department ||
                ""
              }
              readOnly
              placeholder="Department"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            />

          </div>

        </div>
      </div>

      {/* =================================================
          Attendance Details
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-2">

          <FiClock className="h-5 w-5 text-indigo-600" />

          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Attendance Details
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter date, check-in, check-out and status.
            </p>
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Date */}

          <div>

            <label
              htmlFor="attendance-date"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date *
            </label>

            <div className="relative">

              <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="attendance-date"
                type="date"
                {...register(
                  "attendance_date",
                  {
                    required:
                      "Date is required",
                  }
                )}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />

            </div>

            {errors.attendance_date && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.attendance_date
                    .message
                }
              </p>
            )}

          </div>

          {/* Status */}

          <div>

            <label
              htmlFor="attendance-status"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status *
            </label>

            <select
              id="attendance-status"
              {...register("status", {
                required:
                  "Status is required",
              })}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Leave">
                Leave
              </option>

              <option value="Half-Day">
                Half-Day
              </option>

              <option value="WFH">
                WFH
              </option>
            </select>

            {errors.status && (
              <p className="mt-1 text-xs text-red-500">
                {errors.status.message}
              </p>
            )}

          </div>

          {/* Check In */}

          <div>

            <label
              htmlFor="check-in"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Check In
            </label>

            <input
              id="check-in"
              type="time"
              {...register("check_in")}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

          </div>

          {/* Check Out */}

          <div>

            <label
              htmlFor="check-out"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Check Out
            </label>

            <input
              id="check-out"
              type="time"
              {...register("check_out", {
                validate: (value) => {
                  if (
                    value &&
                    checkIn &&
                    value <= checkIn
                  ) {
                    return "Check-out must be later than check-in";
                  }

                  return true;
                },
              })}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

            {errors.check_out && (
              <p className="mt-1 text-xs text-red-500">
                {
                  errors.check_out
                    .message
                }
              </p>
            )}

          </div>

        </div>
      </div>

      {/* =================================================
          Buttons
      ================================================= */}

      <div className="flex items-center justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            employeesLoading
          }
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <FiLoader className="h-4 w-4 animate-spin" />
          )}

          {loading
            ? "Saving..."
            : "Save Attendance"}
        </button>

      </div>
    </form>
  );
};

// =====================================================
// PropTypes
// =====================================================

AttendanceForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
};

export default AttendanceForm;