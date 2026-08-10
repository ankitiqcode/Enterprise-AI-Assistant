// src/components/charts/PerformanceChart.jsx
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * PerformanceChart.jsx — Feature 12
 *
 * Renders ONLY the chart itself — no card shell, no title, no
 * padding/border/shadow — per your instruction. It's designed to be
 * dropped directly into ChartCard.jsx's `children` slot, which
 * already provides all of that surrounding chrome.
 *
 * Uses a single Recharts <ComposedChart> (Line + Bar + Bar) rather
 * than three separate chart components — this satisfies "LineChart
 * for Attendance and BarChart for Leave Requests/New Employees" while
 * staying visually clean as one unified chart instead of three
 * stacked ones. Two Y axes are used (left: percentage for
 * Attendance, right: count for Leave Requests / New Employees) since
 * those two value ranges (88–95 vs 7–16) would otherwise squash the
 * bars flat on a shared scale.
 *
 * Mock data lives in this file (MOCK_PERFORMANCE_DATA, also named-
 * exported) since no backend/API integration exists yet. A `data`
 * prop is accepted so a parent (Dashboard.jsx) can pass a filtered
 * slice of this same array for a period selector, without this
 * component needing to know anything about "periods" itself — it
 * only ever renders whatever data array it's given.
 */

export const MOCK_PERFORMANCE_DATA = [
  { month: 'Jan', attendance: 88, leaveRequests: 12, newEmployees: 8 },
  { month: 'Feb', attendance: 91, leaveRequests: 9, newEmployees: 12 },
  { month: 'Mar', attendance: 89, leaveRequests: 14, newEmployees: 10 },
  { month: 'Apr', attendance: 93, leaveRequests: 8, newEmployees: 15 },
  { month: 'May', attendance: 95, leaveRequests: 11, newEmployees: 13 },
  { month: 'Jun', attendance: 92, leaveRequests: 7, newEmployees: 16 },
];

// Color palettes for light vs dark mode. Recharts renders to SVG, so
// it can't pick up Tailwind's `dark:` utility classes directly —
// these values are chosen to have equivalent contrast/legibility to
// the rest of the app's existing dark-mode palette (same grays used
// throughout every other component in this app).
const PALETTES = {
  light: {
    grid: '#e5e7eb', // gray-200
    axisText: '#6b7280', // gray-500
    attendanceLine: '#4f46e5', // indigo-600
    leaveBar: '#f59e0b', // amber-500
    newEmployeesBar: '#10b981', // emerald-500
    tooltipBg: '#ffffff',
    tooltipBorder: '#e5e7eb',
    tooltipText: '#111827',
  },
  dark: {
    grid: '#1f2937', // gray-800
    axisText: '#9ca3af', // gray-400
    attendanceLine: '#818cf8', // indigo-400
    leaveBar: '#fbbf24', // amber-400
    newEmployeesBar: '#34d399', // emerald-400
    tooltipBg: '#111827', // gray-900
    tooltipBorder: '#1f2937',
    tooltipText: '#f3f4f6',
  },
};

/**
 * Detects the app's current dark-mode state and stays in sync with
 * it. Covers both common Tailwind strategies since this project's
 * dark-mode classes were built "ready" for either a manual `dark`
 * class on <html> (most likely, given every component so far pairs
 * light/dark utility classes rather than relying on OS-level
 * `prefers-color-scheme` alone) or the OS-level media query as a
 * fallback — a MutationObserver watches for the class, matchMedia
 * watches for the OS preference, whichever fires first is honored.
 */
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () =>
      document.documentElement.classList.contains('dark') ||
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateFromClass = () => setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver(updateFromClass);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const updateFromMedia = (e) => {
      // Only defer to the OS preference if no manual class is set.
      if (!root.classList.contains('dark') && !root.classList.contains('light')) {
        setIsDark(e.matches);
      }
    };
    mediaQuery?.addEventListener('change', updateFromMedia);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener('change', updateFromMedia);
    };
  }, []);

  return isDark;
};

const PerformanceChart = ({ data = MOCK_PERFORMANCE_DATA }) => {
  const isDark = useIsDarkMode();
  const palette = isDark ? PALETTES.dark : PALETTES.light;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="month"
          tick={{ fill: palette.axisText, fontSize: 12 }}
          axisLine={{ stroke: palette.grid }}
          tickLine={false}
        />

        {/* Left axis — Attendance, shown as a percentage */}
        <YAxis
          yAxisId="left"
          tick={{ fill: palette.axisText, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          width={40}
        />

        {/* Right axis — Leave Requests / New Employees, raw counts */}
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: palette.axisText, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: palette.tooltipBg,
            border: `1px solid ${palette.tooltipBorder}`,
            borderRadius: '0.75rem',
            fontSize: '0.8rem',
          }}
          labelStyle={{ color: palette.tooltipText, fontWeight: 600 }}
          itemStyle={{ color: palette.tooltipText }}
        />

        <Legend
          wrapperStyle={{ fontSize: '0.8rem', color: palette.axisText }}
          iconType="circle"
        />

        <Bar
          yAxisId="right"
          dataKey="leaveRequests"
          name="Leave Requests"
          fill={palette.leaveBar}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
        <Bar
          yAxisId="right"
          dataKey="newEmployees"
          name="New Employees"
          fill={palette.newEmployeesBar}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="attendance"
          name="Attendance"
          stroke={palette.attendanceLine}
          strokeWidth={2.5}
          dot={{ r: 3.5, strokeWidth: 0, fill: palette.attendanceLine }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;