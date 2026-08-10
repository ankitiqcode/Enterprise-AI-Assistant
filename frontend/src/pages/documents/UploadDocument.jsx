// ==========================================================
// Enterprise AI Assistant
// File: src/pages/Documents/UploadDocument.jsx
// ==========================================================

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  FiArrowLeft,
  FiUploadCloud,
  FiFile,
  FiX,
  FiLoader,
} from "react-icons/fi";

import documentService from "../../services/documentService";

// ==========================================================
// Constants
// ==========================================================

// Backend supports only PDF, DOCX and TXT
const ACCEPTED_EXTENSIONS = [
  "pdf",
  "docx",
  "txt",
];

const ACCEPTED_ATTR = ACCEPTED_EXTENSIONS
  .map((ext) => `.${ext}`)
  .join(",");

const MAX_FILE_SIZE_BYTES =
  10 * 1024 * 1024;

// ==========================================================
// UI Options
// ==========================================================

const EMPLOYEE_OPTIONS = [
  "John Doe",
  "Priya Sharma",
  "Rahul Mehta",
  "Anita Verma",
  "Karan Malhotra",
];

const UPLOADED_BY_OPTIONS = [
  "Admin",
  "John Doe",
  "Priya Sharma",
  "Rahul Mehta",
  "Anita Verma",
  "Karan Malhotra",
];

const DOCUMENT_TYPE_OPTIONS = [
  "Policy",
  "Report",
  "Contract",
  "Employee Document",
  "Other",
];

// ==========================================================
// Input Styles
// ==========================================================

const inputBaseClasses =
  "w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500";

const getFieldBorderClasses = (hasError) =>
  hasError
    ? "border-red-300 focus:border-red-500 dark:border-red-800"
    : "border-gray-200 focus:border-indigo-500 dark:border-gray-700";

// ==========================================================
// Helpers
// ==========================================================

const formatFileSize = (bytes) => {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes >= 1024 * 1024) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
};

const getFileExtension = (fileName = "") => {
  return (
    fileName
      .split(".")
      .pop()
      ?.toLowerCase() || ""
  );
};

// ==========================================================
// Component
// ==========================================================

