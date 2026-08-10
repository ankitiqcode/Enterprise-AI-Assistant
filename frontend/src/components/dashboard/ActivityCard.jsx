// src/components/dashboard/ActivityCard.jsx
import PropTypes from 'prop-types';
import { FiInbox } from 'react-icons/fi';

/**
 * Reusable feed card for activity/notification-style lists.
 *
 * Mirrors the visual spec already shipped inline in Dashboard.jsx's
 * "Recent Activity" panel (Feature 4) — same card shell, spacing,
 * and list-item layout — but generalized behind `title` +
 * `activities` props so it can be reused for other feeds later
 * (e.g. an audit log, a notifications panel). Dashboard.jsx is NOT
 * modified to consume this yet, per your instruction.
 *
 * Each activity item supports an optional `description` (Dashboard's
 * inline version only had text + meta) and a per-item `color`
 * string — passed as a full Tailwind text-color class (e.g.
 * "text-emerald-500") rather than a semantic keyword, so any
 * consumer can pass any palette without this component needing to
 * know about every possible category in advance.
 */
const ActivityCard = ({ title, activities }) => {
  const isEmpty = !activities || activities.length === 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiInbox className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            No recent activity to show.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <li key={activity.id ?? index}>
                <div className="group flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {Icon && (
                    <Icon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${activity.color || 'text-gray-400 dark:text-gray-500'}`}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-gray-700 dark:text-gray-300">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    )}
                    {activity.time && (
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">
                        {activity.time}
                      </p>
                    )}
                  </div>
                </div>
                {/* Divider between items, skipped after the last one */}
                {index < activities.length - 1 && (
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800/60" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

ActivityCard.propTypes = {
  title: PropTypes.string.isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.elementType,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string,
      color: PropTypes.string,
    })
  ),
};

ActivityCard.defaultProps = {
  activities: [],
};

export default ActivityCard;