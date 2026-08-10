// src/pages/Profile/Profile.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiSave,
} from 'react-icons/fi';
import useAuth from "../../hooks/useAuth";

/**
 * Profile.jsx — Feature 13
 *
 * No API calls anywhere in this file, per your instruction — this
 * page reads real data from useAuth() (the only genuinely live data
 * source available: id, email, first_name, last_name, role,
 * is_active, confirmed by your /auth/me contract), but every save
 * action (profile edit, password change) is mock/client-side only.
 *
 * Deliberately NOT simulating a fake network delay (no setTimeout +
 * loading spinner) on either form here, unlike EmployeeForm.jsx /
 * DepartmentForm.jsx's pattern — your instruction explicitly says
 * "Do not implement a fake backend password change," which I read as
 * "don't simulate calling an endpoint that doesn't exist" for either
 * form on this page, not just the password one. Success messages
 * appear immediately after client-side validation passes.
 *
 * Reuses the established input styling conventions (inputBaseClasses
 * / getFieldBorderClasses / card shell) from EmployeeForm.jsx /
 * DepartmentForm.jsx without importing or modifying those files —
 * same visual language, independent implementation, per "Do not
 * modify EmployeeForm.jsx or other unrelated forms."
 */

const inputBaseClasses =
  'w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';

const getFieldBorderClasses = (hasError) =>
  hasError
    ? 'border-red-300 focus:border-red-500 dark:border-red-800'
    : 'border-gray-200 focus:border-indigo-500 dark:border-gray-700';

const getInitials = (first = '', last = '') =>
  `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '—';

const Profile = () => {
  const { user } = useAuth();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ---- Profile information form ----
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      firstName: user?.first_name ?? '',
      lastName: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: '', // Not part of the confirmed /auth/me shape — starts empty.
    },
  });

  const onProfileSubmit = () => {
    // Client-side only — no confirmed update endpoint exists yet.
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  // ---- Change password form ----
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const watchedNewPassword = watchPassword('newPassword');

  const onPasswordSubmit = () => {
    // No real password change happens here — validation only, then a
    // mock success message, per your explicit instruction.
    setPasswordSuccess(true);
    resetPasswordForm();
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ---------------- Page Header ---------------- */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information and account security.
        </p>
      </div>

      {/* ---------------- Profile Summary Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
            {getInitials(user?.first_name, user?.last_name)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FiShield className="h-3 w-3" />
                {user?.role}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  user?.is_active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Edit Profile Information ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-2">
          <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Profile information
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-first-name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First name <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-first-name"
                type="text"
                aria-invalid={profileErrors.firstName ? 'true' : 'false'}
                className={`${inputBaseClasses} ${getFieldBorderClasses(profileErrors.firstName)}`}
                {...registerProfile('firstName', { required: 'First name is required' })}
              />
              {profileErrors.firstName && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {profileErrors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-last-name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-last-name"
                type="text"
                aria-invalid={profileErrors.lastName ? 'true' : 'false'}
                className={`${inputBaseClasses} ${getFieldBorderClasses(profileErrors.lastName)}`}
                {...registerProfile('lastName', { required: 'Last name is required' })}
              />
              {profileErrors.lastName && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {profileErrors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-email"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="profile-email"
                  type="email"
                  aria-invalid={profileErrors.email ? 'true' : 'false'}
                  className={`${inputBaseClasses} ${getFieldBorderClasses(profileErrors.email)} pl-10`}
                  {...registerProfile('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                  })}
                />
              </div>
              {profileErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {profileErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="profile-phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  className={`${inputBaseClasses} ${getFieldBorderClasses(false)} pl-10`}
                  {...registerProfile('phone')}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {profileSuccess && (
              <p
                role="status"
                aria-live="polite"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <FiCheckCircle className="h-4 w-4" />
                Profile updated
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <FiSave className="h-4 w-4" />
              Save changes
            </button>
          </div>
        </form>
      </div>

      {/* ---------------- Change Password Section ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-2">
          <FiLock className="h-4 w-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Change password
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="profile-current-password"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current password <span className="text-red-500">*</span>
            </label>
            <input
              id="profile-current-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={passwordErrors.currentPassword ? 'true' : 'false'}
              className={`${inputBaseClasses} ${getFieldBorderClasses(passwordErrors.currentPassword)}`}
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-new-password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New password <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={passwordErrors.newPassword ? 'true' : 'false'}
                className={`${inputBaseClasses} ${getFieldBorderClasses(passwordErrors.newPassword)}`}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-confirm-password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm new password <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={passwordErrors.confirmPassword ? 'true' : 'false'}
                className={`${inputBaseClasses} ${getFieldBorderClasses(passwordErrors.confirmPassword)}`}
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === watchedNewPassword || 'Passwords do not match',
                })}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {passwordSuccess && (
              <p
                role="status"
                aria-live="polite"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <FiCheckCircle className="h-4 w-4" />
                Password changed
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <FiLock className="h-4 w-4" />
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;