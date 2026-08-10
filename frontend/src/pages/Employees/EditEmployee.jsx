import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import EmployeeForm from "../../components/employees/EmployeeForm";

const MOCK_EMPLOYEES = [
  {
    id: "EMP-001",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    role: "Software Engineer",
    status: "Active",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    department: "Human Resources",
    role: "HR Manager",
    status: "Active",
  },
  {
    id: "EMP-003",
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    department: "Engineering",
    role: "Frontend Developer",
    status: "Active",
  },
  {
    id: "EMP-004",
    name: "Anita Verma",
    email: "anita.verma@example.com",
    department: "Finance",
    role: "Accountant",
    status: "Inactive",
  },
];

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = MOCK_EMPLOYEES.find(
    (item) => String(item.id) === String(id)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Employee not found
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The employee you are trying to edit could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (formData) => {
    setIsSubmitting(true);

    console.log("Employee updated:", {
      id: employee.id,
      ...formData,
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Edit employee
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the employee information below.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <EmployeeForm
          defaultValues={employee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditEmployee;