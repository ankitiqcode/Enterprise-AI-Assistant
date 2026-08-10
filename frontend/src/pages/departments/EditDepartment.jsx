// src/pages/Departments/EditDepartment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DepartmentForm from "./DepartmentForm";

/**
 * EditDepartment.jsx — Feature 7 (final file)
 *
 * No backend integration, no API calls, no modal — composes the
 * already-confirmed DepartmentForm component, same pattern as
 * AddDepartment.jsx, but seeds it with a populated mock record
 * (including `id`) so DepartmentForm renders in edit mode: its
 * internal `isEditMode = Boolean(defaultValues.id)` check flips to
 * true, and the submit button reads "Save changes" instead of
 * "Save Department." DepartmentForm.jsx is not modified.
 *
 * This page assumes it will eventually receive a department id via
 * useParams() once routing to /departments/:id/edit is wired up —
 * for now it renders against a single hardcoded mock record, exactly
 * as specified, so the edit-mode layout can be reviewed independent
 * of that routing decision.
 */
const EditDepartment = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock department being edited — includes `id`, which is what
  // distinguishes this page from AddDepartment.jsx and puts
  // DepartmentForm into edit mode.
  const mockDepartment = {
    id: 'DEPT-001',
    name: 'Engineering',
    code: 'ENG001',
    manager: 'John Smith',
    description: 'Handles software development and technical operations.',
    status: 'Active',
  };

  // No API integration yet — logs the validated, updated form
  // payload to the console and simulates a network delay so the
  // loading state is visibly exercised. Once PUT/PATCH
  // /departments/{id} is confirmed, only this function body changes.
  const handleSubmit = (formData) => {
    setIsSubmitting(true);
    console.log('Updated department submitted:', { id: mockDepartment.id, ...formData });

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
          aria-label="Go back to department details"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Edit Department
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update department information.
          </p>
        </div>
      </div>

      {/* ---------------- Form Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <DepartmentForm
          defaultValues={mockDepartment}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditDepartment;