// src/pages/Attendance/EditAttendance.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";

import AttendanceForm from "./AttendanceForm";
import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";

const EditAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  // ==========================================================
  // Load Attendance
  // ==========================================================

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await attendanceService.getById(id);

        setAttendance(data);

        // Load employee information
        if (data?.employee_id) {
          try {
            const employeeData =
              await employeeService.getEmployeeById(
                data.employee_id
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

  // ==========================================================
  // Update Attendance
  // ==========================================================

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");

      /*
       * Backend AttendanceUpdate expects:
       *
       * check_in
       * check_out
       * status
       *
       * Employee ID and date are NOT updated.
       */

      const updateData = {
        check_in:
          formData.checkIn || null,

        check_out:
          formData.checkOut || null,

        status:
          formData.status === "Half Day"
            ? "Half-Day"
            : formData.status,
      };

      console.log(
        "Updating attendance:",
        id,
        updateData
      );

      await attendanceService.update(
        id,
        updateData
      );

      // Success
      navigate("/attendance", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Failed to update attendance:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to update attendance. Please try again.";

      setError(
        Array.isArray(message)
          ? message
              .map((item) => item.msg)
              .join(", ")
          : String(message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // Cancel
  // ==========================================================

  const handleCancel = () => {
    navigate(-1);
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading attendance...
        </p>
      </div>
    );
  }

  // ==========================================================
  // Error
  // ==========================================================

  if (error && !attendance) {
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

  // ==========================================================
  // Attendance Not Found
  // ==========================================================

  if (!attendance) {
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

  // ==========================================================
  // Employee Name
  // ==========================================================

  const employeeName =
    employee?.name ||
    `${employee?.first_name || ""} ${
      employee?.last_name || ""
    }`.trim() ||
    `Employee #${attendance.employee_id}`;

  const employeeId =
    employee?.employee_id ||
    employee?.id ||
    attendance.employee_id;

  // ==========================================================
  // Form Values
  // ==========================================================

  const formDefaultValues = {
    employeeName: employeeName,

    employeeId: employeeId,

    department:
      employee?.department ||
      employee?.department_name ||
      "Engineering",

    date:
      attendance.attendance_date || "",

    checkIn:
      attendance.check_in
        ? String(attendance.check_in).slice(0, 5)
        : "",

    checkOut:
      attendance.check_out
        ? String(attendance.check_out).slice(0, 5)
        : "",

    status:
      attendance.status === "Half-Day"
        ? "Half Day"
        : attendance.status || "Present",
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start gap-4">

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Edit Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the attendance record.
          </p>
        </div>

      </div>

      {/* ==================================================
          API Error
      ================================================== */}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">

          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{error}</span>

        </div>
      )}

      {/* ==================================================
          Form
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">

        <AttendanceForm
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />

      </div>

    </div>
  );
};

export default EditAttendance;