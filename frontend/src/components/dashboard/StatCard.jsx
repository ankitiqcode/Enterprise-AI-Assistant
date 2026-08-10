// src/components/dashboard/StatCard.jsx
import PropTypes from 'prop-types';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

/**
 * Reusable statistic card for dashboard-style grids.
 *
 * This mirrors the visual spec already shipped inline in
 * Dashboard.jsx's STATS grid (Feature 4) — same corner-accent
 * treatment, spacing, and trend styling — but as a standalone,
 * prop-driven component. Dashboard.jsx is NOT modified to consume
 * this yet (left inline per your instruction); this is purely
 * available for future use once you confirm the swap.
 *
 * `icon` accepts a component reference (e.g. FiUsers), consistent
 * with how SidebarItem.jsx (Feature 3) takes icons — not a
 * pre-rendered element — so this composes the same way across the
 * codebase.
 */
const trendConfig = {
  up: {
    icon: FiArrowUp,
    className: 'text-emerald-600 dark:text-emerald-400',
  },
  down: {
    icon: FiArrowDown,
    className: 'text-red-500 dark:text-red-400',
  },
  neutral: {
    icon: FiMinus,
    className: 'text-gray-400 dark:text-gray-500',
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType,
  iconBg,
  iconColor,
}) => {
  const { icon: TrendIcon, className: trendClassName } = trendConfig[trendType];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Decorative gradient corner accent — uses iconColor so the
          accent always matches the icon regardless of which palette
          the consumer passes in, without needing a separate prop. */}
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${iconBg} opacity-40 blur-2xl transition-opacity duration-200 group-hover:opacity-60`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>

      <p className="relative mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className="relative mt-0.5 text-sm text-gray-500 dark:text-gray-400">{title}</p>

      {trend && (
        <div className={`relative mt-3 flex items-center gap-1 text-xs font-medium ${trendClassName}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  trendType: PropTypes.oneOf(['up', 'down', 'neutral']),
  iconBg: PropTypes.string,
  iconColor: PropTypes.string,
};

StatCard.defaultProps = {
  trend: '',
  trendType: 'neutral',
  iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
  iconColor: 'text-indigo-600 dark:text-indigo-400',
};

export default StatCard;