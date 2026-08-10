// src/pages/Leave/AddLeave.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import LeaveForm from '../../components/leave/LeaveForm';

/**
 * AddLeave.jsx — Feature 9
 *
 * No backend integration, no API calls, no axios, no service
 * imports, no modal — a plain page composing the already-confirmed
 * LeaveForm component. LeaveForm.jsx is not modified, and its
 * fields are not duplicated here — this page only supplies
 * defaultValues, onSubmit, onCancel, and loading, matching
 * LeaveForm's prop contract exactly.
 *
 * Same post-submit navigation pattern as AddAttendance.jsx: after
 * the simulated save completes, the user is redirected to the leave
 * list, per this spec's explicit requirement.
 */
const AddLeave = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exact default values from the spec — a brand-new leave request
  // with Leave Type pre-set to "Casual Leave" and Status pre-set to
  // "Pending".
  const mockDefaultValues = {
    employee: '',
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: '',
    status: 'Pending',
  };

  // No API integration yet — logs the validated form payload to the
  // console, simulates a network delay so the loading state is
  // visibly exercised, then navigates back to the leave list to
  // reflect a completed "submit" action. Once POST /leave is
  // confirmed, only this function body changes.
  const handleSubmit = (formData) => {
    setIsSubmitting(true);
    console.log('New leave request submitted:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/leave');
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
          aria-label="Go back to leave requests list"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Add Leave Request
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Submit a new leave request for an employee.
          </p>
        </div>
      </div>

      {/* ---------------- Form Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <LeaveForm
          defaultValues={mockDefaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddLeave;