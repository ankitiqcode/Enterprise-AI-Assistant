/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/pages/Unauthorized.jsx
 * ==========================================================
 */

import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <FiLock className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
          You don't have permission to access this page.
          <br />
          If you believe this is an error, please contact your administrator.
        </p>

        {/* Button */}
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow transition duration-200 hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;