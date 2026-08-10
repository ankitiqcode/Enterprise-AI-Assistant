// src/components/attendance/AttendanceTable.jsx
import PropTypes from 'prop-types';
import { FiEye, FiEdit2, FiClock } from 'react-icons/fi';

/**
 * Reusable attendance data table.
 *
 * Standalone component per this spec's own color mapping — note that
 * Half Day (Orange) and Leave (Blue) here differ from the colors
 * used in AttendanceList.jsx's inline table (Sky and Violet
 * respectively). This file follows the mapping given in this
 * message exactly; AttendanceList.jsx is NOT modified, per your
 * instruction, so the two currently disagree on those two colors
 * until a reconciliation pass wires them together.
 *
 * Only View and Edit actions, matching AttendanceList.jsx's action
 * set (no Delete) — attendance records aren't typically hard-deleted
 * in an HRMS the way an employee/department record might be.
 */
const statusStyles = {
  Present: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Absent: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Late: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  'Half Day': 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  Leave: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
};

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const AttendanceTable = ({ attendanceRecords, onView, onEdit }) => {
  const isEmpty = !attendanceRecords || attendanceRecords.length === 0;

  if (isEmpty) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiClock className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No attendance records found
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
              Try adjusting your search term or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
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
                Date
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Check in
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Check out
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Working hours
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
            {attendanceRecords.map((record) => (
              <tr
                key={record.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                {/* Employee */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                      {getInitials(record.employeeName)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.employeeName}
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

                {/* Date */}
                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                  {record.date}
                </td>

                {/* Check In */}
                <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                  {record.checkIn}
                </td>

                {/* Check Out */}
                <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                  {record.checkOut}
                </td>

                {/* Working Hours */}
                <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {record.workingHours}
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[record.status] || statusStyles.Absent
                    }`}
                  >
                    {record.status}
                  </span>
                </td>

                {/* Actions: View, Edit */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(record)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                        aria-label={`View attendance for ${record.employeeName}`}
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(record)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                        aria-label={`Edit attendance for ${record.employeeName}`}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AttendanceTable.propTypes = {
  attendanceRecords: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      employeeName: PropTypes.string.isRequired,
      employeeId: PropTypes.string,
      department: PropTypes.string,
      date: PropTypes.string,
      checkIn: PropTypes.string,
      checkOut: PropTypes.string,
      workingHours: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
};

AttendanceTable.defaultProps = {
  attendanceRecords: [],
  onView: null,
  onEdit: null,
};

export default AttendanceTable;