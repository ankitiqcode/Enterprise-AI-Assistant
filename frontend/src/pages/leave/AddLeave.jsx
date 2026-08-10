// src/pages/leave/AddLeave.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LeaveForm from "./LeaveForm";
import leaveService from "../../services/leaveService";

const AddLeave = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // Submit Leave
  // ======================================================

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Send data to FastAPI
      await leaveService.create(data);

      setSuccess("Leave request submitted successfully.");

      // Give user a moment to see success message
      setTimeout(() => {
        navigate("/leave");
      }, 800);
    } catch (error) {
      console.error("Failed to submit leave:", error);

      const message =
        error?.response?.data?.detail ||
        error?.friendlyMessage ||
        "Failed to submit leave request.";

      if (Array.isArray(message)) {
        setError(
          message
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setError(String(message));
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Cancel
  // ======================================================

  const handleCancel = () => {
    navigate("/leave");
  };

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
          Apply Leave
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Submit a new employee leave request.
        </p>
      </div>

      {/* ==================================================
          Success Message
      ================================================== */}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          {success}
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
          Form
      ================================================== */}

      <LeaveForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};

export default AddLeave;