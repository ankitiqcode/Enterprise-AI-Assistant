// src/pages/Attendance/AttendanceList.jsx
import { useMemo, useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

/**
 * AttendanceList.jsx — Feature 8
 *
 * Static/mock data only, no backend integration and no API calls,
 * per your instruction — React Query/Axios are available in the
 * stack but not used yet, same discipline as Employees/Departments
 * before their contracts were confirmed. Search, department filter,
 * and status filter all run client-side via useMemo against
 * MOCK_ATTENDANCE.
 *
 * No reusable components extracted — AttendanceTable, filters, and
 * pagination are explicitly NOT created here, per your instruction.
 * Everything lives inline in this single file, following the exact
 * sequencing already used for Employees (Feature 6) and Departments
 * (Feature 7): build the full inline page first, extract components
 * after.
 *
 * Only "View" and "Edit" actions are present on this page — your
 * spec lists exactly those two for Attendance (no Delete), a
 * deliberate difference from Employees/Departments' three-action row,
 * since deleting an attendance record isn't a typical HRMS action in
 * the way deleting an employee/department record is.
 */

// ---- Mock data -------------------------------------------------------

const DEPARTMENTS = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales'];

const STATUS_FILTERS = ['All', 'Present', 'Absent', 'Late', 'Half Day', 'Leave'];

const MOCK_ATTENDANCE = [
  { id: 'ATT-001', employeeName: 'John Doe', employeeId: 'EMP-001', department: 'Engineering', date: 'Jul 28, 2026', checkIn: '09:02 AM', checkOut: '06:05 PM', workingHours: '9h 03m', status: 'Present' },
  { id: 'ATT-002', employeeName: 'Priya Sharma', employeeId: 'EMP-002', department: 'Human Resources', date: 'Jul 28, 2026', checkIn: '09:15 AM', checkOut: '06:00 PM', workingHours: '8h 45m', status: 'Late' },
  { id: 'ATT-003', employeeName: 'Rahul Mehta', employeeId: 'EMP-003', department: 'Engineering', date: 'Jul 28, 2026', checkIn: '—', checkOut: '—', workingHours: '—', status: 'Absent' },
  { id: 'ATT-004', employeeName: 'Anita Verma', employeeId: 'EMP-004', department: 'Sales', date: 'Jul 28, 2026', checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '4h 00m', status: 'Half Day' },
  { id: 'ATT-005', employeeName: 'Karan Malhotra', employeeId: 'EMP-005', department: 'Marketing', date: 'Jul 28, 2026', checkIn: '—', checkOut: '—', workingHours: '—', status: 'Leave' },
  { id: 'ATT-006', employeeName: 'Sneha Kapoor', employeeId: 'EMP-006', department: 'Finance', date: 'Jul 28, 2026', checkIn: '08:58 AM', checkOut: '06:10 PM', workingHours: '9h 12m', status: 'Present' },
  { id: 'ATT-007', employeeName: 'Vikram Singh', employeeId: 'EMP-007', department: 'Engineering', date: 'Jul 28, 2026', checkIn: '09:32 AM', checkOut: '06:02 PM', workingHours: '8h 30m', status: 'Late' },
  { id: 'ATT-008', employeeName: 'Neha Gupta', employeeId: 'EMP-008', department: 'Human Resources', date: 'Jul 28, 2026', checkIn: '09:01 AM', checkOut: '06:00 PM', workingHours: '8h 59m', status: 'Present' },
  { id: 'ATT-009', employeeName: 'David Kim', employeeId: 'EMP-009', department: 'Sales', date: 'Jul 28, 2026', checkIn: '09:05 AM', checkOut: '05:58 PM', workingHours: '8h 53m', status: 'Present' },
  { id: 'ATT-010', employeeName: 'Rachel Ortiz', employeeId: 'EMP-010', department: 'Finance', date: 'Jul 28, 2026', checkIn: '—', checkOut: '—', workingHours: '—', status: 'Absent' },
  { id: 'ATT-011', employeeName: 'Marcus Webb', employeeId: 'EMP-011', department: 'Sales', date: 'Jul 28, 2026', checkIn: '09:10 AM', checkOut: '02:00 PM', workingHours: '4h 50m', status: 'Half Day' },
  { id: 'ATT-012', employeeName: 'Daniel Osei', employeeId: 'EMP-012', department: 'Marketing', date: 'Jul 28, 2026', checkIn: '08:55 AM', checkOut: '06:04 PM', workingHours: '9h 09m', status: 'Present' },
];

// ---- Status badge styling -------------------------------------------------

const statusStyles = {
  Present: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Absent: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Late: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Half Day': 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  Leave: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
};

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// ---- Component -----------------------------------------------------------

const AttendanceList = () => {
  // Search term (employee name), department filter, and status
  // filter — all purely client-side against the mock array below.
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All');

  // Derived, filtered list. Recomputes only when any of the three
  // filter inputs change, not on every render.
  const filteredAttendance = useMemo(() => {
    return MOCK_ATTENDANCE.filter((record) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        record.employeeName.toLowerCase().includes(searchTerm.trim().toLowerCase());

      const matchesDepartment =
        departmentFilter === 'All Departments' || record.department === departmentFilter;

      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  const isEmpty = filteredAttendance.length === 0;

  // Mock handlers — no routing/modals exist yet for this module.
  const handleMarkAttendance = () => console.log('Mark attendance clicked');
  const handleView = (record) => console.log('View attendance record:', record.id);
  const handleEdit = (record) => console.log('Edit attendance record:', record.id);

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage employee attendance records.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAttendance}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiPlus className="h-4 w-4" />
          Mark Attendance
        </button>
      </div>

      {/* ---------------- Search & Filters ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search by employee name */}
          <div className="relative flex-1">
            <label htmlFor="attendance-search" className="sr-only">
              Search attendance by employee name
            </label>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="attendance-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by employee name..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {/* Department filter */}
          <div className="relative sm:w-56">
            <label htmlFor="attendance-department-filter" className="sr-only">
              Filter by department
            </label>
            <select
              id="attendance-department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option>All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status filter */}
          <div className="relative sm:w-44">
            <label htmlFor="attendance-status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="attendance-status-filter"
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

      {/* ---------------- Attendance Table ---------------- */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {isEmpty ? (
          // ---------------- Empty State ----------------
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiClock className="h-6 w-6 text-gray-400 dark:text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No attendance records found
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
                Try adjusting your search term or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
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
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Check in
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Check out
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Working hours
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
                {filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    {/* Employee */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                          {getInitials(record.employeeName)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {record.employeeName}
                        </span>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                      {record.employeeId}
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {record.department}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                      {record.date}
                    </td>

                    {/* Check In */}
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {record.checkIn}
                    </td>

                    {/* Check Out */}
                    <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                      {record.checkOut}
                    </td>

                    {/* Working Hours */}
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {record.workingHours}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[record.status] || statusStyles.Absent
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    {/* Actions: View, Edit */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(record)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          aria-label={`View attendance for ${record.employeeName}`}
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(record)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                          aria-label={`Edit attendance for ${record.employeeName}`}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------- Static Pagination Footer ---------------- */}
        {!isEmpty && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {Math.min(10, filteredAttendance.length)}
              </span>
              {filteredAttendance.length > 10 ? '–10' : ''} of{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {filteredAttendance.length}
              </span>{' '}
              attendance records
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

export default AttendanceList;