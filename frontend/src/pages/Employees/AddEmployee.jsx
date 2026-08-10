/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/pages/Employees/AddEmployee.jsx
 * ==========================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import EmployeeForm from "../../components/employees/EmployeeForm";
import employeeService from "../../services/employeeService";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ========================================================
  // Default Form Values
  // ========================================================

  const defaultValues = {
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    status: "Active",
  };

  // ========================================================
  // Submit Employee
  // ========================================================

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // ----------------------------------------------
      // Send employee to backend
      // ----------------------------------------------

      const createdEmployee =
        await employeeService.createEmployee(
          formData
        );

      console.log(
        "Employee created successfully:",
        createdEmployee
      );

      // ----------------------------------------------
      // Go to employees list
      // ----------------------------------------------

      navigate("/employees", {
        replace: true,
        state: {
          successMessage:
            "Employee added successfully.",
        },
      });
    } catch (error) {
      console.error(
        "Failed to create employee:",
        error
      );

      // ----------------------------------------------
      // Backend Error Message
      // ----------------------------------------------

      const backendMessage =
        error?.response?.data?.detail;

      if (Array.isArray(backendMessage)) {
        setErrorMessage(
          backendMessage
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(", ")
        );
      } else if (backendMessage) {
        setErrorMessage(
          String(backendMessage)
        );
      } else if (error?.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Failed to save employee. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // Cancel
  // ========================================================

  const handleCancel = () => {
    navigate("/employees");
  };

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={handleCancel}
          aria-label="Back to employees"
          className="
            mt-1
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            border border-gray-200
            text-gray-500
            transition-colors
            hover:bg-gray-50
            hover:text-gray-900
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            dark:border-gray-800
            dark:text-gray-400
            dark:hover:bg-gray-800
            dark:hover:text-gray-100
          "
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1
            className="
              text-2xl
              font-semibold
              text-gray-900
              sm:text-3xl
              dark:text-gray-100
            "
          >
            Add Employee
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Fill in the details below to add a new
            employee to your organization.
          </p>
        </div>

      </div>

      {/* ==================================================
          Form Card
      ================================================== */}

      <div
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          sm:p-8
          dark:border-gray-800
          dark:bg-gray-900
        "
      >

        {/* ==================================================
            Error Message
        ================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="
              mb-6
              rounded-lg
              border border-red-200
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
            {errorMessage}
          </div>
        )}

        {/* ==================================================
            Employee Form
        ================================================== */}

        <EmployeeForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />

      </div>
    </div>
  );
};

export default AddEmployee;