// src/components/departments/DepartmentFilters.jsx
import PropTypes from 'prop-types';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

/**
 * Reusable filter bar for the Departments module.
 *
 * Mirrors the visual spec already shipped inline in
 * DepartmentsList.jsx (Feature 7) — same search input and status
 * dropdown shell — but fully controlled from outside: this component
 * holds no state of its own, only rendering the current
 * `searchTerm`/`statusFilter` values and forwarding every change up
 * via the on*Change callbacks. Adds a "Reset Filters" button, which
 * DepartmentsList.jsx's inline version did not have — new to this
 * component per your spec's explicit `onReset` prop.
 *
 * DepartmentsList.jsx and DepartmentTable.jsx are NOT modified, per
 * your instruction — this file exists standalone, ready to be wired
 * in later.
 *
 * No mock data — `statusOptions` are the three fixed values from
 * your spec (All / Active / Inactive), not a prop, since this file's
 * required prop list is exactly searchTerm, onSearchChange,
 * statusFilter, onStatusChange, onReset — nothing else.
 */
const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

const DepartmentFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="department-filter-search" className="sr-only">
            Search departments
          </label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="department-filter-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search departments..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* Status dropdown */}
        <div className="relative sm:w-44">
          <label htmlFor="department-filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="department-filter-status"
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

DepartmentFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default DepartmentFilters;