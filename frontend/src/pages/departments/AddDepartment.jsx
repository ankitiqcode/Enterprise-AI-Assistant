// src/pages/Departments/AddDepartment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DepartmentForm from "./DepartmentForm";

/**
 * AddDepartment.jsx — Feature 7
 *
 * No backend integration, no API calls, no modal — a plain page that
 * composes the already-confirmed DepartmentForm component. Per your
 * instruction, DepartmentForm.jsx is not modified.
 *
 * Unlike AddEmployee.jsx (Feature 6), which had to flag a prop-
 * contract gap because EmployeeForm.jsx originally lacked onCancel,
 * DepartmentForm.jsx already requires onCancel as a mandatory prop —
 * so there's no ambiguity here: Save and Cancel are both rendered by
 * DepartmentForm itself via the onSubmit/onCancel props this page
 * supplies, with no duplicate page-level buttons.
 */
const AddDepartment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock default values for a brand-new department. No `id` field is
  // present — DepartmentForm reads `defaultValues.id` to decide
  // between "Save Department" / "Save changes" button text, so
  // omitting it here correctly puts the form in add mode.
  const mockDefaultValues = {
    name: '',
    code: '',
    manager: '',
    description: '',
    status: 'Active',
  };

  // No API integration yet — logs the validated form payload to the
  // console and simulates a network delay so the loading state is
  // visibly exercised. Once POST /departments is confirmed, only
  // this function body changes (swap the setTimeout for a real
  // service call), nothing else on this page needs to change.
  const handleSubmit = (formData) => {
    setIsSubmitting(true);
    console.log('New department submitted:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back to departments list"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Add Department
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a new department for your organization.
          </p>
        </div>
      </div>

      {/* ---------------- Form Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <DepartmentForm
          defaultValues={mockDefaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddDepartment;