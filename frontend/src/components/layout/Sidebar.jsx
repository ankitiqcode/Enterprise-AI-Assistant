/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/components/layout/Sidebar.jsx
 * ==========================================================
 */

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiFolder,
  FiMessageSquare,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronsLeft,
  FiChevronsRight,
  FiX,
  FiCpu,
} from "react-icons/fi";

import useAuth from "../../hooks/useAuth";
import SidebarItem from "./SidebarItem";

// ==========================================================
// Main Navigation
// ==========================================================

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: FiHome,
    roles: ["admin", "hr", "manager", "employee"],
  },

  {
    to: "/employees",
    label: "Employees",
    icon: FiUsers,
    roles: ["admin", "hr", "manager"],
  },

  {
    to: "/departments",
    label: "Departments",
    icon: FiBriefcase,
    roles: ["admin", "hr", "manager"],
  },

  {
    to: "/attendance",
    label: "Attendance",
    icon: FiCalendar,
    roles: ["admin", "hr", "manager"],
  },

  {
    to: "/leave",
    label: "Leave",
    icon: FiClipboard,
    roles: ["admin", "hr", "manager", "employee"],
  },

  {
    to: "/documents",
    label: "Documents",
    icon: FiFolder,
    roles: ["admin", "hr", "manager"],
  },

  {
    to: "/ai-assistant",
    label: "AI Assistant",
    icon: FiMessageSquare,
    roles: ["admin", "hr", "manager", "employee"],
  },
];

// ==========================================================
// Footer Navigation
// ==========================================================

const FOOTER_ITEMS = [
  {
    to: "/profile",
    label: "Profile",
    icon: FiUser,
    roles: ["admin", "hr", "manager", "employee"],
  },

  {
    to: "/settings",
    label: "Settings",
    icon: FiSettings,
    roles: ["admin", "hr", "manager", "employee"],
  },
];

// ==========================================================
// Sidebar Component
// ==========================================================

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const {
    user,
    logout,
    hasRole,
  } = useAuth();

  const navigate = useNavigate();

  // ========================================================
  // Logout
  // ========================================================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ========================================================
  // Role-Based Navigation
  // ========================================================

  const visibleNavItems =
    NAV_ITEMS.filter((item) =>
      hasRole(item.roles)
    );

  const visibleFooterItems =
    FOOTER_ITEMS.filter((item) =>
      hasRole(item.roles)
    );

  // ========================================================
  // User Initials
  // ========================================================

  const getUserInitials = () => {
    if (!user) {
      return "U";
    }

    // Support first_name / last_name
    const firstName =
      user.first_name ||
      user.name?.split(" ")?.[0] ||
      "";

    const lastName =
      user.last_name ||
      user.name?.split(" ")?.slice(1).join(" ") ||
      "";

    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`
        .trim()
        .toUpperCase();

    return initials || "U";
  };

  // ========================================================
  // Render
  // ========================================================

  return (
    <>
      {/* ====================================================
          Mobile Overlay
      ==================================================== */}

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onCloseMobile}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      {/* ====================================================
          Sidebar
      ==================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-all
          duration-300
          ease-in-out
          dark:border-gray-800
          dark:bg-gray-900

          ${
            isCollapsed
              ? "lg:w-20"
              : "lg:w-64"
          }

          ${
            isMobileOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ==================================================
            Logo Header
        ================================================== */}

        <div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-gray-200
            px-4
            dark:border-gray-800
          "
        >

          {/* Logo */}

          <div
            className={`
              flex
              items-center
              gap-3
              overflow-hidden
              transition-all
              duration-200

              ${
                isCollapsed
                  ? "lg:w-0 lg:opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-600
                to-violet-600
                text-white
                shadow-lg
              "
            >
              <FiCpu className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <h2
                className="
                  whitespace-nowrap
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                Enterprise AI
              </h2>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Assistant
              </p>

            </div>

          </div>

          {/* Desktop Collapse */}

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="
              hidden
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-700
              lg:flex
              dark:text-gray-400
              dark:hover:bg-gray-800
              dark:hover:text-white
            "
          >

            {isCollapsed ? (
              <FiChevronsRight className="h-5 w-5" />
            ) : (
              <FiChevronsLeft className="h-5 w-5" />
            )}

          </button>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-700
              lg:hidden
              dark:text-gray-400
              dark:hover:bg-gray-800
              dark:hover:text-white
            "
          >
            <FiX className="h-5 w-5" />
          </button>

        </div>

        {/* ==================================================
            Main Navigation
        ================================================== */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            px-3
            py-4
          "
        >

          {visibleNavItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}

        </nav>

        {/* ==================================================
            Footer Navigation
        ================================================== */}

        <div
          className="
            space-y-1
            border-t
            border-gray-200
            px-3
            py-4
            dark:border-gray-800
          "
        >

          {visibleFooterItems.map(
            (item) => (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            )
          )}

          {/* Logout */}

          <SidebarItem
            icon={FiLogOut}
            label="Logout"
            onClick={handleLogout}
            isCollapsed={isCollapsed}
          />

        </div>

        {/* ==================================================
            User Card
        ================================================== */}

        {!isCollapsed && (
          <div
            className="
              border-t
              border-gray-200
              p-3
              dark:border-gray-800
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                rounded-lg
                bg-gray-50
                px-3
                py-3
                dark:bg-gray-800/60
              "
            >

              {/* Avatar */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {getUserInitials()}
              </div>

              {/* User Details */}

              <div className="min-w-0 flex-1">

                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {user?.first_name ||
                    user?.name ||
                    "User"}

                  {user?.last_name
                    ? ` ${user.last_name}`
                    : ""}
                </p>

                <p
                  className="
                    truncate
                    text-xs
                    capitalize
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {user?.role || "User"}
                </p>

              </div>

            </div>

          </div>
        )}

      </aside>
    </>
  );
};

// ==========================================================
// PropTypes
// ==========================================================

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  isMobileOpen: PropTypes.bool.isRequired,
  onCloseMobile: PropTypes.func.isRequired,
};

// ==========================================================
// Export
// ==========================================================

export default Sidebar;