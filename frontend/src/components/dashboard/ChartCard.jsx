// src/components/dashboard/ChartCard.jsx
import PropTypes from 'prop-types';
import { FiBarChart2 } from 'react-icons/fi';

/**
 * Reusable container card for chart-based dashboard panels.
 *
 * Mirrors the visual spec already shipped inline in Dashboard.jsx's
 * "Performance Overview" block (Feature 4) — same card shell, dashed
 * placeholder area, and centered icon/message — but generalized
 * behind `title` / `subtitle` / `actions` props, with the chart body
 * itself passed as `children`. Dashboard.jsx is NOT modified to
 * consume this yet, per your instruction.
 *
 * This component deliberately knows nothing about any charting
 * library. It only renders whatever is passed as `children` inside
 * a consistently-sized body region — dropping in Recharts, Chart.js,
 * or any other library later means passing that library's chart
 * component as `children`, with zero changes needed here.
 */
const ChartCard = ({ title, subtitle, children, actions }) => {
  const hasContent = Boolean(children);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header row: title/subtitle on the left, optional actions
          (e.g. a period selector, export button) on the right.
          Wraps on narrow screens instead of clipping actions. */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      {/* Body region — fixed min-height keeps the card's footprint
          stable whether it's showing the placeholder or a real chart,
          so the dashboard grid doesn't reflow when charts are wired
          in later. */}
      {hasContent ? (
        <div className="min-h-[16rem] sm:min-h-[20rem]">{children}</div>
      ) : (
        <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 sm:min-h-[20rem] dark:border-gray-800 dark:bg-gray-800/20">
          <FiBarChart2 className="h-9 w-9 text-gray-300 dark:text-gray-700" />
          <p className="mt-3 text-sm font-medium text-gray-400 dark:text-gray-600">
            Charts will be integrated later.
          </p>
        </div>
      )}
    </div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
};

ChartCard.defaultProps = {
  subtitle: '',
  children: null,
  actions: null,
};

export default ChartCard;