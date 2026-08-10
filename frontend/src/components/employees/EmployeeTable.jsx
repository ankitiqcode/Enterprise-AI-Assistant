// src/components/employees/EmployeeTable.jsx
import PropTypes from 'prop-types';
import { FiEye, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';

/**
 * Reusable employee data table.
 *
 * Mirrors the visual spec already shipped inline in EmployeesList.jsx
 * (Feature 6) — same header row, avatar+name cell, status badge, and
 * row-action buttons — but generalized behind `employees` +
 * `onView`/`onEdit`/`onDelete` props so it can be reused anywhere a
 * filtered employee list needs rendering (e.g. a department's
 * employee sub-list later). EmployeesList.jsx is NOT modified to
 * consume this yet, per your instruction — it still runs its own
 * inline table markup exactly as confirmed.
 *
 * This component owns no data or filtering logic — it only renders
 * whatever `employees` array it's given and delegates every action
 * (view/edit/delete) back to the caller via callback props. That
 * keeps it "search friendly": a parent can pass an already-filtered
 * array (as EmployeesList.jsx does internally today) without this
 * component needing to know search/filter state exists.
 */
const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const EmployeeTable = ({ employees, onView, onEdit, onDelete }) => {
  const isEmpty = !employees || employees.length === 0;

  if (isEmpty) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiUsers className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No employees found
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
              Try adjusting your search or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
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
                Role
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Email
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
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                      {getInitials(employee.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {employee.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                  {employee.id}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                  {employee.department}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                  {employee.role}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                  {employee.email}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[employee.status] || statusStyles.Inactive
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(employee)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                        aria-label={`View ${employee.name}`}
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(employee)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                        aria-label={`Edit ${employee.name}`}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(employee)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        aria-label={`Delete ${employee.name}`}
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

EmployeeTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      department: PropTypes.string,
      role: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

EmployeeTable.defaultProps = {
  employees: [],
  onView: null,
  onEdit: null,
  onDelete: null,
};

export default EmployeeTable;