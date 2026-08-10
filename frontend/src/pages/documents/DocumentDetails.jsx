// ==========================================================
// Enterprise AI Assistant
// File: src/pages/Documents/DocumentDetails.jsx
// ==========================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit2,
  FiDownload,
  FiTrash2,
  FiFile,
  FiFileText,
  FiImage,
  FiAlertCircle,
  FiInfo,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

import documentService from "../../services/documentService";

// ==========================================================
// Helpers
// ==========================================================

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (
    bytes === null ||
    bytes === undefined ||
    bytes === 0
  ) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
};

const getFileExtension = (filename = "") => {
  return (
    filename
      .split(".")
      .pop()
      ?.toLowerCase() || ""
  );
};

const getFileIconMeta = (fileName = "") => {
  const extension =
    getFileExtension(fileName);

  const documentTypes = [
    "pdf",
    "doc",
    "docx",
    "txt",
  ];

  const spreadsheetTypes = [
    "xlsx",
    "xls",
    "csv",
  ];

  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
  ];

  if (
    documentTypes.includes(extension)
  ) {
    return {
      icon: FiFileText,
      className:
        "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    };
  }

  if (
    spreadsheetTypes.includes(extension)
  ) {
    return {
      icon: FiFileText,
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    };
  }

  if (
    imageTypes.includes(extension)
  ) {
    return {
      icon: FiImage,
      className:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    };
  }

  return {
    icon: FiFile,
    className:
      "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };
};

const getDocumentType = (filename = "") => {
  const extension =
    getFileExtension(filename);

  if (extension === "pdf") {
    return "PDF";
  }

  if (
    extension === "doc" ||
    extension === "docx"
  ) {
    return "Document";
  }

  if (
    extension === "xlsx" ||
    extension === "xls" ||
    extension === "csv"
  ) {
    return "Spreadsheet";
  }

  if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "gif" ||
    extension === "webp"
  ) {
    return "Image";
  }

  if (extension === "txt") {
    return "Text";
  }

  return "File";
};

// ==========================================================
// Info Row
// ==========================================================

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
      {label}
    </span>

    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {value || "—"}
    </span>
  </div>
);

