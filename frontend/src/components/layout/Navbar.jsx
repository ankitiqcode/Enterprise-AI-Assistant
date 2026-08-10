// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import useAuth from "../../hooks/useAuth";

/**
 * Sticky top bar. Purely presentational except for:
 *  - the user dropdown's open/closed state (local, UI-only)
 *  - logout, delegated to AuthContext exactly like Sidebar does
 *
 * `onMenuClick` opens the mobile drawer — DashboardLayout passes down
 * the same handler it gives Sidebar's `isMobileOpen` control, so both
 * stay in sync through one source of truth.
 *
 * Notifications are rendered as static UI only (no backend endpoint
 * confirmed yet) — wire up a real data source when that API exists.
 */
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown on outside click — standard pattern, scoped to
  // this component only so it doesn't interfere with other menus.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-gray-800 dark:bg-gray-900/80">
      {/* Mobile drawer trigger — hidden on lg since sidebar is docked there */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        aria-label="Open sidebar"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Search box — presentational only, no search logic wired yet.
          Hidden on the smallest screens to avoid crowding the mobile
          menu/avatar; reappears from sm upward. */}
      <div className="hidden flex-1 max-w-md sm:block">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, documents..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-800"
          />
        </div>
      </div>

      {/* Spacer pushes right-side controls to the edge when search is hidden (mobile) */}
      <div className="flex-1 sm:hidden" />

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Notification bell — static badge for now */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight text-gray-900 dark:text-gray-100">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs capitalize leading-tight text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
            <FiChevronDown
              className={`hidden h-4 w-4 text-gray-400 transition-transform duration-200 md:block ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown panel */}
          <div
            className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg transition-all duration-150 ease-out dark:border-gray-800 dark:bg-gray-900 ${
              isDropdownOpen
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            }`}
          >
            <div className="border-b border-gray-100 px-3.5 py-2.5 md:hidden dark:border-gray-800">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/profile');
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiUser className="h-4 w-4 text-gray-400" />
              Profile
            </button>

            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/settings');
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiSettings className="h-4 w-4 text-gray-400" />
              Settings
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Navbar;