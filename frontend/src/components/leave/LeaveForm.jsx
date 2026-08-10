// src/components/leave/LeaveForm.jsx
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FiLoader, FiCalendar } from 'react-icons/fi';

/**
 * Reusable Apply/Edit leave request form, built on react-hook-form.
 *
 * UI/mock implementation only — no axios, no service, no API calls,
 * per your instruction. Everything lives inside this one file, no
 * additional components extracted.
 *
 * Three pieces of cross-field behavior, all driven by watch():
 *  1. Calculated Days — a read-only derived value computed from the
 *     live fromDate/toDate values, recalculated on every render as
 *     either field changes (not just at submit time).
 *  2. To Date's `min` attribute is set dynamically to the current
 *     From Date value, so the native date picker itself prevents
 *     selecting an earlier date where the browser supports it.
 *  3. To Date validation independently re-checks "not before From
 *     Date" via a custom `validate` function, since the `min`
 *     attribute alone doesn't guarantee correctness (users can still
 *     type/paste an invalid date in some browsers, and validation
 *     must exist as the real source of truth regardless of UI
 *     affordances).
 *
 * This goes beyond AttendanceForm.jsx's single conditionally-required
 * field — here, three fields interact together, not just one field's
 * required-ness toggling off another's value.
 */

const EMPLOYEE_OPTIONS = ['John Doe', 'Priya Sharma', 'Rahul Mehta', 'Anita Verma', 'Karan Malhotra'];

const LEAVE_TYPE_OPTIONS = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Emergency Leave', 'Unpaid Leave'];

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

const inputBaseClasses =
  'w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';

const getFieldBorderClasses = (hasError) =>
  hasError
    ? 'border-red-300 focus:border-red-500 dark:border-red-800'
    : 'border-gray-200 focus:border-indigo-500 dark:border-gray-700';

/**
 * Calculates inclusive leave days between two ISO date strings
 * ("2026-08-10" to "2026-08-11" -> 2 days). Returns null when either
 * date is missing or invalid, or when toDate precedes fromDate —
 * callers treat null as "not calculable yet" rather than showing a
 * negative or nonsensical number.
 */
const calculateLeaveDays = (fromDate, toDate) => {
  if (!fromDate || !toDate) return null;

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;

  const diffMs = to.getTime() - from.getTime();
  if (diffMs < 0) return null;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round(diffMs / MS_PER_DAY) + 1;
};

const LeaveForm = ({ defaultValues, onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee: defaultValues.employee ?? '',
      leaveType: defaultValues.leaveType ?? '',
      fromDate: defaultValues.fromDate ?? '',
      toDate: defaultValues.toDate ?? '',
      reason: defaultValues.reason ?? '',
      status: defaultValues.status ?? 'Pending',
    },
  });

  // Live-watch both dates to drive the calculated Days field and
  // To Date's dynamic min/validation.
  const watchedFromDate = watch('fromDate');
  const watchedToDate = watch('toDate');

  const calculatedDays = calculateLeaveDays(watchedFromDate, watchedToDate);
  const daysDisplayValue = calculatedDays !== null ? `${calculatedDays} day${calculatedDays === 1 ? '' : 's'}` : '—';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Employee */}
      <div>
        <label
          htmlFor="leave-employee"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Employee <span className="text-red-500">*</span>
        </label>
        <select
          id="leave-employee"
          disabled={loading}
          aria-invalid={errors.employee ? 'true' : 'false'}
          aria-describedby={errors.employee ? 'leave-employee-error' : undefined}
          className={`${inputBaseClasses} ${getFieldBorderClasses(errors.employee)} appearance-none`}
          defaultValue=""
          {...register('employee', { required: 'Please select an employee' })}
        >
          <option value="" disabled>
            Select employee
          </option>
          {EMPLOYEE_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {errors.employee && (
          <p id="leave-employee-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.employee.message}
          </p>
        )}
      </div>

      {/* Leave Type + Status side by side on larger screens */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="leave-type"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Leave type <span className="text-red-500">*</span>
          </label>
          <select
            id="leave-type"
            disabled={loading}
            aria-invalid={errors.leaveType ? 'true' : 'false'}
            aria-describedby={errors.leaveType ? 'leave-type-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.leaveType)} appearance-none`}
            defaultValue=""
            {...register('leaveType', { required: 'Please select a leave type' })}
          >
            <option value="" disabled>
              Select leave type
            </option>
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.leaveType && (
            <p id="leave-type-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.leaveType.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="leave-status"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="leave-status"
            disabled={loading}
            aria-invalid={errors.status ? 'true' : 'false'}
            aria-describedby={errors.status ? 'leave-status-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.status)} appearance-none`}
            {...register('status', { required: 'Please select a status' })}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.status && (
            <p id="leave-status-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      {/* From Date + To Date side by side on larger screens */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="leave-from-date"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            From date <span className="text-red-500">*</span>
          </label>
          <input
            id="leave-from-date"
            type="date"
            disabled={loading}
            aria-invalid={errors.fromDate ? 'true' : 'false'}
            aria-describedby={errors.fromDate ? 'leave-from-date-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.fromDate)}`}
            {...register('fromDate', { required: 'From date is required' })}
          />
          {errors.fromDate && (
            <p
              id="leave-from-date-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400"
            >
              {errors.fromDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="leave-to-date"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            To date <span className="text-red-500">*</span>
          </label>
          <input
            id="leave-to-date"
            type="date"
            disabled={loading}
            min={watchedFromDate || undefined}
            aria-invalid={errors.toDate ? 'true' : 'false'}
            aria-describedby={errors.toDate ? 'leave-to-date-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.toDate)}`}
            {...register('toDate', {
              required: 'To date is required',
              validate: (value) => {
                if (!watchedFromDate || !value) return true;
                const from = new Date(watchedFromDate);
                const to = new Date(value);
                return to.getTime() >= from.getTime() || 'To date cannot be before From date';
              },
            })}
          />
          {errors.toDate && (
            <p id="leave-to-date-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.toDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Calculated Days — read-only, derived from From/To Date */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Number of days
        </span>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
          <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          {daysDisplayValue}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label
          htmlFor="leave-reason"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          id="leave-reason"
          rows={4}
          disabled={loading}
          placeholder="Briefly explain the reason for this leave request..."
          aria-invalid={errors.reason ? 'true' : 'false'}
          aria-describedby={errors.reason ? 'leave-reason-error' : undefined}
          className={`${inputBaseClasses} ${getFieldBorderClasses(errors.reason)} resize-none`}
          {...register('reason', {
            required: 'Reason is required',
            minLength: { value: 5, message: 'Please provide a bit more detail' },
          })}
        />
        {errors.reason && (
          <p id="leave-reason-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.reason.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-gray-900"
        >
          {loading && <FiLoader className="h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Leave Request'}
        </button>
      </div>
    </form>
  );
};

LeaveForm.propTypes = {
  defaultValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    employee: PropTypes.string,
    leaveType: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
    reason: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

LeaveForm.defaultProps = {
  defaultValues: {},
  loading: false,
};

export default LeaveForm;