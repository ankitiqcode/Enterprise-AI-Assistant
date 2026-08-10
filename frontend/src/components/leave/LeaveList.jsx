// src/pages/Leave/LeaveList.jsx
import { useMemo, useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiCheck,
  FiX,
  FiEdit2,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
} from 'react-icons/fi';

/**
 * LeaveList.jsx — Feature 9
 *
 * Static/mock data only, no backend integration and no API calls,
 * per your instruction — React Query/Axios/React Hook Form are
 * available in the stack but not used on this page (this is a list/
 * filter page, not a form; LeaveForm.jsx, which would use React Hook
 * Form, is explicitly excluded from this file).
 *
 * No reusable components extracted — LeaveTable, LeaveFilters,
 * LeavePagination, LeaveForm, LeaveDetails are all explicitly NOT
 * created here. Everything (search, three dropdown filters, table,
 * pagination) lives inline in this single file, following the same
 * "build inline first" sequencing as Employees/Departments/Attendance.
 */

// ---- Mock data -------------------------------------------------------

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'IT',
];

const LEAVE_TYPES = [
  'All Types',
  'Casual Leave',
  'Sick Leave',
  'Earned Leave',
  'Emergency Leave',
  'Unpaid Leave',
];

const STATUS_OPTIONS = ['All Status', 'Pending', 'Approved', 'Rejected'];

const MOCK_LEAVE_RECORDS = [
  { id: 'LEAVE-001', employee: 'John Doe', employeeId: 'EMP-001', department: 'Engineering', leaveType: 'Casual Leave', fromDate: '2026-08-10', toDate: '2026-08-11', days: 2, reason: 'Personal work', status: 'Pending' },
  { id: 'LEAVE-002', employee: 'Priya Sharma', employeeId: 'EMP-002', department: 'Human Resources', leaveType: 'Sick Leave', fromDate: '2026-08-05', toDate: '2026-08-06', days: 2, reason: 'Fever and recovery', status: 'Approved' },
  { id: 'LEAVE-003', employee: 'Rahul Mehta', employeeId: 'EMP-003', department: 'Engineering', leaveType: 'Earned Leave', fromDate: '2026-09-01', toDate: '2026-09-05', days: 5, reason: 'Family vacation', status: 'Pending' },
  { id: 'LEAVE-004', employee: 'Anita Verma', employeeId: 'EMP-004', department: 'Sales', leaveType: 'Emergency Leave', fromDate: '2026-08-03', toDate: '2026-08-03', days: 1, reason: 'Family emergency', status: 'Approved' },
  { id: 'LEAVE-005', employee: 'Karan Malhotra', employeeId: 'EMP-005', department: 'Marketing', leaveType: 'Unpaid Leave', fromDate: '2026-08-18', toDate: '2026-08-22', days: 5, reason: 'Extended personal travel', status: 'Rejected' },
  { id: 'LEAVE-006', employee: 'Sneha Kapoor', employeeId: 'EMP-006', department: 'Finance', leaveType: 'Casual Leave', fromDate: '2026-08-12', toDate: '2026-08-12', days: 1, reason: 'Bank and documentation work', status: 'Approved' },
  { id: 'LEAVE-007', employee: 'Vikram Singh', employeeId: 'EMP-007', department: 'Engineering', leaveType: 'Sick Leave', fromDate: '2026-08-07', toDate: '2026-08-09', days: 3, reason: 'Viral infection', status: 'Pending' },
  { id: 'LEAVE-008', employee: 'Neha Gupta', employeeId: 'EMP-008', department: 'Human Resources', leaveType: 'Earned Leave', fromDate: '2026-09-10', toDate: '2026-09-14', days: 5, reason: 'Sibling\u2019s wedding', status: 'Pending' },
  { id: 'LEAVE-009', employee: 'David Kim', employeeId: 'EMP-009', department: 'Sales', leaveType: 'Casual Leave', fromDate: '2026-08-15', toDate: '2026-08-15', days: 1, reason: 'Moving apartments', status: 'Approved' },
  { id: 'LEAVE-010', employee: 'Rachel Ortiz', employeeId: 'EMP-010', department: 'Finance', leaveType: 'Emergency Leave', fromDate: '2026-08-04', toDate: '2026-08-05', days: 2, reason: 'Medical emergency at home', status: 'Rejected' },
  { id: 'LEAVE-011', employee: 'Daniel Osei', employeeId: 'EMP-011', department: 'Operations', leaveType: 'Unpaid Leave', fromDate: '2026-09-20', toDate: '2026-09-21', days: 2, reason: 'Personal reasons', status: 'Pending' },
  { id: 'LEAVE-012', employee: 'Rebecca Chen', employeeId: 'EMP-012', department: 'IT', leaveType: 'Sick Leave', fromDate: '2026-08-06', toDate: '2026-08-06', days: 1, reason: 'Dental appointment', status: 'Approved' },
];

// ---- Status badge styling -------------------------------------------------
// Pending -> yellow, Approved -> green, Rejected -> red, per your spec.

