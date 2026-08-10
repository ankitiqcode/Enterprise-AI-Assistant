// src/pages/Employees/EmployeeDetails.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiUserCheck,
  FiClock,
  FiFileText,
  FiBarChart2,
} from 'react-icons/fi';

/**
 * EmployeeDetails.jsx — Feature 6
 *
 * Static/mock data only, no backend integration and no API calls,
 * per your instruction. No routing is created here — the "Back"
 * button uses useNavigate(-1), which navigates within whatever
 * router already exists (same navigation primitive already used in
 * Sidebar.jsx/Navbar.jsx/Dashboard.jsx), not a new route definition.
 *
 * This page assumes it will eventually receive an employee id via
 * useParams() once routing to /employees/:id is wired up — for now
 * it renders a single hardcoded MOCK_EMPLOYEE record so the layout
 * can be reviewed independent of that routing decision.
 *
 * `InfoCard` and `InfoRow` below are small local helpers scoped to
 * this file only (not exported/extracted to components/employees/,
 * since you didn't ask for that split here) — they exist purely to
 * avoid repeating the same card-shell and label/value markup six
 * times in this one file.
 */

// ---- Mock data -------------------------------------------------------

const MOCK_EMPLOYEE = {
  id: 'EMP-001',
  name: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  dob: 'March 14, 1994',
  gender: 'Male',
  department: 'Engineering',
  designation: 'Senior Developer',
  role: 'Senior Developer',
  joiningDate: 'June 3, 2021',
  employmentType: 'Full-time',
  manager: 'Alicia Ferguson',
  status: 'Active',
  address: '4517 Maple Grove Lane',
  city: 'Austin',
  state: 'Texas',
  country: 'United States',
  postalCode: '73301',
  emergencyContactName: 'Sarah Doe',
  emergencyContactRelationship: 'Spouse',
  emergencyContactPhone: '+1 (555) 987-6543',
};

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

// ---- Helpers -----------------------------------------------------------

const getInitials = (fullName = '') =>
  fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
  value: PropTypes.string,
};

InfoRow.defaultProps = {
  value: '',
};

/** Placeholder card for sections not built yet (Attendance, Leave, Documents). */
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

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const employee = MOCK_EMPLOYEE;

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back to employees list"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
              {employee.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Employee ID: <span className="font-medium text-gray-700 dark:text-gray-300">{employee.id}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit employee
        </button>
      </div>

      {/* ---------------- Profile Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
            {getInitials(employee.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {employee.name}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {employee.role} · {employee.department}
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[employee.status] || statusStyles.Inactive}`}
            >
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- Info Grid ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <InfoCard title="Personal information" icon={FiUser}>
          <InfoRow label="Full name" value={employee.name} />
          <InfoRow label="Email" value={employee.email} />
          <InfoRow label="Phone" value={employee.phone} />
          <InfoRow label="Date of birth" value={employee.dob} />
          <InfoRow label="Gender" value={employee.gender} />
        </InfoCard>

        {/* Employment Information */}
        <InfoCard title="Employment information" icon={FiBriefcase}>
          <InfoRow label="Employee ID" value={employee.id} />
          <InfoRow label="Department" value={employee.department} />
          <InfoRow label="Designation" value={employee.designation} />
          <InfoRow label="Joining date" value={employee.joiningDate} />
          <InfoRow label="Employment type" value={employee.employmentType} />
          <InfoRow label="Manager" value={employee.manager} />
        </InfoCard>

        {/* Address */}
        <InfoCard title="Address" icon={FiMapPin}>
          <InfoRow label="Address" value={employee.address} />
          <InfoRow label="City" value={employee.city} />
          <InfoRow label="State" value={employee.state} />
          <InfoRow label="Country" value={employee.country} />
          <InfoRow label="Postal code" value={employee.postalCode} />
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard title="Emergency contact" icon={FiUserCheck}>
          <InfoRow label="Contact name" value={employee.emergencyContactName} />
          <InfoRow label="Relationship" value={employee.emergencyContactRelationship} />
          <InfoRow label="Phone number" value={employee.emergencyContactPhone} />
        </InfoCard>
      </div>

      {/* ---------------- Future Summaries ---------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PlaceholderCard title="Attendance summary" icon={FiClock} />
        <PlaceholderCard title="Leave summary" icon={FiBarChart2} />
        <PlaceholderCard title="Documents summary" icon={FiFileText} />
      </div>
    </div>
  );
};

export default EmployeeDetails;