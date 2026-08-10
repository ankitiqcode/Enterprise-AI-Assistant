// src/components/leave/LeaveTable.jsx
import PropTypes from 'prop-types';
import { FiEye, FiCheck, FiX, FiEdit2, FiClipboard } from 'react-icons/fi';

/**
 * Reusable leave request data table.
 *
 * Renders only the data passed via `leaveRequests` — no filtering,
 * no pagination, no mock data, no API calls. Every action
 * (View/Approve/Reject/Edit) is delegated back to the caller via
 * callback props, matching the pattern established by
 * EmployeeTable.jsx / DepartmentTable.jsx / AttendanceTable.jsx.
 *
 * Approve/Reject are conditionally rendered only when
 * request.status === 'Pending', per this spec's explicit
 * requirement — this confirms (rather than introduces) the same
 * behavior I applied as a flagged UX judgment call inline in
 * LeaveList.jsx. LeaveList.jsx is NOT modified here, per your
 * instruction — it still runs its own inline table markup.
 */
const statusStyles = {
  Pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Formats an ISO date string ("2026-08-10") into a short display
// form ("Aug 10, 2026"). Falls back to the raw string if parsing
// fails, so malformed/partial data doesn't crash the row.
const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const LeaveTable = ({ leaveRequests, onView, onApprove, onReject, onEdit }) => {
  const isEmpty = !leaveRequests || leaveRequests.length === 0;

  if (isEmpty) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiClipboard className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No leave requests found
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
              There are no leave requests to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
            {leaveRequests.map((request) => {
              const isPending = request.status === 'Pending';
              return (
                <tr
                  key={request.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  {/* Employee */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                        {getInitials(request.employee)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {request.employee}
                      </span>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {request.employeeId}
                  </td>

                  {/* Department */}
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {request.department}
                  </td>

                  {/* Leave Type */}
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {request.leaveType}
                  </td>

                  {/* From Date */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.fromDate)}
                  </td>

                  {/* To Date */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.toDate)}
                  </td>

                  {/* Days */}
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {request.days}
                  </td>

                  {/* Reason — truncated with a native title tooltip
                      for the full text, same treatment as
                      LeaveList.jsx's inline table. */}
                  <td className="max-w-[180px] px-5 py-3.5">
                    <p
                      className="truncate text-sm text-gray-600 dark:text-gray-400"
                      title={request.reason}
                    >
                      {request.reason}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[request.status] || statusStyles.Pending
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  {/* Actions: View, Approve, Reject, Edit.
                      Approve/Reject render only when status is
                      Pending — explicit per this spec. */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(request)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          aria-label={`View leave request for ${request.employee}`}
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      )}
                      {isPending && onApprove && (
                        <button
                          type="button"
                          onClick={() => onApprove(request)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                          aria-label={`Approve leave request for ${request.employee}`}
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                      )}
                      {isPending && onReject && (
                        <button
                          type="button"
                          onClick={() => onReject(request)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          aria-label={`Reject leave request for ${request.employee}`}
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(request)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                          aria-label={`Edit leave request for ${request.employee}`}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LeaveTable.propTypes = {
  leaveRequests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      employee: PropTypes.string.isRequired,
      employeeId: PropTypes.string,
      department: PropTypes.string,
      leaveType: PropTypes.string,
      fromDate: PropTypes.string,
      toDate: PropTypes.string,
      days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reason: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onView: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onEdit: PropTypes.func,
};

LeaveTable.defaultProps = {
  leaveRequests: [],
  onView: null,
  onApprove: null,
  onReject: null,
  onEdit: null,
};

export default LeaveTable;