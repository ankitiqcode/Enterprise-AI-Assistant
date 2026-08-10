// src/components/employees/EmployeeFilters.jsx
import PropTypes from 'prop-types';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

/**
 * Reusable filter bar for employee-style list pages.
 *
 * Mirrors the visual spec already shipped inline in EmployeesList.jsx
 * (Feature 6) — same search input, department dropdown, and status
 * dropdown, same spacing/shell — but fully controlled from outside:
 * this component holds no state of its own, it only renders the
 * current values (`searchTerm`, `department`, `status`) and forwards
 * every change up via the on*Change callbacks. EmployeesList.jsx is
 * NOT modified to consume this yet, per your instruction — it still
 * owns its own useState + inline filter markup exactly as confirmed.
 *
 * `departments` and `statusOptions` are passed in as arrays rather
 * than hardcoded, so this component works for any list page with a
 * similar filter shape (not just employees) — e.g. reusable later
 * for a documents or leave-requests list with different option sets.
 */
const EmployeeFilters = ({
  searchTerm,
  onSearchChange,
  department,
  onDepartmentChange,
  departments,
  status,
  onStatusChange,
  statusOptions,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="employee-search" className="sr-only">
            Search employees
          </label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="employee-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or employee ID..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* Department dropdown */}
        <div className="relative sm:w-56">
          <label htmlFor="employee-department-filter" className="sr-only">
            Filter by department
          </label>
          <select
            id="employee-department-filter"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option>All Departments</option>
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status dropdown */}
        <div className="relative sm:w-44">
          <label htmlFor="employee-status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="employee-status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

EmployeeFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  department: PropTypes.string.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.string),
};

EmployeeFilters.defaultProps = {
  departments: [],
  statusOptions: ['All', 'Active', 'Inactive'],
};

export default EmployeeFilters;