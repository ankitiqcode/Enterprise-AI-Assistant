// ==========================================================
// Enterprise AI Assistant
// File: src/pages/dashboard/Dashboard.jsx
// Dynamic HR Dashboard
// ==========================================================

import { useEffect, useMemo, useState } from "react";

import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiUserPlus,
  FiCalendar,
  FiFolder,
  FiClipboard,
  FiMessageSquare,
  FiArrowUp,
  FiArrowDown,
  FiBell,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

// IMPORTANT:
// useAuth.js exports default, so DO NOT use { useAuth }
import useAuth from "../../hooks/useAuth";

import ChartCard from "../../components/dashboard/ChartCard";

import PerformanceChart, {
  MOCK_PERFORMANCE_DATA,
} from "../../components/charts/PerformanceChart";

import employeeService from "../../services/employeeService";
import leaveService from "../../services/leaveService";

// ==========================================================
// Helpers
// ==========================================================

const getTodayFormatted = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ==========================================================
// Safe Array Helper
// ==========================================================

const toArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.employees)) {
    return data.employees;
  }

  if (Array.isArray(data?.leaves)) {
    return data.leaves;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// ==========================================================
// Status Helper
// ==========================================================

const getStatus = (item) =>
  String(
    item?.status ||
      item?.leave_status ||
      item?.approval_status ||
      ""
  ).toLowerCase();

// ==========================================================
// Quick Actions
// ==========================================================

const QUICK_ACTIONS = [
  {
    id: "add-employee",
    label: "Add Employee",
    icon: FiUserPlus,
    path: "/employees",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    roles: ["admin", "hr"],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: FiCalendar,
    path: "/attendance",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: "leave",
    label: "Leave",
    icon: FiClipboard,
    path: "/leave",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FiFolder,
    path: "/documents",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: FiMessageSquare,
    path: "/ai-assistant",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
];

// ==========================================================
// Period Options
// ==========================================================

const PERIOD_OPTIONS = [
  {
    id: "3m",
    label: "3M",
  },
  {
    id: "6m",
    label: "6M",
  },
];

// ==========================================================
// Dashboard Component
// ==========================================================

const Dashboard = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  // ========================================================
  // State
  // ========================================================

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [performancePeriod, setPerformancePeriod] =
    useState("6m");

  // ========================================================
  // Load Dashboard Data
  // ========================================================

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        employeeResponse,
        leaveResponse,
      ] = await Promise.all([
        employeeService.getAllEmployees(),
        leaveService.getAll(),
      ]);

      const employeeData = toArray(employeeResponse);
      const leaveData = toArray(leaveResponse);

      setEmployees(employeeData);
      setLeaves(leaveData);
    } catch (err) {
      console.error(
        "Failed to load dashboard data:",
        err
      );

      setError(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ========================================================
  // Initial Load
  // ========================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ========================================================
  // Statistics
  // ========================================================

  const totalEmployees = employees.length;

  // ========================================================
  // Departments
  // ========================================================

  const departmentCount = useMemo(() => {
    const departments = new Set();

    employees.forEach((employee) => {
      const department =
        employee?.department_name ||
        employee?.department?.name ||
        employee?.department ||
        employee?.department_id;

      if (
        department !== null &&
        department !== undefined
      ) {
        departments.add(String(department));
      }
    });

    return departments.size;
  }, [employees]);

  // ========================================================
  // Pending Leaves
  // ========================================================

  const pendingLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const status = getStatus(leave);

      return (
        status === "pending" ||
        status === "pending_approval" ||
        status === "pending approval"
      );
    }).length;
  }, [leaves]);

  // ========================================================
  // Attendance Data Availability
  // ========================================================

  const hasAttendanceData = useMemo(() => {
    return employees.some((employee) => {
      return Boolean(
        employee?.attendance_date ||
          employee?.date ||
          employee?.check_in_date ||
          employee?.attendance_status ||
          employee?.today_status
      );
    });
  }, [employees]);

  // ========================================================
  // Present Today
  // ========================================================

  const presentToday = useMemo(() => {
    if (!hasAttendanceData) {
      return 0;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const records = employees.filter((employee) => {
      const attendanceDate =
        employee?.attendance_date ||
        employee?.date ||
        employee?.check_in_date;

      const attendanceStatus = String(
        employee?.attendance_status ||
          employee?.today_status ||
          employee?.status ||
          ""
      ).toLowerCase();

      return (
        attendanceDate === today &&
        (
          attendanceStatus === "present" ||
          attendanceStatus === "checked_in" ||
          attendanceStatus === "checked-in"
        )
      );
    });

    return records.length;
  }, [employees, hasAttendanceData]);

  // ========================================================
  // Attendance Percentage
  // ========================================================

  const attendancePercentage = useMemo(() => {
    if (!hasAttendanceData || !totalEmployees) {
      return null;
    }

    return `${Math.round(
      (presentToday / totalEmployees) * 100
    )}% attendance`;
  }, [
    hasAttendanceData,
    presentToday,
    totalEmployees,
  ]);

  // ========================================================
  // Role Based Quick Actions
  // ========================================================

  const visibleQuickActions = useMemo(() => {
    return QUICK_ACTIONS.filter(
      (action) =>
        !action.roles ||
        action.roles.includes(
          String(user?.role || "").toLowerCase()
        )
    );
  }, [user?.role]);

  // ========================================================
  // Statistics Cards
  // ========================================================

  const stats = [
    {
      id: "employees",
      label: "Total Employees",
      value: loading ? "..." : totalEmployees,
      trend: loading
        ? ""
        : totalEmployees
        ? "Live database count"
        : "No employees found",
      trendDirection: totalEmployees
        ? "up"
        : "flat",
      icon: FiUsers,
      accent:
        "from-indigo-500 to-indigo-600",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-500/10",
      iconColor:
        "text-indigo-600 dark:text-indigo-400",
    },

    {
      id: "departments",
      label: "Departments",
      value: loading ? "..." : departmentCount,
      trend: loading
        ? ""
        : departmentCount
        ? "From employee records"
        : "No departments found",
      trendDirection: departmentCount
        ? "up"
        : "flat",
      icon: FiBriefcase,
      accent:
        "from-violet-500 to-violet-600",
      iconBg:
        "bg-violet-50 dark:bg-violet-500/10",
      iconColor:
        "text-violet-600 dark:text-violet-400",
    },

    {
      id: "present",
      label: "Present Today",
      value: loading
        ? "..."
        : hasAttendanceData
        ? presentToday
        : "—",
      trend: loading
        ? ""
        : hasAttendanceData
        ? attendancePercentage ||
          "No employees found"
        : "Attendance data unavailable",
      trendDirection: hasAttendanceData
        ? presentToday > 0
          ? "up"
          : "flat"
        : "flat",
      icon: FiCheckCircle,
      accent:
        "from-emerald-500 to-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
    },

    {
      id: "leaves",
      label: "Pending Leaves",
      value: loading
        ? "..."
        : pendingLeaves,
      trend: loading
        ? ""
        : pendingLeaves > 0
        ? `${pendingLeaves} need review`
        : "No pending requests",
      trendDirection:
        pendingLeaves > 0
          ? "down"
          : "flat",
      icon: FiClock,
      accent:
        "from-amber-500 to-amber-600",
      iconBg:
        "bg-amber-50 dark:bg-amber-500/10",
      iconColor:
        "text-amber-600 dark:text-amber-400",
    },
  ];

  // ========================================================
  // Performance Chart
  // ========================================================

  const performanceData =
    performancePeriod === "3m"
      ? MOCK_PERFORMANCE_DATA.slice(-3)
      : MOCK_PERFORMANCE_DATA;

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          Welcome Header
      ==================================================== */}

      <div className="flex flex-col gap-1">

        <div className="flex items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Welcome back,{" "}
              {user?.first_name ||
                user?.firstName ||
                "there"}{" "}
              👋
            </h1>

            <div className="mt-1 flex flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-3">

              <span>
                {getTodayFormatted()}
              </span>

              <span className="hidden text-gray-300 sm:inline dark:text-gray-700">
                •
              </span>

              <span>
                Here's what's happening across
                your organization today.
              </span>

            </div>
          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={() =>
              loadDashboardData(true)
            }
            disabled={refreshing}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >

            <FiRefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

      </div>

      {/* ====================================================
          Error
      ==================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">

          <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">

            <p className="font-medium">
              Unable to load some dashboard data
            </p>

            <p className="mt-1">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadDashboardData()
            }
            className="font-medium underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* ====================================================
          Statistics
      ==================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          let TrendIcon = null;

          if (
            stat.trendDirection === "up"
          ) {
            TrendIcon = FiArrowUp;
          }

          if (
            stat.trendDirection === "down"
          ) {
            TrendIcon = FiArrowDown;
          }

          const trendColor =
            stat.trendDirection === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : stat.trendDirection === "down"
              ? "text-red-500 dark:text-red-400"
              : "text-gray-400 dark:text-gray-500";

          return (
            <div
              key={stat.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >

              {/* Decorative circle */}

              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.accent} opacity-[0.07] transition-opacity duration-200 group-hover:opacity-[0.12]`}
              />

              <div className="relative flex items-start justify-between">

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                >

                  <Icon
                    className={`h-5 w-5 ${stat.iconColor}`}
                  />

                </div>

              </div>

              <p className="relative mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>

              <p className="relative mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>

              {stat.trend && (
                <div
                  className={`relative mt-3 flex items-center gap-1 text-xs font-medium ${trendColor}`}
                >

                  {TrendIcon && (
                    <TrendIcon className="h-3.5 w-3.5" />
                  )}

                  <span>
                    {stat.trend}
                  </span>

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* ====================================================
          Quick Actions
      ==================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          Quick actions
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">

          {visibleQuickActions.map(
            (action) => {

              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() =>
                    navigate(action.path)
                  }
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                >

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg}`}
                  >

                    <Icon
                      className={`h-5 w-5 ${action.color}`}
                    />

                  </div>

                  <span className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
                    {action.label}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>

      {/* ====================================================
          Performance + Recent Activity
      ==================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Performance */}

        <div className="lg:col-span-2">

          <ChartCard
            title="Performance Overview"
            subtitle="Sample performance trends"
            actions={
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">

                {PERIOD_OPTIONS.map(
                  (option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setPerformancePeriod(
                          option.id
                        )
                      }
                      aria-pressed={
                        performancePeriod ===
                        option.id
                      }
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        performancePeriod ===
                        option.id
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                )}

              </div>
            }
          >

            <PerformanceChart
              data={performanceData}
            />

          </ChartCard>

        </div>

        {/* Recent Activity */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
            Recent activity
          </h2>

          <div className="flex min-h-[250px] items-center justify-center text-center">

            <div>

              <FiClock className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-700" />

              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                No recent activity available
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
                Activity will appear here once
                an activity log is connected.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================
          Dashboard Information
      ==================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-4 flex items-center gap-2">

          <FiBell className="h-5 w-5 text-gray-400 dark:text-gray-600" />

          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Dashboard information
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Employees */}

          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">

            <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              Employees
            </span>

            <h3 className="mt-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              Employee data is live
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              The employee count is loaded
              directly from the backend database.
            </p>

          </div>

          {/* Leave */}

          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">

            <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              Leave
            </span>

            <h3 className="mt-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              Leave requests
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Pending leave requests are calculated
              from the leave records.
            </p>

          </div>

          {/* AI */}

          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">

            <span className="inline-block rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              AI
            </span>

            <h3 className="mt-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
              Enterprise AI Assistant
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Ask questions about uploaded company
              documents and HR information.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/ai-assistant")
              }
              className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400"
            >
              Open AI Assistant
              <FiArrowRight className="h-3 w-3" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;