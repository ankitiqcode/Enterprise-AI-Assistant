// src/components/dashboard/QuickActions.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable grid of shortcut buttons for dashboard-style "quick
 * actions" panels. Mirrors the visual spec already shipped inline in
 * Dashboard.jsx's Quick Actions block (Feature 4) — same card shell,
 * icon-tile layout, and hover lift — but generalized behind an
 * `actions` array prop instead of a hardcoded QUICK_ACTIONS constant.
 * Dashboard.jsx is NOT modified to consume this yet, per your
 * instruction.
 *
 * Each action resolves its click behavior in this priority order:
 *   1. `action.onClick`, if provided — called with no arguments,
 *      full control handed to the consumer (e.g. opening a modal
 *      instead of navigating).
 *   2. `action.path`, if provided and no onClick — navigates via
 *      react-router's useNavigate, consistent with how Sidebar.jsx
 *      and Navbar.jsx already navigate (Feature 3).
 *   3. Neither provided — button renders but does nothing on click;
 *      this is intentional rather than throwing, since a consumer
 *      may want a visually-present-but-disabled action while a
 *      feature is still pending.
 *
 * No `title` prop — unlike ActivityCard, your spec here only lists
 * an `actions` array with no heading field, so the heading (if any)
 * is left to the parent to render around this component.
 */
const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if (typeof action.onClick === 'function') {
      action.onClick();
      return;
    }
    if (action.path) {
      navigate(action.path);
    }
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
          >
            {Icon && (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.backgroundColor || 'bg-indigo-50 dark:bg-indigo-500/10'}`}
              >
                <Icon className={`h-5 w-5 ${action.color || 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
            )}
            <span className="text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      path: PropTypes.string,
      color: PropTypes.string,
      backgroundColor: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
};

QuickActions.defaultProps = {
  actions: [],
};

export default QuickActions;