// src/components/employees/EmployeePagination.jsx
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable pagination footer for employee-style list pages.
 *
 * Mirrors the visual spec already shipped inline in EmployeesList.jsx
 * (Feature 6) — same "Showing X–Y of Z" summary text and Previous/
 * Next button shell — but that original version was purely static
 * (hardcoded to page 1, buttons permanently disabled, no real page
 * count). This component is genuinely functional: it computes the
 * visible range from `currentPage`/`pageSize`/`totalItems`, disables
 * buttons correctly at both boundaries, and calls `onPageChange`
 * with the target page number. EmployeesList.jsx is NOT modified to
 * consume this yet, per your instruction — it still shows its own
 * static single-page footer exactly as confirmed.
 *
 * Deliberately renders no page-number buttons (1, 2, 3...) beyond a
 * single current-page indicator — your spec lists "Current page
 * indicator," singular, not a numbered button row. This keeps the
 * component correct for both small page counts (few employees) and
 * large ones (hundreds of employees) without needing ellipsis/
 * truncation logic that wasn't asked for.
 */
const EmployeePagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // Range shown, e.g. "Showing 21–40 of 248 employees".
  // Clamped so a partial final page (e.g. 8 items on a page size of
  // 20) reports its true end index rather than overshooting totalItems.
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (!isFirstPage) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isLastPage) onPageChange(currentPage + 1);
  };

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800"
      aria-label="Employee list pagination"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{rangeStart}</span>
        –
        <span className="font-medium text-gray-700 dark:text-gray-300">{rangeEnd}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{totalItems}</span>{' '}
        employees
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstPage}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
        >
          <FiChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span
          className="min-w-[2.25rem] rounded-lg bg-indigo-600 px-3 py-1.5 text-center text-sm font-medium text-white"
          aria-current="page"
          aria-label={`Page ${currentPage} of ${totalPages}`}
        >
          {currentPage}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={isLastPage}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-900 dark:disabled:hover:bg-transparent dark:disabled:hover:text-gray-400"
        >
          Next
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

EmployeePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default EmployeePagination;