const statusStyles = {
  Pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

// ---- Helpers -----------------------------------------------------------

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Formats an ISO date string ("2026-08-10") into a short display
// form ("Aug 10, 2026") for the table cells.
const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ---- Component -----------------------------------------------------------

const LeaveList = () => {
  // Search term (employee name or ID) plus three dropdown filters —
  // all purely client-side against the mock array below.
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Derived, filtered list. Recomputes only when any filter input
  // changes, not on every render.
  const filteredLeaveRecords = useMemo(() => {
    return MOCK_LEAVE_RECORDS.filter((record) => {
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        search === '' ||
        record.employee.toLowerCase().includes(search) ||
        record.employeeId.toLowerCase().includes(search);

      const matchesDepartment =
        departmentFilter === 'All Departments' || record.department === departmentFilter;

      const matchesLeaveType =
        leaveTypeFilter === 'All Types' || record.leaveType === leaveTypeFilter;

      const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesLeaveType && matchesStatus;
    });
  }, [searchTerm, departmentFilter, leaveTypeFilter, statusFilter]);

  const isEmpty = filteredLeaveRecords.length === 0;

  // Clears all filters back to their defaults in one action — "Reset
  // filters when needed" from your Behavior requirements. Not listed
  // as an explicit UI element under Filters, but added as a small
  // secondary button next to the dropdowns since a 4-filter bar with
  // no reset path is otherwise awkward to clear; flagging this as an
  // addition rather than a literal spec line item.
  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('All Departments');
    setLeaveTypeFilter('All Types');
    setStatusFilter('All Status');
  };

  // Mock action handlers — no backend, no confirmation modal yet,
  // per your instruction. Approve/Reject simply log for now.
  const handleApplyLeave = () => console.log('Apply leave clicked');
  const handleView = (record) => console.log('View leave request:', record.id);
  const handleApprove = (record) => console.log('Approve leave request:', record.id);
  const handleReject = (record) => console.log('Reject leave request:', record.id);
  const handleEdit = (record) => console.log('Edit leave request:', record.id);

  return (
    <div className="space-y-6">
      {/* ---------------- Page Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage employee leave requests and approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyLeave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiPlus className="h-4 w-4" />
          Apply Leave
        </button>
      </div>

      {/* ---------------- Search & Filters ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search by employee name or ID */}
          <div className="relative flex-1">
            <label htmlFor="leave-search" className="sr-only">
              Search by employee name or ID
            </label>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="leave-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by employee name or ID..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {/* Department filter */}
          <div className="relative sm:w-52">
            <label htmlFor="leave-department-filter" className="sr-only">
              Filter by department
            </label>
            <select
              id="leave-department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {DEPARTMENTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Leave type filter */}
          <div className="relative sm:w-48">
            <label htmlFor="leave-type-filter" className="sr-only">
              Filter by leave type
            </label>
            <select
              id="leave-type-filter"
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {LEAVE_TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status filter */}
          <div className="relative sm:w-44">
            <label htmlFor="leave-status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="leave-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Reset filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900"
          >
            <FiRotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ---------------- Leave Requests Table ---------------- */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isEmpty ? (
          // ---------------- Empty State ----------------
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiCalendar className="h-6 w-6 text-gray-400 dark:text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No leave requests found
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Employee
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Employee ID
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Department
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Leave type
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    From date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    To date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Days
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Reason
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredLeaveRecords.map((record) => {
                  const isPending = record.status === 'Pending';
                  return (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      {/* Employee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                            {getInitials(record.employee)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {record.employee}
                          </span>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {record.employeeId}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {record.department}
                      </td>

                      {/* Leave Type */}
                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {record.leaveType}
                      </td>

                      {/* From Date */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(record.fromDate)}
                      </td>

                      {/* To Date */}
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(record.toDate)}
                      </td>

                      {/* Days */}
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {record.days}
                      </td>

                      {/* Reason — truncated with a native title tooltip
                          for the full text, since reasons can run long
                          and this table already has 10 columns. */}
                      <td className="max-w-[180px] px-5 py-3.5">
                        <p
                          className="truncate text-sm text-gray-600 dark:text-gray-400"
                          title={record.reason}
                        >
                          {record.reason}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusStyles[record.status] || statusStyles.Pending
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      {/* Actions: View, Approve, Reject, Edit.
                          Approve/Reject only render for Pending
                          requests — approving/rejecting an already-
                          decided request isn't a meaningful action in
                          a real HRMS. This is a UX decision on top of
                          your spec's action list, not a literal
                          requirement, so flagging it here. */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleView(record)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                            aria-label={`View leave request for ${record.employee}`}
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(record)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                                aria-label={`Approve leave request for ${record.employee}`}
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(record)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                aria-label={`Reject leave request for ${record.employee}`}
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEdit(record)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                            aria-label={`Edit leave request for ${record.employee}`}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------- Static Pagination Footer ---------------- */}
        {!isEmpty && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">1</span>
              –
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {Math.min(10, filteredLeaveRecords.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredLeaveRecords.length}
              </span>{' '}
              leave requests
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-600"
              >
                <FiChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-600"
              >
                Next
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveList;