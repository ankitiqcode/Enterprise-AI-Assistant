// src/components/attendance/AttendanceFilters.jsx
import PropTypes from 'prop-types';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

/**
 * Reusable filter bar for the Attendance module.
 *
 * Fully controlled — no internal state. searchTerm/departmentFilter/
 * statusFilter render directly from props, and every change forwards
 * up via the on*Change callbacks, same controlled pattern as
 * DepartmentFilters.jsx (Feature 7).
 *
 * DEPARTMENT_OPTIONS and STATUS_OPTIONS are hardcoded constants, not
 * props — your prop list for this file is exactly searchTerm,
 * onSearchChange, departmentFilter, onDepartmentChange, statusFilter,
 * onStatusChange, onReset, with no array-prop equivalent. Combined
 * with the explicit, literal options list in your UI spec and "No
 * mock data inside component," this follows the same precedent as
 * DepartmentFilters.jsx's fixed STATUS_OPTIONS: a specific, required
 * dropdown content list is a UI requirement, not sample/fake data.
 *
 * AttendanceList.jsx and AttendanceTable.jsx are NOT modified, per
 * your instruction.
 */
const DEPARTMENT_OPTIONS = [
  'All Departments',
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'IT',
  'Customer Support',
];

const STATUS_OPTIONS = ['All Status', 'Present', 'Absent', 'Late', 'Half Day', 'Leave'];

const AttendanceFilters = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="attendance-filter-search" className="sr-only">
            Search employee
          </label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="attendance-filter-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* Department dropdown */}
        <div className="relative sm:w-56">
          <label htmlFor="attendance-filter-department" className="sr-only">
            Filter by department
          </label>
          <select
            id="attendance-filter-department"
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status dropdown */}
        <div className="relative sm:w-44">
          <label htmlFor="attendance-filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="attendance-filter-status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
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
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900"
        >
          <FiX className="h-4 w-4" />
          Reset filters
        </button>
      </div>
    </div>
  );
};

AttendanceFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  departmentFilter: PropTypes.string.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default AttendanceFilters;