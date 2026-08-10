// src/components/leave/LeaveFilters.jsx
import PropTypes from 'prop-types';
import { FiSearch, FiChevronDown, FiRotateCcw } from 'react-icons/fi';

/**
 * Reusable, fully controlled filter bar for the Leave Management
 * module. Holds no internal state — every value (searchTerm,
 * departmentFilter, leaveTypeFilter, statusFilter) is rendered
 * directly from props, and every change is forwarded up via the
 * matching on*Change callback. No filtering logic, no mock data, no
 * navigation — this component only renders controls and reports
 * changes, same controlled pattern as DepartmentFilters.jsx /
 * AttendanceFilters.jsx.
 *
 * DEPARTMENT_OPTIONS includes "Customer Support" (9 total options)
 * per this spec's explicit list — LeaveList.jsx's inline DEPARTMENTS
 * array (Feature 9, prior message) only had 7 departments without
 * Customer Support. This is a deliberate divergence following this
 * file's own spec, not an inconsistency to silently correct;
 * flagged here rather than adding Customer Support to LeaveList.jsx
 * myself, since you said not to modify that file.
 *
 * LeaveList.jsx and LeaveTable.jsx are NOT modified, per your
 * instruction. No additional files created.
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

const LEAVE_TYPE_OPTIONS = [
  'All Types',
  'Casual Leave',
  'Sick Leave',
  'Earned Leave',
  'Emergency Leave',
  'Unpaid Leave',
];

const STATUS_OPTIONS = ['All Status', 'Pending', 'Approved', 'Rejected'];

const LeaveFilters = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  leaveTypeFilter,
  onLeaveTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input — takes available width */}
        <div className="relative flex-1">
          <label htmlFor="leave-filter-search" className="sr-only">
            Search by employee name or ID
          </label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="leave-filter-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employee or employee ID..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* Department dropdown */}
        <div className="relative lg:w-52">
          <label htmlFor="leave-filter-department" className="sr-only">
            Filter by department
          </label>
          <select
            id="leave-filter-department"
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

        {/* Leave type dropdown */}
        <div className="relative lg:w-48">
          <label htmlFor="leave-filter-type" className="sr-only">
            Filter by leave type
          </label>
          <select
            id="leave-filter-type"
            value={leaveTypeFilter}
            onChange={(e) => onLeaveTypeChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status dropdown */}
        <div className="relative lg:w-44">
          <label htmlFor="leave-filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="leave-filter-status"
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
          <FiRotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};

LeaveFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  departmentFilter: PropTypes.string.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  leaveTypeFilter: PropTypes.string.isRequired,
  onLeaveTypeChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default LeaveFilters;