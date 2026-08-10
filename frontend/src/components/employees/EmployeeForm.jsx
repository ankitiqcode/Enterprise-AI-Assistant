/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/components/employees/EmployeeForm.jsx
 * ==========================================================
 */

import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { FiLoader } from "react-icons/fi";

// ==========================================================
// Options
// ==========================================================

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Human Resources",
  "Sales",
  "Marketing",
  "Finance",
];

const STATUS_OPTIONS = [
  "Active",
  "Inactive",
];

// ==========================================================
// Common Classes
// ==========================================================

const inputBaseClasses =
  "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-800 dark:focus:text-gray-100";
const getFieldBorderClasses = (hasError) =>
  hasError
    ? "border-red-300 focus:border-red-500 dark:border-red-800"
    : "border-gray-200 focus:border-indigo-500 dark:border-gray-700";

// ==========================================================
// Employee Form
// ==========================================================

const EmployeeForm = ({
  defaultValues,
  onSubmit,
  loading,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id:
        defaultValues.employee_id ?? "",

      first_name:
        defaultValues.first_name ?? "",

      last_name:
        defaultValues.last_name ?? "",

      email:
        defaultValues.email ?? "",

      phone:
        defaultValues.phone ?? "",

      department:
        defaultValues.department ?? "",

      designation:
        defaultValues.designation ?? "",

      salary:
        defaultValues.salary ?? "",

      status:
        defaultValues.status ?? "Active",
    },
  });

  const isEditMode = Boolean(defaultValues.id);

  // ========================================================
  // Submit
  // ========================================================

  const submitForm = (data) => {
    const formattedData = {
      employee_id: data.employee_id.trim(),
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      department: data.department,
      designation: data.designation.trim(),
      salary: Number(data.salary),
      status: data.status,
    };

    onSubmit(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      {/* ==================================================
          Employee ID
      ================================================== */}

      <div>
        <label
          htmlFor="employee-id"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Employee ID
        </label>

        <input
          id="employee-id"
          type="text"
          placeholder="e.g. EMP001"
          aria-invalid={
            errors.employee_id
              ? "true"
              : "false"
          }
          className={`${inputBaseClasses} ${getFieldBorderClasses(
            errors.employee_id
          )}`}
          {...register("employee_id", {
            required: "Employee ID is required",
            minLength: {
              value: 2,
              message:
                "Employee ID must be at least 2 characters",
            },
            maxLength: {
              value: 20,
              message:
                "Employee ID cannot exceed 20 characters",
            },
          })}
        />

        {errors.employee_id && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.employee_id.message}
          </p>
        )}
      </div>

      {/* ==================================================
          First Name + Last Name
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* First Name */}

        <div>
          <label
            htmlFor="employee-first-name"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            First Name
          </label>

          <input
            id="employee-first-name"
            type="text"
            placeholder="e.g. Rahul"
            aria-invalid={
              errors.first_name
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.first_name
            )}`}
            {...register("first_name", {
              required: "First name is required",
              minLength: {
                value: 2,
                message:
                  "First name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message:
                  "First name cannot exceed 100 characters",
              },
            })}
          />

          {errors.first_name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}

        <div>
          <label
            htmlFor="employee-last-name"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Last Name
          </label>

          <input
            id="employee-last-name"
            type="text"
            placeholder="e.g. Sharma"
            aria-invalid={
              errors.last_name
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.last_name
            )}`}
            {...register("last_name", {
              required: "Last name is required",
              minLength: {
                value: 2,
                message:
                  "Last name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message:
                  "Last name cannot exceed 100 characters",
              },
            })}
          />

          {errors.last_name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.last_name.message}
            </p>
          )}
        </div>

      </div>

      {/* ==================================================
          Email + Phone
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Email */}

        <div>
          <label
            htmlFor="employee-email"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>

          <input
            id="employee-email"
            type="email"
            placeholder="e.g. rahul@company.com"
            aria-invalid={
              errors.email
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.email
            )}`}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value:
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <label
            htmlFor="employee-phone"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </label>

          <input
            id="employee-phone"
            type="tel"
            placeholder="e.g. 9876543210"
            aria-invalid={
              errors.phone
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.phone
            )}`}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message:
                  "Enter a valid phone number",
              },
            })}
          />

          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

      </div>

      {/* ==================================================
          Department + Designation
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Department */}

        <div>
          <label
            htmlFor="employee-department"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Department
          </label>

          <select
            id="employee-department"
            aria-invalid={
              errors.department
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.department
            )}`}
            {...register("department", {
              required:
                "Please select a department",
            })}
          >
            <option value="">
              Select department
            </option>

            {DEPARTMENT_OPTIONS.map(
              (department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              )
            )}
          </select>

          {errors.department && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Designation */}

        <div>
          <label
            htmlFor="employee-designation"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Designation
          </label>

          <input
            id="employee-designation"
            type="text"
            placeholder="e.g. Software Engineer"
            aria-invalid={
              errors.designation
                ? "true"
                : "false"
            }
            className={`${inputBaseClasses} ${getFieldBorderClasses(
              errors.designation
            )}`}
            {...register("designation", {
              required: "Designation is required",
              minLength: {
                value: 2,
                message:
                  "Designation must be at least 2 characters",
              },
            })}
          />

          {errors.designation && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.designation.message}
            </p>
          )}
        </div>

      </div>

      {/* ==================================================
          Salary
      ================================================== */}

      <div>
        <label
          htmlFor="employee-salary"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Salary
        </label>

        <input
          id="employee-salary"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 50000"
          aria-invalid={
            errors.salary
              ? "true"
              : "false"
          }
          className={`${inputBaseClasses} ${getFieldBorderClasses(
            errors.salary
          )}`}
          {...register("salary", {
            required: "Salary is required",
            min: {
              value: 0,
              message:
                "Salary cannot be negative",
            },
          })}
        />

        {errors.salary && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.salary.message}
          </p>
        )}
      </div>

      {/* ==================================================
          Status
      ================================================== */}

      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </span>

        <div className="flex gap-3">

          {STATUS_OPTIONS.map(
            (option) => (
              <label
                key={option}
                className="
                  flex flex-1 cursor-pointer
                  items-center justify-center gap-2
                  rounded-lg border border-gray-200
                  px-4 py-2.5
                  text-sm font-medium
                  text-gray-600
                  transition-colors
                  has-[:checked]:border-indigo-500
                  has-[:checked]:bg-indigo-50
                  has-[:checked]:text-indigo-700
                  dark:border-gray-700
                  dark:text-gray-400
                  dark:has-[:checked]:border-indigo-500
                  dark:has-[:checked]:bg-indigo-500/10
                  dark:has-[:checked]:text-indigo-400
                "
              >

                <input
                  type="radio"
                  value={option}
                  className="sr-only"
                  {...register("status", {
                    required:
                      "Status is required",
                  })}
                />

                {option}

              </label>
            )
          )}

        </div>

        {errors.status && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.status.message}
          </p>
        )}
      </div>

      {/* ==================================================
          Actions
      ================================================== */}

      <div className="flex items-center justify-end gap-3 pt-2">

        {/* Cancel */}

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="
            rounded-lg
            border border-gray-200
            px-4 py-2.5
            text-sm font-medium
            text-gray-700
            transition-colors
            hover:bg-gray-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:border-gray-700
            dark:text-gray-300
            dark:hover:bg-gray-800
          "
        >
          Cancel
        </button>

        {/* Save */}

        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-indigo-600
            px-4 py-2.5
            text-sm font-medium
            text-white
            shadow-sm
            transition-colors
            hover:bg-indigo-700
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >

          {loading && (
            <FiLoader className="h-4 w-4 animate-spin" />
          )}

          {loading
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Add Employee"}

        </button>

      </div>
    </form>
  );
};

// ==========================================================
// PropTypes
// ==========================================================

EmployeeForm.propTypes = {
  defaultValues: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    employee_id: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    department: PropTypes.string,
    designation: PropTypes.string,
    salary: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    status: PropTypes.string,
  }),

  onSubmit: PropTypes.func.isRequired,

  loading: PropTypes.bool,

  onCancel: PropTypes.func,
};

// ==========================================================
// Default Props
// ==========================================================

EmployeeForm.defaultProps = {
  defaultValues: {},
  loading: false,
  onCancel: () => {},
};

export default EmployeeForm;