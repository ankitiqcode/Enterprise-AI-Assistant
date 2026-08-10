// src/components/attendance/AttendancePagination.jsx
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable pagination footer for the Attendance module.
 *
 * Identical behavior to DepartmentPagination.jsx (Feature 7) — same
 * prop contract, same sliding 5-button window, same disable/
 * highlight/keyboard rules — since this spec is functionally the
 * same pagination pattern with only the summary copy changed
 * ("attendance records" instead of "departments"). Reused rather
 * than reinvented, as an independent file per your instruction.
 *
 * No API calls, no backend logic — purely presentational. Does not
 * modify AttendanceList.jsx, AttendanceTable.jsx, or
 * AttendanceFilters.jsx.
 */

/**
 * Computes a sliding window of up to `maxVisible` page numbers,
 * centered on the current page where possible, clamped to
 * [1, totalPages] at the edges.
 */
const getVisiblePages = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const AttendancePagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // Range shown, e.g. "Showing 11–20 of 47 attendance records".
  // Clamped so a partial final page reports its true end index.
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const visiblePages = getVisiblePages(currentPage, totalPages);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800"
      aria-label="Attendance list pagination"
    >
      {/* Left section — showing summary */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{rangeStart}</span>
        –
        <span className="font-medium text-gray-700 dark:text-gray-300">{rangeEnd}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{totalItems}</span>{' '}
        attendance records
      </p>

      {/* Right section — previous / page numbers / next */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
        >
          <FiChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <ul className="flex items-center gap-1.5" role="list">
          {visiblePages.map((page) => {
            const isActive = page === currentPage;
            return (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Go to page ${page}`}
                  className={`min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

AttendancePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default AttendancePagination;