// src/pages/Leave/LeaveDetails.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit2,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiClock,
} from 'react-icons/fi';

/**
 * LeaveDetails.jsx — Feature 9
 *
 * Mock data only, no API calls, no backend integration, no service
 * imports, per your instruction. Reads the record id from the URL
 * via useParams() and looks it up against a local mock array, same
 * lookup pattern as AttendanceDetails.jsx.
 *
 * InfoRow is a local, unexported helper scoped to this file only —
 * no external reusable components created, matching this spec's
 * instruction (and, like AttendanceDetails.jsx before it, PropTypes
 * are omitted from this local helper — consistent with that file's
 * precedent, not a new decision).
 *
 * Approve/Reject are local mock handlers (console.log only, no API)
 * and only render when status is "Pending" — mirrors the same
 * status-gated behavior already established in LeaveTable.jsx.
 */

// ---- Mock data -------------------------------------------------------

const MOCK_LEAVE_REQUESTS = [
  {
    id: 'LEAVE-001',
    employee: 'John Doe',
    employeeId: 'EMP-001',
    department: 'Engineering',
    role: 'Senior Developer',
    email: 'john.doe@company.com',
    leaveType: 'Casual Leave',
    fromDate: '2026-08-10',
    toDate: '2026-08-11',
    days: 2,
    reason: 'Personal work',
    status: 'Pending',
  },
  {
    id: 'LEAVE-002',
    employee: 'Priya Sharma',
    employeeId: 'EMP-002',
    department: 'Human Resources',
    role: 'HR Manager',
    email: 'priya.sharma@company.com',
    leaveType: 'Sick Leave',
    fromDate: '2026-08-05',
    toDate: '2026-08-06',
    days: 2,
    reason: 'Fever and recovery',
    status: 'Approved',
  },
  {
    id: 'LEAVE-003',
    employee: 'Rahul Mehta',
    employeeId: 'EMP-003',
    department: 'Engineering',
    role: 'Frontend Engineer',
    email: 'rahul.mehta@company.com',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-01',
    toDate: '2026-09-05',
    days: 5,
    reason: 'Family vacation',
    status: 'Pending',
  },
  {
    id: 'LEAVE-004',
    employee: 'Anita Verma',
    employeeId: 'EMP-004',
    department: 'Sales',
    role: 'Sales Executive',
    email: 'anita.verma@company.com',
    leaveType: 'Emergency Leave',
    fromDate: '2026-08-03',
    toDate: '2026-08-03',
    days: 1,
    reason: 'Family emergency',
    status: 'Approved',
  },
  {
    id: 'LEAVE-005',
    employee: 'Karan Malhotra',
    employeeId: 'EMP-005',
    department: 'Marketing',
    role: 'Marketing Lead',
    email: 'karan.malhotra@company.com',
    leaveType: 'Unpaid Leave',
    fromDate: '2026-08-18',
    toDate: '2026-08-22',
    days: 5,
    reason: 'Extended personal travel',
    status: 'Rejected',
  },
];

// ---- Status badge styling -------------------------------------------------

const statusStyles = {
  Pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

// ---- Helpers -----------------------------------------------------------

// Formats an ISO date string ("2026-08-10") into a short display
// form ("Aug 10, 2026").
const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ---- Local helper component -----------------------------------------

/** Single label/value pair used inside the info cards on this page. */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || '—'}</span>
  </div>
);

// ---- Page -----------------------------------------------------------

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Local status override so Approve/Reject visibly reflect on this
  // page immediately after being clicked, even though there's no
  // backend to persist the change yet. The underlying mock array
  // itself is never mutated — this is purely local UI state layered
  // on top of the looked-up record.
  const [statusOverride, setStatusOverride] = useState(null);

  // Look up the record matching the URL param against mock data.
  const record = MOCK_LEAVE_REQUESTS.find((item) => item.id === id);

  // Mock handlers — no API call, per your instruction. Logs the
  // full leave request object and updates local display state so
  // the Approve/Reject buttons correctly disappear afterward.
  const handleApprove = () => {
    console.log('Approve leave:', record);
    setStatusOverride('Approved');
  };

  const handleReject = () => {
    console.log('Reject leave:', record);
    setStatusOverride('Rejected');
  };

  const handleEdit = () => {
    navigate(`/leave/${record.id}/edit`);
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
            The request you're looking for doesn't exist or may have been removed.
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

  const currentStatus = statusOverride || record.status;
  const isPending = currentStatus === 'Pending';
  const statusBadgeClass = statusStyles[currentStatus] || statusStyles.Pending;

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              Leave Request Details
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View employee leave request details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Leave
        </button>
      </div>

      {/* ---------------- Summary Cards ---------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
            <FiClock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Leave type</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {record.leaveType}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
            <FiCalendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Total days</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {record.days}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
            <FiCalendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">From date</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatDate(record.fromDate)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
            <FiCalendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">To date</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatDate(record.toDate)}
          </p>
        </div>
      </div>

      {/* ---------------- Info Grid ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Employee Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Employee information
            </h2>
          </div>
          <div className="space-y-3.5">
            <InfoRow label="Employee name" value={record.employee} />
            <InfoRow label="Employee ID" value={record.employeeId} />
            <InfoRow label="Department" value={record.department} />
            <InfoRow label="Role" value={record.role} />
            <InfoRow label="Email" value={record.email} />
          </div>
        </div>

        {/* Leave Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Leave information
            </h2>
          </div>
          <div className="space-y-3.5">
            <InfoRow label="Leave type" value={record.leaveType} />
            <InfoRow label="From date" value={formatDate(record.fromDate)} />
            <InfoRow label="To date" value={formatDate(record.toDate)} />
            <InfoRow label="Total days" value={record.days} />
            <InfoRow label="Reason" value={record.reason} />
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
                Status
              </span>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass}`}>
                {currentStatus}
              </span>
            </div>
          </div>

          {/* ---------------- Action Section ---------------- */}
          {isPending && (
            <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row dark:border-gray-800">
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <FiCheck className="h-4 w-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-500/10 dark:focus-visible:ring-offset-gray-900"
              >
                <FiX className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;