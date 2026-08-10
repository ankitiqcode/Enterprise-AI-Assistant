// ==========================================================
// Enterprise AI Assistant
// File: src/pages/documents/DocumentsList.jsx
// ==========================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFile,
  FiFileText,
  FiImage,
  FiRefreshCw,
} from "react-icons/fi";

import documentService from "../../services/documentService";

// ==========================================================
// Helpers
// ==========================================================

const formatDate = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) {
    return "—";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const getFileExtension = (filename = "") => {
  return filename
    .split(".")
    .pop()
    ?.toLowerCase() || "";
};

const getFileIconMeta = (fileName = "") => {
  const extension = getFileExtension(fileName);

  const documentTypes = ["pdf", "doc", "docx"];

  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
  ];

  if (documentTypes.includes(extension)) {
    return {
      icon: FiFileText,
      className:
        "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    };
  }

  if (imageTypes.includes(extension)) {
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

// ==========================================================
// Component
// ==========================================================

const DocumentsList = () => {
  const navigate = useNavigate();

  // ========================================================
  // State
  // ========================================================

  const [documents, setDocuments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  // ========================================================
  // Load Documents
  // ========================================================

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await documentService.getAll();

      const documentsData =
        response?.documents || [];

      setDocuments(documentsData);
    } catch (err) {
      console.error(
        "Failed to load documents:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to load documents.";

      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // Initial API Call
  // ========================================================

  useEffect(() => {
    loadDocuments();
  }, []);

  // ========================================================
  // Upload
  // ========================================================

  const handleUploadDocument = () => {
    navigate("/documents/upload");
  };

  // ========================================================
  // View
  // ========================================================

  const handleView = (doc) => {
    navigate(`/documents/${doc.id}`);
  };

  // ========================================================
  // Edit
  // ========================================================

  const handleEdit = (doc) => {
    navigate(`/documents/${doc.id}/edit`);
  };

  // ========================================================
  // Reindex
  // ========================================================

  const handleReindex = async (doc) => {
    try {
      setActionLoading(`reindex-${doc.id}`);
      setError("");

      await documentService.reindex(doc.id);

      await loadDocuments();
    } catch (err) {
      console.error(
        "Failed to reindex document:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to reindex document.";

      setError(String(message));
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================================
  // Delete
  // ========================================================

  const handleDelete = async (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${doc.original_filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${doc.id}`);
      setError("");

      await documentService.remove(doc.id);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (item) => item.id !== doc.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete document:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to delete document.";

      setError(String(message));
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================================
  // Filtering
  // ========================================================

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      const fileName =
        doc.original_filename ||
        doc.filename ||
        "";

      const uploadedBy =
        String(doc.uploaded_by || "");

      const id = String(doc.id || "");

      const matchesSearch =
        search === "" ||
        fileName.toLowerCase().includes(search) ||
        uploadedBy.toLowerCase().includes(search) ||
        id.toLowerCase().includes(search);

      let matchesStatus = true;

      if (statusFilter === "Indexed") {
        matchesStatus = doc.is_indexed === true;
      }

      if (statusFilter === "Not Indexed") {
        matchesStatus = doc.is_indexed === false;
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    documents,
    searchTerm,
    statusFilter,
  ]);

  // ========================================================
  // Render
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
            Documents
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage company documents and employee files.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUploadDocument}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FiPlus className="h-4 w-4" />
          Upload Document
        </button>

      </div>

      {/* ==================================================
          Error
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ==================================================
          Search + Filters
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Search */}

          <div className="relative flex-1">

            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by document name or ID..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

          </div>

          {/* Status */}

          <div className="relative sm:w-52">

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-9 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option>All Status</option>
              <option>Indexed</option>
              <option>Not Indexed</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={loadDocuments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

        </div>

      </div>

      {/* ==================================================
          Table
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        {loading ? (

          <div className="flex items-center justify-center py-16">

            <FiRefreshCw className="h-6 w-6 animate-spin text-indigo-600" />

            <span className="ml-3 text-sm text-gray-500">
              Loading documents...
            </span>

          </div>

        ) : filteredDocuments.length === 0 ? (

          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FiFile className="h-6 w-6 text-gray-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No documents found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Upload a document to get started.
              </p>
            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-left">

              <thead>

                <tr className="border-b border-gray-200 dark:border-gray-800">

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Document
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Uploaded By
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Size
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Index Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                {filteredDocuments.map((doc) => {

                  const {
                    icon: FileIcon,
                    className: iconClassName,
                  } = getFileIconMeta(
                    doc.original_filename ||
                    doc.filename
                  );

                  const isReindexing =
                    actionLoading ===
                    `reindex-${doc.id}`;

                  const isDeleting =
                    actionLoading ===
                    `delete-${doc.id}`;

                  return (

                    <tr
                      key={doc.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >

                      {/* Document */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
                          >
                            <FileIcon className="h-4 w-4" />
                          </div>

                          <div>

                            <p className="max-w-[300px] truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {doc.original_filename ||
                                doc.filename}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              ID: {doc.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Uploaded By */}

                      <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        User #{doc.uploaded_by}
                      </td>

                      {/* Date */}

                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(doc.created_at)}
                      </td>

                      {/* Size */}

                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(doc.file_size)}
                      </td>

                      {/* Index Status */}

                      <td className="px-5 py-3.5">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            doc.is_indexed
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}
                        >
                          {doc.is_indexed
                            ? "Indexed"
                            : "Not Indexed"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-3.5">

                        <div className="flex items-center justify-end gap-1">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(doc)
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title="View Document"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(doc)
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                            title="Edit Document"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>

                          {/* Reindex */}

                          <button
                            type="button"
                            onClick={() =>
                              handleReindex(doc)
                            }
                            disabled={
                              isReindexing ||
                              isDeleting
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
                            title="Reindex Document"
                          >
                            <FiRefreshCw
                              className={`h-4 w-4 ${
                                isReindexing
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(doc)
                            }
                            disabled={
                              isReindexing ||
                              isDeleting
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete Document"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

        {/* Footer */}

        {!loading &&
          filteredDocuments.length > 0 && (

            <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {filteredDocuments.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {documents.length}
                </span>{" "}
                documents
              </p>

            </div>

          )}

      </div>

    </div>
  );
};

export default DocumentsList;