// ==========================================================
// Page
// ==========================================================

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [viewing, setViewing] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  // ========================================================
  // Load Document
  // ========================================================

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await documentService.getById(id);

      setDocument(data);
    } catch (err) {
      console.error(
        "Failed to load document:",
        err
      );

      setError(
        err?.friendlyMessage ||
          err?.response?.data?.detail ||
          "Failed to load document."
      );

      setDocument(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDocument();
    }
  }, [id]);

  // ========================================================
  // View Document
  // ========================================================

  const handleView = async () => {
    try {
      setViewing(true);

      const blob =
        await documentService.view(id);

      const blobUrl =
        window.URL.createObjectURL(blob);

      window.open(
        blobUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(
          blobUrl
        );
      }, 60000);
    } catch (err) {
      console.error(
        "Failed to view document:",
        err
      );

      alert(
        err?.friendlyMessage ||
          "Unable to open document."
      );
    } finally {
      setViewing(false);
    }
  };

  // ========================================================
  // Download Document
  // ========================================================

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const blob =
        await documentService.view(id);

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        window.document.createElement("a");

      link.href = blobUrl;

      link.download =
        document.original_filename ||
        document.filename ||
        "document";

      window.document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (err) {
      console.error(
        "Failed to download document:",
        err
      );

      alert(
        err?.friendlyMessage ||
          "Unable to download document."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ========================================================
  // Delete Document
  // ========================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await documentService.remove(id);

      navigate("/documents");
    } catch (err) {
      console.error(
        "Failed to delete document:",
        err
      );

      alert(
        err?.friendlyMessage ||
          "Failed to delete document."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================================
  // Loading
  // ========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <FiRefreshCw className="h-5 w-5 animate-spin" />
          <span>
            Loading document...
          </span>
        </div>
      </div>
    );
  }

  // ========================================================
  // Not Found / Error
  // ========================================================

  if (!document) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FiAlertCircle className="h-7 w-7 text-gray-400 dark:text-gray-600" />
        </div>

        <div>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Document not found
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error ||
              "The document you're looking for doesn't exist or may have been removed."}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/documents")
          }
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Documents
        </button>
      </div>
    );
  }

  // ========================================================
  // Document Metadata
  // ========================================================

  const filename =
    document.original_filename ||
    document.filename ||
    "Document";

  const type =
    getDocumentType(filename);

  const fileSize =
    formatFileSize(
      document.file_size
    );

  const {
    icon: FileIcon,
    className: iconClassName,
  } = getFileIconMeta(filename);

  const statusText =
    document.is_indexed
      ? "Indexed"
      : "Not Indexed";

  const statusClass =
    document.is_indexed
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/documents")
            }
            aria-label="Go back to documents"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
              Document Details
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View document information and metadata.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/documents/${document.id}/edit`
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <FiEdit2 className="h-4 w-4" />
          Edit Document
        </button>

      </div>

      {/* ==================================================
          Document Card
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          {/* File Icon */}

          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            <FileIcon className="h-8 w-8" />
          </div>

          {/* File Info */}

          <div className="flex-1">

            <h2 className="break-all text-lg font-semibold text-gray-900 dark:text-gray-100">
              {filename}
            </h2>

            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {type} · {fileSize}
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
            >
              {statusText}
            </span>

          </div>

          {/* Actions */}

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={handleView}
              disabled={viewing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {viewing ? (
                <FiRefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FiEye className="h-4 w-4" />
              )}

              <span>
                {viewing
                  ? "Opening..."
                  : "View"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {downloading ? (
                <FiRefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FiDownload className="h-4 w-4" />
              )}

              <span>
                {downloading
                  ? "Downloading..."
                  : "Download"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              {deleting ? (
                <FiRefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FiTrash2 className="h-4 w-4" />
              )}

              <span>
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </span>
            </button>

          </div>

        </div>

        {/* =================================================
            Preview
        ================================================= */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/20">

          <div className="flex flex-col items-center justify-center py-8 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
              <FiFileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
              {filename}
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Open the uploaded file in a new browser tab.
            </p>

            <button
              type="button"
              onClick={handleView}
              disabled={viewing}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <FiEye className="h-4 w-4" />
              {viewing
                ? "Opening..."
                : "View Document"}
            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          Information Grid
      ================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Document Information */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-4 flex items-center gap-2">
            <FiFile className="h-4 w-4 text-gray-400 dark:text-gray-600" />

            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Document Information
            </h2>
          </div>

          <div className="space-y-3.5">

            <InfoRow
              label="Document ID"
              value={document.id}
            />

            <InfoRow
              label="Document Name"
              value={filename}
            />

            <InfoRow
              label="Document Type"
              value={type}
            />

            <InfoRow
              label="Uploaded By"
              value={document.uploaded_by}
            />

            <InfoRow
              label="Upload Date"
              value={formatDate(
                document.created_at
              )}
            />

            <InfoRow
              label="File Size"
              value={fileSize}
            />

            <InfoRow
              label="MIME Type"
              value={document.mime_type}
            />

            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">
                Index Status
              </span>

              <span
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
              >
                {statusText}
              </span>

            </div>

          </div>

        </div>

        {/* RAG Information */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-4 flex items-center gap-2">

            <FiInfo className="h-4 w-4 text-gray-400 dark:text-gray-600" />

            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              AI Knowledge Base
            </h2>

          </div>

          <div className="space-y-4">

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Document indexing
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {document.is_indexed
                  ? "This document has been indexed and can be used by the AI Assistant."
                  : "This document has not been indexed yet."}
              </p>
            </div>

            <div
              className={`rounded-lg p-4 ${
                document.is_indexed
                  ? "bg-emerald-50 dark:bg-emerald-500/10"
                  : "bg-amber-50 dark:bg-amber-500/10"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  document.is_indexed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {document.is_indexed
                  ? "✓ Ready for AI search"
                  : "⚠ Requires indexing"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DocumentDetails;