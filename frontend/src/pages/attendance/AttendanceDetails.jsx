// src/pages/Attendance/AttendanceDetails.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit2,
  FiUser,
  FiClock,
  FiMail,
  FiAlertCircle,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";

import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";

// ==========================================================
// Helpers
// ==========================================================

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  // Backend may return "10:38:00"
  const [hours, minutes] = String(value)
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return value;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateWorkingHours = (
  checkIn,
  checkOut
) => {
  if (!checkIn || !checkOut) {
    return "—";
  }

  const [inHour, inMinute] = String(checkIn)
    .split(":")
    .map(Number);

  const [outHour, outMinute] = String(checkOut)
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

  const start =
    inHour * 60 + inMinute;

  const end =
    outHour * 60 + outMinute;

  const difference = end - start;

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
// Status Styles
// ==========================================================

const statusStyles = {
  Present:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Absent:
    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  Late:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

  "Half-Day":
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

  "Half Day":
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

  Leave:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

  WFH:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

// ==========================================================
// Info Row
// ==========================================================

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
      {label}
    </span>

    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {value || "—"}
    </span>
  </div>
);

// ==========================================================
// Page
// ==========================================================

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================================
  // Load Attendance
  // ========================================================

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        // Get attendance by database ID
        const attendance =
          await attendanceService.getById(id);

        setRecord(attendance);

        // Get employee details
        if (attendance?.employee_id) {
          try {
            const employeeData =
              await employeeService.getEmployeeById(
                attendance.employee_id
              );

            setEmployee(employeeData);
          } catch (employeeError) {
            console.error(
              "Failed to load employee:",
              employeeError
            );
          }
        }
      } catch (err) {
        console.error(
          "Failed to load attendance:",
          err
        );

        const message =
          err?.response?.data?.detail ||
          "Failed to load attendance record.";

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

    loadAttendance();
  }, [id]);

  // ========================================================
  // Loading
  // ========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading attendance details...
        </div>
      </div>
    );
  }

  // ========================================================
  // Error
  // ========================================================

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center dark:border-red-900 dark:bg-red-950/30">
          <FiAlertCircle className="mb-3 h-8 w-8 text-red-500" />

          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Unable to load attendance
          </h2>

          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ========================================================
  // Record Not Found
  // ========================================================

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FiAlertCircle className="h-7 w-7 text-gray-400" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">
          Attendance record not found
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The attendance record does not exist or may
          have been removed.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    );
  }

  // ========================================================
  // Employee Information
  // ========================================================

  const employeeName =
    employee?.name ||
    `${employee?.first_name || ""} ${
      employee?.last_name || ""
    }`.trim() ||
    `Employee #${record.employee_id}`;

  const employeeId =
    employee?.employee_id ||
    employee?.id ||
    record.employee_id;

  const department =
    employee?.department ||
    employee?.department_name ||
    "—";

  const role =
    employee?.role ||
    employee?.job_title ||
    "—";

  const email =
    employee?.email ||
    "—";

  // ========================================================
  // Attendance Information
  // ========================================================

  const workingHours = calculateWorkingHours(
    record.check_in,
    record.check_out
  );

  const status = record.status || "Present";

  const statusBadgeClass =
    statusStyles[status] ||
    statusStyles.Present;

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
              Attendance Details
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View employee attendance record.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/attendance/${record.id}/edit`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Attendance
        </button>

      </div>

      {/* ==================================================
          Summary Cards
      ================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Check In */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400">
            <FiLogIn className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-wide">
              Check In
            </span>
          </div>

          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatTime(record.check_in)}
          </p>
        </div>

        {/* Check Out */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400">
            <FiLogOut className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-wide">
              Check Out
            </span>
          </div>

          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatTime(record.check_out)}
          </p>
        </div>

        {/* Working Hours */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400">
            <FiClock className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-wide">
              Working Hours
            </span>
          </div>

          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {workingHours}
          </p>
        </div>

        {/* Status */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400">
            <FiAlertCircle className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-wide">
              Status
            </span>
          </div>

          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass}`}
          >
            {status}
          </span>
        </div>

      </div>

      {/* ==================================================
          Information Grid
      ================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Employee Information */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-4 flex items-center gap-2">
            <FiUser className="h-4 w-4 text-gray-400" />

            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Employee Information
            </h2>
          </div>

          <div className="space-y-3.5">

            <InfoRow
              label="Employee Name"
              value={employeeName}
            />

            <InfoRow
              label="Employee ID"
              value={employeeId}
            />

            <InfoRow
              label="Department"
              value={department}
            />

            <InfoRow
              label="Role"
              value={role}
            />

            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </span>

              <span className="flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                <FiMail className="h-3.5 w-3.5 text-gray-400" />
                {email}
              </span>
            </div>

          </div>

        </div>

        {/* Attendance Information */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-4 flex items-center gap-2">
            <FiClock className="h-4 w-4 text-gray-400" />

            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Attendance Information
            </h2>
          </div>

          <div className="space-y-3.5">

            <InfoRow
              label="Attendance ID"
              value={record.id}
            />

            <InfoRow
              label="Attendance Date"
              value={formatDate(
                record.attendance_date
              )}
            />

            <InfoRow
              label="Check In"
              value={formatTime(
                record.check_in
              )}
            />

            <InfoRow
              label="Check Out"
              value={formatTime(
                record.check_out
              )}
            />

            <InfoRow
              label="Working Hours"
              value={workingHours}
            />

            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Status
              </span>

              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass}`}
              >
                {status}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AttendanceDetails;