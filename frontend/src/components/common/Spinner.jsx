/**
 * ==========================================================
 * Enterprise AI Assistant
 * File: src/components/common/Spinner.jsx
 * ==========================================================
 */

import PropTypes from "prop-types";

function Spinner({
  size = "md",
  label = "Loading...",
  fullScreen = false,
}) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        role="status"
        aria-label={label}
        className={`
          ${sizes[size]}
          animate-spin
          rounded-full
          border-indigo-600
          border-t-transparent
        `}
      />

      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
}

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default Spinner;