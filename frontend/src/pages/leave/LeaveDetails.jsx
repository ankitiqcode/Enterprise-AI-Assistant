import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit2,
  FiUser,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

const MOCK_LEAVES = [
  {
    id: "LEAVE-001",
    employeeName: "John Doe",
    employeeId: "EMP-001",
    department: "Engineering",
    leaveType: "Casual Leave",
    fromDate: "Jul 29, 2026",
    toDate: "Jul 30, 2026",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: "LEAVE-002",
    employeeName: "Priya Sharma",
    employeeId: "EMP-002",
    department: "Human Resources",
    leaveType: "Sick Leave",
    fromDate: "Jul 25, 2026",
    toDate: "Jul 26, 2026",
    days: 2,
    reason: "Medical appointment",
    status: "Approved",
  },
  {
    id: "LEAVE-003",
    employeeName: "Rahul Mehta",
    employeeId: "EMP-003",
    department: "Engineering",
    leaveType: "Earned Leave",
    fromDate: "Aug 02, 2026",
    toDate: "Aug 05, 2026",
    days: 4,
    reason: "Family vacation",
    status: "Pending",
  },
  {
    id: "LEAVE-004",
    employeeName: "Anita Verma",
    employeeId: "EMP-004",
    department: "Sales",
    leaveType: "Casual Leave",
    fromDate: "Jul 20, 2026",
    toDate: "Jul 20, 2026",
    days: 1,
    reason: "Personal work",
    status: "Rejected",
  },
];

const STATUS_STYLES = {
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Rejected:
    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const LeaveDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const leave =
    MOCK_LEAVES.find((item) => item.id === id) ||
    MOCK_LEAVES[0];

  const handleEdit = () => {
    navigate(`/leave/${leave.id}/edit`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate("/leave")}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Back to leave"
            title="Back"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
              Leave Details
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {leave.id}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Leave
        </button>

      </div>

      {/* Status */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Request Status
            </p>

            <div className="mt-2">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${
                  STATUS_STYLES[leave.status]
                }`}
              >
                {leave.status}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leave Type
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
              {leave.leaveType}
            </p>

          </div>

        </div>

      </div>

      {/* Employee Information */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiUser className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Employee Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employee associated with this request.
            </p>
          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Employee Name
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {leave.employeeName}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Employee ID
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {leave.employeeId}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Department
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {leave.department}
            </p>
          </div>

        </div>

      </div>

      {/* Leave Information */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiCalendar className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Leave Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dates and duration of the leave.
            </p>
          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              From Date
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {leave.fromDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              To Date
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {leave.toDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Days
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {leave.days} day{leave.days !== 1 ? "s" : ""}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Leave Type
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {leave.leaveType}
            </p>
          </div>

        </div>

      </div>

      {/* Reason */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiFileText className="h-5 w-5" />
          </div>

          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Reason
          </h2>

        </div>

        <p className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
          {leave.reason}
        </p>

      </div>

      {/* Bottom Navigation */}

      <div className="flex justify-start">

        <button
          type="button"
          onClick={() => navigate("/leave")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Leave
        </button>

      </div>

    </div>
  );
};

export default LeaveDetails;