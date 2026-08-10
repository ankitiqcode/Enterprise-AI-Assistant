import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  onClick,
  isCollapsed = false,
  badge,
}) => {
  const baseClasses =
    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200";

  const activeClasses =
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

  const inactiveClasses =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white";

  const renderContent = (isActive = false) => (
    <>
      {/* Active Indicator */}
      <span
        className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 transition-opacity duration-200 dark:bg-indigo-400 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Icon */}
      <Icon
        className={`h-5 w-5 shrink-0 transition-colors ${
          isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-300"
        }`}
      />

      {/* Label */}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        {label}
      </span>

      {/* Badge */}
      {badge && !isCollapsed && (
        <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      {/* Tooltip */}
      {isCollapsed && (
        <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100 dark:bg-gray-700">
          {label}
        </span>
      )}
    </>
  );

  // Action Button (Logout etc.)
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${inactiveClasses} w-full`}
      >
        {renderContent()}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {({ isActive }) => renderContent(isActive)}
    </NavLink>
  );
};

SidebarItem.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default SidebarItem;