/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/App.jsx
 * ==========================================================
 */

import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================================
// Layout
// ==========================================================

import DashboardLayout from "./components/layout/DashboardLayout";

// ==========================================================
// Route Guards
// ==========================================================

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// ==========================================================
// Authentication
// ==========================================================

import Login from "./pages/auth/Login";

// ==========================================================
// Dashboard
// ==========================================================

import Dashboard from "./pages/dashboard/Dashboard";

// ==========================================================
// Employees
// ==========================================================

import EmployeesList from "./pages/Employees/EmployeesList";
import AddEmployee from "./pages/Employees/AddEmployee";
import EditEmployee from "./pages/Employees/EditEmployee";
import EmployeeDetails from "./pages/Employees/EmployeeDetails";

// ==========================================================
// Departments
// ==========================================================

import DepartmentsList from "./pages/departments/DepartmentsList";
import AddDepartment from "./pages/departments/AddDepartment";
import EditDepartment from "./pages/departments/EditDepartment";
import DepartmentDetails from "./pages/departments/DepartmentDetails";

// ==========================================================
// Attendance
// ==========================================================

import AttendanceList from "./pages/Attendance/AttendanceList";
import AddAttendance from "./pages/Attendance/AddAttendance";
import EditAttendance from "./pages/Attendance/EditAttendance";
import AttendanceDetails from "./pages/Attendance/AttendanceDetails";

// ==========================================================
// Leave
// ==========================================================

import LeaveList from "./pages/leave/LeaveList";
import AddLeave from "./pages/leave/AddLeave";
import EditLeave from "./pages/leave/EditLeave";
import LeaveDetails from "./pages/leave/LeaveDetails";

// ==========================================================
// Documents
// ==========================================================

import DocumentsList from "./pages/documents/DocumentsList";
import UploadDocument from "./pages/documents/UploadDocument";
import EditDocument from "./pages/documents/EditDocument";
import DocumentDetails from "./pages/documents/DocumentDetails";

// ==========================================================
// Profile & Settings
// ==========================================================

import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

// ==========================================================
// AI Assistant
// ==========================================================

import AIAssistant from "./pages/AIAssistant/AIAssistant";

// ==========================================================
// Other
// ==========================================================

import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// ==========================================================
// App
// ==========================================================

function App() {
  return (
    <Routes>

      {/* ====================================================
          PUBLIC ROUTES
      ==================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* ====================================================
          PROTECTED ROUTES
          User must be logged in
      ==================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* ==================================================
            DASHBOARD LAYOUT
        ================================================== */}

        <Route element={<DashboardLayout />}>

          {/* ==================================================
              DEFAULT
          ================================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ==================================================
              DASHBOARD
              Admin + HR + Manager + Employee
          ================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ==================================================
              PROFILE
              All authenticated users
          ================================================== */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* ==================================================
              SETTINGS
              All authenticated users
          ================================================== */}

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ==================================================
              AI ASSISTANT
              All authenticated users
          ================================================== */}

          <Route
            path="/ai-assistant"
            element={<AIAssistant />}
          />

          {/* ==================================================
              MANAGEMENT ROUTES
              
              Admin:
              - Full management

              HR:
              - Employee/department/attendance/leave/documents

              Manager:
              - Management access

              Employee:
              - No management access
          ================================================== */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "admin",
                  "hr",
                  "manager",
                  "employee",
                ]}
              />
            }
          >

            {/* ==================================================
                EMPLOYEES
            ================================================== */}

            <Route
              path="/employees"
              element={<EmployeesList />}
            />

            <Route
              path="/employees/add"
              element={<AddEmployee />}
            />

            <Route
              path="/employees/:id/edit"
              element={<EditEmployee />}
            />

            <Route
              path="/employees/:id"
              element={<EmployeeDetails />}
            />

            {/* ==================================================
                DEPARTMENTS
            ================================================== */}

            <Route
              path="/departments"
              element={<DepartmentsList />}
            />

            <Route
              path="/departments/add"
              element={<AddDepartment />}
            />

            <Route
              path="/departments/:id/edit"
              element={<EditDepartment />}
            />

            <Route
              path="/departments/:id"
              element={<DepartmentDetails />}
            />

            {/* ==================================================
                ATTENDANCE
            ================================================== */}

            <Route
              path="/attendance"
              element={<AttendanceList />}
            />

            <Route
              path="/attendance/add"
              element={<AddAttendance />}
            />

            <Route
              path="/attendance/:id/edit"
              element={<EditAttendance />}
            />

            <Route
              path="/attendance/:id"
              element={<AttendanceDetails />}
            />

            {/* ==================================================
                LEAVE
            ================================================== */}

            <Route
              path="/leave"
              element={<LeaveList />}
            />

            <Route
              path="/leave/add"
              element={<AddLeave />}
            />

            <Route
              path="/leave/:id/edit"
              element={<EditLeave />}
            />

            <Route
              path="/leave/:id"
              element={<LeaveDetails />}
            />

            {/* ==================================================
                DOCUMENTS
            ================================================== */}

            <Route
              path="/documents"
              element={<DocumentsList />}
            />

            <Route
              path="/documents/upload"
              element={<UploadDocument />}
            />

            <Route
              path="/documents/:id/edit"
              element={<EditDocument />}
            />

            <Route
              path="/documents/:id"
              element={<DocumentDetails />}
            />

          </Route>

        </Route>

      </Route>

      {/* ====================================================
          404
      ==================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;