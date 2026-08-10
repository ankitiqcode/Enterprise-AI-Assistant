// src/pages/Attendance/AddAttendance.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import AttendanceForm from "../attendance/AttendanceForm";
import attendanceService from "../../services/attendanceService";

const AddAttendance = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const defaultValues = {
    employee_id: "",
    attendance_date: "",
    check_in: "",
    check_out: "",
    status: "Present",
  };

  // =====================================================
  // Create Attendance
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");

      console.log(
        "Submitting attendance:",
        formData
      );

      await attendanceService.create(formData);

      console.log(
        "Attendance created successfully"
      );

      navigate("/attendance", {
        replace: true,
        state: {
          successMessage:
            "Attendance marked successfully.",
        },
      });
    } catch (error) {
      console.error(
        "Failed to create attendance:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to create attendance. Please try again.";

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

  // =====================================================
  // Cancel
  // =====================================================

  const handleCancel = () => {
    navigate("/attendance");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          Header
      ================================================= */}

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
            Add Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create an attendance record for an employee.
          </p>
        </div>

      </div>

      {/* =================================================
          API Error
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          Form
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">

        <AttendanceForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />

      </div>

    </div>
  );
};

export default AddAttendance;