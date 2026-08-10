// src/components/departments/DepartmentForm.jsx
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';

/**
 * Reusable Add/Edit department form, built on react-hook-form.
 *
 * Used for both "Add Department" (defaultValues omitted/empty) and
 * "Edit Department" (defaultValues populated from an existing
 * record) — same form and validation rules apply to both; only the
 * initial values and the resulting onSubmit payload differ, which is
 * the caller's concern, not this component's. Same pattern as
 * EmployeeForm.jsx (Feature 6), but with a complete prop contract
 * supplied upfront this time — onCancel included, so no placeholder
 * gap-filling was needed here.
 *
 * No API calls, no backend integration. DepartmentsList.jsx,
 * DepartmentTable.jsx, DepartmentFilters.jsx, and
 * DepartmentPagination.jsx are NOT modified, per your instruction.
 */

const STATUS_OPTIONS = ['Active', 'Inactive'];

const inputBaseClasses =
  'w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';

const getFieldBorderClasses = (hasError) =>
  hasError
    ? 'border-red-300 focus:border-red-500 dark:border-red-800'
    : 'border-gray-200 focus:border-indigo-500 dark:border-gray-700';

const DepartmentForm = ({ defaultValues, onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultValues.name ?? '',
      code: defaultValues.code ?? '',
      manager: defaultValues.manager ?? '',
      description: defaultValues.description ?? '',
      status: defaultValues.status ?? 'Active',
    },
  });

  const isEditMode = Boolean(defaultValues.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Department Name */}
      <div>
        <label
          htmlFor="department-name"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Department name <span className="text-red-500">*</span>
        </label>
        <input
          id="department-name"
          type="text"
          placeholder="e.g. Engineering"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'department-name-error' : undefined}
          className={`${inputBaseClasses} ${getFieldBorderClasses(errors.name)}`}
          {...register('name', {
            required: 'Department name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        {errors.name && (
          <p id="department-name-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Department Code + Manager side by side on larger screens */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="department-code"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Department code <span className="text-red-500">*</span>
          </label>
          <input
            id="department-code"
            type="text"
            placeholder="e.g. ENG"
            aria-invalid={errors.code ? 'true' : 'false'}
            aria-describedby={errors.code ? 'department-code-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.code)} uppercase`}
            {...register('code', {
              required: 'Department code is required',
              maxLength: { value: 10, message: 'Code must be 10 characters or fewer' },
            })}
          />
          {errors.code && (
            <p id="department-code-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="department-manager"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Manager <span className="text-red-500">*</span>
          </label>
          <input
            id="department-manager"
            type="text"
            placeholder="e.g. Alicia Ferguson"
            aria-invalid={errors.manager ? 'true' : 'false'}
            aria-describedby={errors.manager ? 'department-manager-error' : undefined}
            className={`${inputBaseClasses} ${getFieldBorderClasses(errors.manager)}`}
            {...register('manager', { required: 'Manager is required' })}
          />
          {errors.manager && (
            <p
              id="department-manager-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400"
            >
              {errors.manager.message}
            </p>
          )}
        </div>
      </div>

      {/* Description (optional) */}
      <div>
        <label
          htmlFor="department-description"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="department-description"
          rows={4}
          placeholder="Briefly describe this department's purpose and responsibilities..."
          aria-invalid={errors.description ? 'true' : 'false'}
          className={`${inputBaseClasses} ${getFieldBorderClasses(errors.description)} resize-none`}
          {...register('description')}
        />
      </div>

      {/* Status */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status <span className="text-red-500">*</span>
        </span>
        <div className="flex gap-3">
          {STATUS_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 dark:border-gray-700 dark:text-gray-400 dark:has-[:checked]:border-indigo-500 dark:has-[:checked]:bg-indigo-500/10 dark:has-[:checked]:text-indigo-400"
            >
              <input
                type="radio"
                value={option}
                className="sr-only"
                {...register('status', { required: 'Please select a status' })}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.status && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.status.message}</p>
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
          {loading ? 'Saving...' : isEditMode ? 'Save changes' : 'Save Department'}
        </button>
      </div>
    </form>
  );
};

DepartmentForm.propTypes = {
  defaultValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
    manager: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

DepartmentForm.defaultProps = {
  defaultValues: {},
  loading: false,
};

export default DepartmentForm;