// src/pages/Departments/DepartmentDetails.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit2,
  FiBriefcase,
  FiUser,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiFolder,
  FiPieChart,
} from 'react-icons/fi';

/**
 * DepartmentDetails.jsx — Feature 7
 *
 * Mock data only, no API calls, no backend integration, per your
 * instruction. No routing is created here — the "Back" button uses
 * useNavigate(-1), the same navigation primitive already used across
 * every other detail page (EmployeeDetails.jsx) and layout component
 * in this app, not a new route definition.
 *
 * This page assumes it will eventually receive a department id via
 * useParams() once routing to /departments/:id is wired up — for now
 * it renders a single hardcoded MOCK_DEPARTMENT record so the layout
 * can be reviewed independent of that routing decision.
 *
 * InfoCard, InfoRow, and PlaceholderCard are local, unexported
 * helpers scoped to this file only — per your instruction, no shared
 * components outside this file. They mirror the same-named helpers
 * in EmployeeDetails.jsx in shape and styling for visual consistency
 * across the app, but are independent copies, not imports, since
 * this file must be self-contained.
 */

// ---- Mock data -------------------------------------------------------

const MOCK_DEPARTMENT = {
  id: 'DEPT-001',
  name: 'Engineering',
  code: 'ENG',
  description:
    'Responsible for designing, building, and maintaining all product and platform software across the organization.',
  createdDate: 'Jan 12, 2019',
  status: 'Active',
  manager: 'Alicia Ferguson',
  managerEmail: 'alicia.ferguson@company.com',
  managerPhone: '+1 (555) 234-8890',
  totalEmployees: 86,
  activeEmployees: 81,
  openPositions: 5,
};

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

// ---- Local helper components -----------------------------------------

/** Shared card shell used by every info section on this page. */
const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-400 dark:text-gray-600" />
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
    <div className="space-y-3.5">{children}</div>
  </div>
);

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

/** Single label/value pair used inside an InfoCard. */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || '—'}</span>
  </div>
);

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InfoRow.defaultProps = {
  value: '',
};

/** Placeholder card for sections not built yet (Teams, Documents, Reports). */
const PlaceholderCard = ({ title, icon: Icon }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-400 dark:text-gray-600" />
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center dark:border-gray-800 dark:bg-gray-800/20">
      <Icon className="h-6 w-6 text-gray-300 dark:text-gray-700" />
      <p className="text-xs font-medium text-gray-400 dark:text-gray-600">
        {title} will be available soon.
      </p>
    </div>
  </div>
);

PlaceholderCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

// ---- Page -----------------------------------------------------------

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const department = MOCK_DEPARTMENT;

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back to departments list"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
              {department.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Department code:{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{department.code}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit department
        </button>
      </div>

      {/* ---------------- Profile Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-500/10">
            <FiBriefcase className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {department.name}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Code: {department.code} · Managed by {department.manager}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  statusStyles[department.status] || statusStyles.Inactive
                }`}
              >
                {department.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <FiUsers className="h-3 w-3" />
                {department.totalEmployees} employees
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Info Grid ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department Information */}
        <InfoCard title="Department information" icon={FiBriefcase}>
          <InfoRow label="Name" value={department.name} />
          <InfoRow label="Code" value={department.code} />
          <InfoRow label="Description" value={department.description} />
          <InfoRow label="Created date" value={department.createdDate} />
          <InfoRow label="Status" value={department.status} />
        </InfoCard>

        {/* Management */}
        <InfoCard title="Management" icon={FiUser}>
          <InfoRow label="Manager" value={department.manager} />
          <InfoRow label="Email" value={department.managerEmail} />
          <InfoRow label="Phone" value={department.managerPhone} />
        </InfoCard>

        {/* Statistics — spans full width on large screens since it
            has fewer, more visually distinct rows than the other
            two cards, and reads better as a wide summary strip. */}
        <InfoCard title="Statistics" icon={FiBarChart2}>
          <InfoRow label="Total employees" value={department.totalEmployees} />
          <InfoRow label="Active employees" value={department.activeEmployees} />
          <InfoRow label="Open positions" value={department.openPositions} />
        </InfoCard>
      </div>

      {/* ---------------- Future Summaries ---------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PlaceholderCard title="Teams" icon={FiUsers} />
        <PlaceholderCard title="Documents" icon={FiFolder} />
        <PlaceholderCard title="Reports" icon={FiPieChart} />
      </div>
    </div>
  );
};

export default DepartmentDetails;