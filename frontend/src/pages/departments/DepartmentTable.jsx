// src/components/departments/DepartmentTable.jsx
import PropTypes from 'prop-types';
import { FiEye, FiEdit2, FiTrash2, FiBriefcase, FiUsers } from 'react-icons/fi';

/**
 * Reusable department data table.
 *
 * Mirrors the visual spec already shipped inline in
 * DepartmentsList.jsx (Feature 7) — same header row, name+icon cell,
 * code badge, employee count, status badge, and row-action buttons —
 * but generalized behind `departments` + `onView`/`onEdit`/`onDelete`
 * props, matching the exact pattern EmployeeTable.jsx (Feature 6)
 * established for the Employees module. DepartmentsList.jsx is NOT
 * modified to consume this yet, per your instruction — it still runs
 * its own inline table markup exactly as confirmed.
 *
 * No API calls, no backend integration — this component only
 * renders whatever `departments` array it receives and delegates
 * every action back to the caller via callback props.
 */
const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const DepartmentTable = ({ departments, onView, onEdit, onDelete }) => {
  const isEmpty = !departments || departments.length === 0;

  if (isEmpty) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiBriefcase className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No departments found
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
              Try adjusting your search term or status filter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Department name
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Code
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Manager
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Employees
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Created date
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
            {departments.map((department) => (
              <tr
                key={department.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                {/* Department Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                      <FiBriefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {department.name}
                    </span>
                  </div>
                </td>

                {/* Department Code */}
                <td className="px-5 py-3.5">
                  <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {department.code}
                  </span>
                </td>

                {/* Manager */}
                <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                  {department.manager}
                </td>

                {/* Employees */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <FiUsers className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                    {department.employeeCount}
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                  {department.createdDate}
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[department.status] || statusStyles.Inactive
                    }`}
                  >
                    {department.status}
                  </span>
                </td>

                {/* Actions: View, Edit, Delete */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(department)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                        aria-label={`View ${department.name}`}
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(department)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                        aria-label={`Edit ${department.name}`}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(department)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        aria-label={`Delete ${department.name}`}
                      >
                        <FiTrash2 className="h-4 w-4" />
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

DepartmentTable.propTypes = {
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string,
      manager: PropTypes.string,
      employeeCount: PropTypes.number,
      createdDate: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

DepartmentTable.defaultProps = {
  departments: [],
  onView: null,
  onEdit: null,
  onDelete: null,
};

export default DepartmentTable;