// src/pages/Departments/DepartmentsList.jsx
import { useMemo, useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

/**
 * DepartmentsList.jsx — Feature 7
 *
 * Static/mock data only, no backend integration and no API calls,
 * per your instruction — same discipline as EmployeesList.jsx
 * (Feature 6) before its contract was confirmed. Search and status
 * filtering run client-side against MOCK_DEPARTMENTS; once the
 * /departments contract is confirmed, the filtering logic here gets
 * replaced by query params, but the JSX/table structure stays the
 * same.
 *
 * No reusable components extracted yet, per your instruction —
 * everything (table, filters, pagination) lives inline in this one
 * file, mirroring exactly how EmployeesList.jsx looked before
 * DepartmentTable.jsx / DepartmentFilters.jsx / DepartmentPagination.jsx
 * get built as their own files next.
 */

// ---- Mock data -------------------------------------------------------

const MOCK_DEPARTMENTS = [
  { id: 'DEPT-001', name: 'Engineering', code: 'ENG', manager: 'Alicia Ferguson', employeeCount: 86, status: 'Active' },
  { id: 'DEPT-002', name: 'Human Resources', code: 'HR', manager: 'Priya Sharma', employeeCount: 14, status: 'Active' },
  { id: 'DEPT-003', name: 'Sales', code: 'SLS', manager: 'Marcus Webb', employeeCount: 42, status: 'Active' },
  { id: 'DEPT-004', name: 'Marketing', code: 'MKT', manager: 'Karan Malhotra', employeeCount: 23, status: 'Active' },
  { id: 'DEPT-005', name: 'Finance', code: 'FIN', manager: 'Sneha Kapoor', employeeCount: 18, status: 'Active' },
  { id: 'DEPT-006', name: 'Customer Support', code: 'SUP', manager: 'David Kim', employeeCount: 31, status: 'Inactive' },
  { id: 'DEPT-007', name: 'Legal', code: 'LGL', manager: 'Rachel Ortiz', employeeCount: 6, status: 'Active' },
  { id: 'DEPT-008', name: 'Product', code: 'PRD', manager: 'Vikram Singh', employeeCount: 28, status: 'Inactive' },
];

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];

// ---- Helpers -----------------------------------------------------------

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

// ---- Component -----------------------------------------------------------

const DepartmentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Client-side filtering only — will be replaced by query params
  // once GET /departments accepts search/status filters.
  const filteredDepartments = useMemo(() => {
    return MOCK_DEPARTMENTS.filter((department) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.manager.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const isEmpty = filteredDepartments.length === 0;

  // Mock action handlers — placeholders until routing/modals exist.
  const handleView = (department) => console.log('View department:', department.id);
  const handleEdit = (department) => console.log('Edit department:', department.id);
  const handleDelete = (department) => console.log('Delete department:', department.id);

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Departments
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organize your teams, managers, and headcount by department.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiPlus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      {/* ---------------- Filters ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search box */}
          <div className="relative flex-1">
            <label htmlFor="department-search" className="sr-only">
              Search departments
            </label>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="department-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code, or manager..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {/* Status filter */}
          <div className="relative sm:w-44">
            <label htmlFor="department-status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="department-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiBriefcase className="h-6 w-6 text-gray-400 dark:text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No departments found
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
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
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
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
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {department.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {department.manager}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <FiUsers className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                        {department.employeeCount}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[department.status] || statusStyles.Inactive}`}
                      >
                        {department.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(department)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          aria-label={`View ${department.name}`}
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(department)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                          aria-label={`Edit ${department.name}`}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(department)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          aria-label={`Delete ${department.name}`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------- Pagination footer (static) ---------------- */}
        {!isEmpty && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-700 dark:text-gray-300">1</span>–
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredDepartments.length}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredDepartments.length}
              </span>{' '}
              departments
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-600"
              >
                <FiChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 disabled:cursor-not-allowed dark:border-gray-800 dark:text-gray-600"
              >
                Next
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsList;