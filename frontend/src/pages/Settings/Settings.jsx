// src/pages/Settings/Settings.jsx
import { useState } from 'react';
import {
  FiSun,
  FiMoon,
  FiMonitor,
  FiBell,
  FiUser,
  FiGlobe,
  FiCheckCircle,
  FiSave,
} from 'react-icons/fi';

/**
 * Settings.jsx — Feature 13
 *
 * Local component state only, no backend/API integration, no new
 * theme library — per your instruction. The Appearance section
 * toggles the SAME mechanism this app's existing dark mode already
 * relies on: a `dark` class on <html>. This was confirmed by
 * inspecting PerformanceChart.jsx's useIsDarkMode hook, which reads
 * document.documentElement.classList.contains('dark') as its primary
 * signal. Toggling that class directly is not a new library and not
 * backend integration — it's the existing convention, made
 * interactive. "System" clears the manual class so the app falls
 * back to the OS-level prefers-color-scheme, matching that same
 * hook's fallback behavior exactly.
 *
 * This preference is intentionally NOT persisted (no localStorage) —
 * "Use local component state only" is read literally here, so the
 * choice resets to whatever was already active on next page load.
 * Flagged clearly in the report below since this is a real UX
 * limitation worth knowing about.
 *
 * Notification and Account preference sections are local toggle/
 * select state only, with no effect outside this page — there's
 * nothing in the rest of the app yet that reads a notification
 * preference, so these are UI-only for now, consistent with every
 * other module's "mock/local behavior" approach before a backend
 * contract exists.
 */

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: FiSun },
  { id: 'dark', label: 'Dark', icon: FiMoon },
  { id: 'system', label: 'System', icon: FiMonitor },
];

/** Small local toggle switch — not extracted to a shared file, since
 * only this page uses it and your instruction limits this feature to
 * exactly two new files. */
const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const [themePreference, setThemePreference] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    leaveUpdates: true,
    attendanceAlerts: false,
    weeklySummary: true,
  });

  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [accountSaved, setAccountSaved] = useState(false);

  const handleThemeChange = (themeId) => {
    setThemePreference(themeId);
    const root = document.documentElement;

    if (themeId === 'dark') {
      root.classList.add('dark');
    } else if (themeId === 'light') {
      root.classList.remove('dark');
    } else {
      // System — defer to OS preference, matching the fallback logic
      // already used elsewhere in this app (PerformanceChart.jsx).
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', Boolean(prefersDark));
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAccountPreferences = (e) => {
    e.preventDefault();
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ---------------- Page Header ---------------- */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your appearance, notifications, and account preferences.
        </p>
      </div>

      {/* ---------------- Appearance ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-1 flex items-center gap-2">
          <FiSun className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
        </div>
        <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">
          Choose how the app looks. This preference is not saved between sessions yet.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = themePreference === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleThemeChange(option.id)}
                aria-pressed={isActive}
                className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- Notifications ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-1 flex items-center gap-2">
          <FiBell className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
        </div>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          Control which updates you receive. These preferences are not connected to a
          notification service yet.
        </p>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <ToggleSwitch
            label="Email notifications"
            description="Receive important account and organization updates by email."
            checked={notifications.emailNotifications}
            onChange={() => handleNotificationToggle('emailNotifications')}
          />
          <ToggleSwitch
            label="Leave request updates"
            description="Get notified when a leave request is approved or rejected."
            checked={notifications.leaveUpdates}
            onChange={() => handleNotificationToggle('leaveUpdates')}
          />
          <ToggleSwitch
            label="Attendance alerts"
            description="Get notified about missed check-ins or check-outs."
            checked={notifications.attendanceAlerts}
            onChange={() => handleNotificationToggle('attendanceAlerts')}
          />
          <ToggleSwitch
            label="Weekly summary"
            description="A weekly digest of activity across your organization."
            checked={notifications.weeklySummary}
            onChange={() => handleNotificationToggle('weeklySummary')}
          />
        </div>
      </div>

      {/* ---------------- Account Preferences ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-1 flex items-center gap-2">
          <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Account preferences
          </h2>
        </div>
        <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">
          These settings are stored locally for this session only.
        </p>

        <form onSubmit={handleSaveAccountPreferences} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-language"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Language
              </label>
              <div className="relative">
                <FiGlobe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  id="settings-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-timezone"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Time zone
              </label>
              <select
                id="settings-timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {accountSaved && (
              <p
                role="status"
                aria-live="polite"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <FiCheckCircle className="h-4 w-4" />
                Preferences saved
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <FiSave className="h-4 w-4" />
              Save preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;