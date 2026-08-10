// src/pages/Leave/EditLeave.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import LeaveForm from '../../components/leave/LeaveForm';

/**
 * EditLeave.jsx — Feature 9 (final file)
 *
 * No backend integration, no API calls, no axios, no service
 * imports, no modal — composes the already-confirmed LeaveForm
 * component. LeaveForm.jsx is not modified, and its fields are not
 * duplicated here.
 *
 * Mock records use ISO date strings ("YYYY-MM-DD"), matching the
 * native value format required by LeaveForm's <input type="date">
 * fields (fromDate/toDate) — same reasoning already established in
 * EditAttendance.jsx for why this file's mock data format differs
 * from LeaveDetails.jsx's, which only renders dates as display text
 * and never feeds them into a form input.
 */

// ---- Mock data -------------------------------------------------------

const MOCK_LEAVE_REQUESTS = [
  {
    id: 'LEAVE-001',
    employee: 'John Doe',
    leaveType: 'Casual Leave',
    fromDate: '2026-08-10',
    toDate: '2026-08-11',
    reason: 'Personal work',
    status: 'Pending',
  },
  {
    id: 'LEAVE-002',
    employee: 'Priya Sharma',
    leaveType: 'Sick Leave',
    fromDate: '2026-08-05',
    toDate: '2026-08-06',
    reason: 'Fever and recovery',
    status: 'Approved',
  },
  {
    id: 'LEAVE-003',
    employee: 'Rahul Mehta',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-01',
    toDate: '2026-09-05',
    reason: 'Family vacation',
    status: 'Pending',
  },
  {
    id: 'LEAVE-004',
    employee: 'Anita Verma',
    leaveType: 'Emergency Leave',
    fromDate: '2026-08-03',
    toDate: '2026-08-03',
    reason: 'Family emergency',
    status: 'Approved',
  },
  {
    id: 'LEAVE-005',
    employee: 'Karan Malhotra',
    leaveType: 'Unpaid Leave',
    fromDate: '2026-08-18',
    toDate: '2026-08-22',
    reason: 'Extended personal travel',
    status: 'Rejected',
  },
];

// ---- Page -----------------------------------------------------------

const EditLeave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the record matching the URL param against mock data.
  const record = MOCK_LEAVE_REQUESTS.find((item) => item.id === id);

  // No API integration yet — logs the validated, updated form
  // payload to the console, simulates a network delay so the
  // loading state is visibly exercised, then navigates back to the
  // leave list to reflect a completed "update" action. Once
  // PUT/PATCH /leave/{id} is confirmed, only this function body
  // changes.
  const handleSubmit = (formData) => {
    setIsSubmitting(true);
    console.log('Updated leave request:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/leave');
    }, 1200);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // ---------------- Not Found State ----------------
  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FiAlertCircle className="h-7 w-7 text-gray-400 dark:text-gray-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Leave request not found
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The request you're trying to edit doesn't exist or may have been removed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    );
  }

  // Populate the form with the existing record's values, matching
  // LeaveForm's expected defaultValues shape exactly.
  const formDefaultValues = {
    employee: record.employee,
    leaveType: record.leaveType,
    fromDate: record.fromDate,
    toDate: record.toDate,
    reason: record.reason,
    status: record.status,
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
            Edit Leave Request
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the leave request details.
          </p>
        </div>
      </div>

      {/* ---------------- Form Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <LeaveForm
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditLeave;