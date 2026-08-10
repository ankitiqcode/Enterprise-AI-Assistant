// src/components/documents/DocumentTable.jsx
import PropTypes from 'prop-types';
import { FiEye, FiDownload, FiEdit2, FiTrash2, FiFile, FiFileText, FiImage } from 'react-icons/fi';

/**
 * Reusable document data table.
 *
 * Renders only the data passed via `documents` — no filtering, no
 * pagination, no mock data, no API calls, no navigation. Every
 * action (View/Download/Edit/Delete) is delegated back to the
 * caller via callback props, matching the pattern established by
 * EmployeeTable.jsx / DepartmentTable.jsx / AttendanceTable.jsx /
 * LeaveTable.jsx.
 *
 * The Document cell shows a file-type icon, the document name, and
 * the document ID beneath it — this ID-below-name treatment is new
 * to this spec; DocumentsList.jsx's inline table (Feature 10, prior
 * message) never surfaced the ID visually. DocumentsList.jsx is NOT
 * modified here, per your instruction.
 *
 * Download and Delete are intentionally inert beyond calling their
 * callback — no real file download, no confirmation dialog — the
 * parent component is fully responsible for what happens next, per
 * "Parent component controls all actions."
 */
const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

// Formats an ISO date string ("2026-08-01") into a short display
// form ("Aug 1, 2026").
const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Picks an icon + color based on the document's file extension,
// falling back to a generic file icon for unrecognized types. Same
// bucketing logic as DocumentsList.jsx's inline version, reused here
// since this spec doesn't redefine it.
const getFileIconMeta = (fileName = '') => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const pdfDocTypes = ['pdf', 'doc', 'docx'];
  const spreadsheetTypes = ['xlsx', 'xls', 'csv'];
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  if (pdfDocTypes.includes(extension)) {
    return { icon: FiFileText, className: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' };
  }
  if (spreadsheetTypes.includes(extension)) {
    return { icon: FiFileText, className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' };
  }
  if (imageTypes.includes(extension)) {
    return { icon: FiImage, className: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' };
  }
  return { icon: FiFile, className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' };
};

const DocumentTable = ({ documents, onView, onDownload, onEdit, onDelete }) => {
  const isEmpty = !documents || documents.length === 0;

  if (isEmpty) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <FiFile className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No documents found
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
              There are no documents to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Document
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Document type
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Uploaded by
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Upload date
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                File size
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {documents.map((doc) => {
              const { icon: FileIcon, className: iconClassName } = getFileIconMeta(doc.name);
              return (
                <tr
                  key={doc.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  {/* Document — icon, name, and ID below the name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
                      >
                        <FileIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">{doc.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Document Type */}
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {doc.type}
                  </td>

                  {/* Uploaded By */}
                  <td className="px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {doc.uploadedBy}
                  </td>

                  {/* Upload Date */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(doc.uploadDate)}
                  </td>

                  {/* File Size */}
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                    {doc.fileSize}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[doc.status] || statusStyles.Archived
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions: View, Download, Edit, Delete */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(doc)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          aria-label={`View ${doc.name}`}
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      )}
                      {onDownload && (
                        <button
                          type="button"
                          onClick={() => onDownload(doc)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                          aria-label={`Download ${doc.name}`}
                        >
                          <FiDownload className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(doc)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                          aria-label={`Edit ${doc.name}`}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(doc)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          aria-label={`Delete ${doc.name}`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      uploadedBy: PropTypes.string,
      uploadDate: PropTypes.string,
      fileSize: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onView: PropTypes.func,
  onDownload: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

DocumentTable.defaultProps = {
  documents: [],
  onView: null,
  onDownload: null,
  onEdit: null,
  onDelete: null,
};

export default DocumentTable;