const UploadDocument = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // ========================================================
  // State
  // ========================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [fileError, setFileError] =
    useState("");

  const [isDragging, setIsDragging] =
    useState(false);

  // ========================================================
  // React Hook Form
  // ========================================================

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      documentName: "",
      documentType: "",
      uploadedBy: "",
      employee: "",
      description: "",
    },
  });

  const watchedDocumentType =
    watch("documentType");

  const isEmployeeDocument =
    watchedDocumentType ===
    "Employee Document";

  // ========================================================
  // Validate File
  // ========================================================

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    const extension =
      getFileExtension(file.name);

    if (
      !extension ||
      !ACCEPTED_EXTENSIONS.includes(
        extension
      )
    ) {
      return `Unsupported file type. Accepted types: ${ACCEPTED_EXTENSIONS.join(
        ", "
      )}`;
    }

    if (
      file.size > MAX_FILE_SIZE_BYTES
    ) {
      return "File exceeds the maximum size of 10 MB.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    return "";
  };

  // ========================================================
  // Apply Selected File
  // ========================================================

  const applySelectedFile = (file) => {
    if (!file) {
      return;
    }

    const error = validateFile(file);

    if (error) {
      setFileError(error);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  // ========================================================
  // File Input Change
  // ========================================================

  const handleFileInputChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    applySelectedFile(file);
  };

  // ========================================================
  // Drag Over
  // ========================================================

  const handleDragOver = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsDragging(true);
  };

  // ========================================================
  // Drag Leave
  // ========================================================

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ========================================================
  // Drop
  // ========================================================

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    if (isSubmitting) {
      return;
    }

    const file =
      event.dataTransfer.files?.[0];

    applySelectedFile(file);
  };

  // ========================================================
  // Remove File
  // ========================================================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================================
  // Browse File
  // ========================================================

  const handleBrowseClick = () => {
    if (!isSubmitting) {
      fileInputRef.current?.click();
    }
  };

  // ========================================================
  // Submit
  // ========================================================

  const onFormSubmit = async (
    formData
  ) => {
    if (!selectedFile) {
      setFileError(
        "Please select a file to upload."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setFileError("");

      // ----------------------------------------------------
      // Real backend upload
      // POST /documents/upload
      // ----------------------------------------------------

      console.log(
        "Uploading document:",
        {
          ...formData,
          file: selectedFile.name,
        }
      );

      await documentService.upload(
        selectedFile
      );

      // ----------------------------------------------------
      // Success
      // ----------------------------------------------------

      navigate("/documents");
    } catch (error) {
      console.error(
        "Document upload failed:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        "Failed to upload document. Please try again.";

      setFileError(
        Array.isArray(message)
          ? message
              .map(
                (item) =>
                  item?.msg ||
                  String(item)
              )
              .join(", ")
          : String(message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // Cancel
  // ========================================================

  const handleCancel = () => {
    navigate(-1);
  };

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start gap-3">

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back to documents list"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        <div>

          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Upload Document
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload and organize a company or employee document.
          </p>

        </div>

      </div>

      {/* ==================================================
          Form Card
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">

        <form
          onSubmit={handleSubmit(
            onFormSubmit
          )}
          noValidate
          className="space-y-5"
        >

          {/* ==================================================
              Document Name
          ================================================== */}

          <div>

            <label
              htmlFor="upload-document-name"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Document name{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              id="upload-document-name"
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. Employee Handbook.pdf"
              aria-invalid={
                errors.documentName
                  ? "true"
                  : "false"
              }
              className={`${inputBaseClasses} ${getFieldBorderClasses(
                errors.documentName
              )}`}
              {...register(
                "documentName",
                {
                  required:
                    "Document name is required",
                }
              )}
            />

            {errors.documentName && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {
                  errors.documentName
                    .message
                }
              </p>
            )}

          </div>

          {/* ==================================================
              Document Type + Uploaded By
          ================================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Document Type */}

            <div>

              <label
                htmlFor="upload-document-type"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Document type{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                id="upload-document-type"
                disabled={isSubmitting}
                defaultValue=""
                className={`${inputBaseClasses} ${getFieldBorderClasses(
                  errors.documentType
                )} appearance-none`}
                {...register(
                  "documentType",
                  {
                    required:
                      "Please select a document type",
                  }
                )}
              >

                <option
                  value=""
                  disabled
                >
                  Select document type
                </option>

                {DOCUMENT_TYPE_OPTIONS.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}

              </select>

              {errors.documentType && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {
                    errors.documentType
                      .message
                  }
                </p>
              )}

            </div>

            {/* Uploaded By */}

            <div>

              <label
                htmlFor="upload-uploaded-by"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Uploaded by{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                id="upload-uploaded-by"
                disabled={isSubmitting}
                defaultValue=""
                className={`${inputBaseClasses} ${getFieldBorderClasses(
                  errors.uploadedBy
                )} appearance-none`}
                {...register(
                  "uploadedBy",
                  {
                    required:
                      "Please select who is uploading",
                  }
                )}
              >

                <option
                  value=""
                  disabled
                >
                  Select uploader
                </option>

                {UPLOADED_BY_OPTIONS.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}

              </select>

              {errors.uploadedBy && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {
                    errors.uploadedBy
                      .message
                  }
                </p>
              )}

            </div>

          </div>

          {/* ==================================================
              Employee
          ================================================== */}

          <div>

            <label
              htmlFor="upload-employee"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Employee{" "}

              {isEmployeeDocument ? (
                <span className="text-red-500">
                  *
                </span>
              ) : (
                <span className="text-gray-400">
                  (optional)
                </span>
              )}

            </label>

            <select
              id="upload-employee"
              disabled={
                isSubmitting ||
                !isEmployeeDocument
              }
              defaultValue=""
              className={`${inputBaseClasses} ${getFieldBorderClasses(
                errors.employee
              )} appearance-none`}
              {...register(
                "employee",
                {
                  validate: (value) => {
                    if (
                      !isEmployeeDocument
                    ) {
                      return true;
                    }

                    return (
                      Boolean(value) ||
                      "Please select the related employee"
                    );
                  },
                }
              )}
            >

              <option value="">
                {isEmployeeDocument
                  ? "Select employee"
                  : "Not applicable for this document type"}
              </option>

              {EMPLOYEE_OPTIONS.map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}

            </select>

            {errors.employee && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {
                  errors.employee.message
                }
              </p>
            )}

          </div>

          {/* ==================================================
              Description
          ================================================== */}

          <div>

            <label
              htmlFor="upload-description"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description{" "}
              <span className="text-gray-400">
                (optional)
              </span>
            </label>

            <textarea
              id="upload-description"
              rows={3}
              disabled={isSubmitting}
              placeholder="Add any notes about this document..."
              className={`${inputBaseClasses} ${getFieldBorderClasses(
                false
              )} resize-none`}
              {...register("description")}
            />

          </div>

          {/* ==================================================
              File Upload
          ================================================== */}

          <div>

            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              File{" "}
              <span className="text-red-500">
                *
              </span>
            </span>

            {/* Hidden Input */}

            <input
              ref={fileInputRef}
              type="file"
              id="upload-file-input"
              accept={ACCEPTED_ATTR}
              disabled={isSubmitting}
              onChange={
                handleFileInputChange
              }
              className="sr-only"
            />

            {/* Selected File */}

            {selectedFile ? (

              <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">

                    <FiFile className="h-5 w-5" />

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    handleRemoveFile
                  }
                  disabled={isSubmitting}
                  aria-label="Remove selected file"
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <FiX className="h-4 w-4" />
                </button>

              </div>

            ) : (

              /* Dropzone */

              <label
                htmlFor="upload-file-input"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={
                  handleDragLeave
                }
                onClick={(event) => {
                  if (isSubmitting) {
                    event.preventDefault();
                  }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                    : "border-gray-300 bg-gray-50/50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800/20 dark:hover:border-gray-600"
                } ${
                  isSubmitting
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >

                <FiUploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-600" />

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Drag &amp; drop your file here
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-600">
                  or click to browse
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Supported: PDF, DOCX, TXT
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Maximum file size: 10 MB
                </p>

              </label>
            )}

            {/* File Error */}

            {fileError && (
              <p
                className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {fileError}
              </p>
            )}

          </div>

          {/* ==================================================
              Actions
          ================================================== */}

          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-gray-900"
            >

              {isSubmitting && (
                <FiLoader className="h-4 w-4 animate-spin" />
              )}

              {isSubmitting
                ? "Uploading..."
                : "Upload Document"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default UploadDocument;