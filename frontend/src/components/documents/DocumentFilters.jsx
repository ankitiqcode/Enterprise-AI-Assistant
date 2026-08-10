// src/components/documents/DocumentFilters.jsx
import PropTypes from 'prop-types';
import { FiSearch, FiChevronDown, FiRotateCcw } from 'react-icons/fi';

/**
 * Reusable, fully controlled filter bar for the Documents module.
 * Holds no internal state — searchTerm/documentTypeFilter/
 * statusFilter render directly from props, and every change is
 * forwarded up via the matching on*Change callback. No filtering
 * logic, no mock data, no navigation — same controlled pattern as
 * LeaveFilters.jsx / AttendanceFilters.jsx / DepartmentFilters.jsx.
 *
 * Responsive behavior uses the two-tier "stacked on mobile,
 * horizontal on desktop" model, same lg-breakpoint approach as
 * LeaveFilters.jsx, since this spec states the identical requirement
 * ("Mobile: stacked layout / Desktop: horizontal layout").
 *
 * DocumentsList.jsx and DocumentTable.jsx are NOT modified, per your
 * instruction. No additional files created.
 */
const DOCUMENT_TYPE_OPTIONS = ['All Types', 'Policy', 'Report', 'Contract', 'Employee Document', 'Other'];

const STATUS_OPTIONS = ['All Status', 'Active', 'Archived'];

const DocumentFilters = ({
  searchTerm,
  onSearchChange,
  documentTypeFilter,
  onDocumentTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input — takes available width */}
        <div className="relative flex-1">
          <label htmlFor="document-filter-search" className="sr-only">
            Search documents or employee name
          </label>
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="document-filter-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents or employee name..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        {/* Document type dropdown */}
        <div className="relative lg:w-52">
          <label htmlFor="document-filter-type" className="sr-only">
            Filter by document type
          </label>
          <select
            id="document-filter-type"
            value={documentTypeFilter}
            onChange={(e) => onDocumentTypeChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status dropdown */}
        <div className="relative lg:w-44">
          <label htmlFor="document-filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="document-filter-status"
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

DocumentFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  documentTypeFilter: PropTypes.string.isRequired,
  onDocumentTypeChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default DocumentFilters;