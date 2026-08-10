// src/pages/Documents/EditDocument.jsx
import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FiArrowLeft,
  FiAlertCircle,
  FiFile,
  FiFileText,
  FiImage,
  FiUploadCloud,
  FiX,
  FiLoader,
} from 'react-icons/fi';

/**
 * EditDocument.jsx — Feature 10 (final file)
 *
 * No backend integration, no API calls, no axios, no service
 * imports, no modal — mock data only. Reads the document id from
 * the URL via useParams() and looks it up against a local mock
 * array, same lookup pattern as DocumentDetails.jsx.
 *
 * File replacement is optional here (unlike UploadDocument.jsx,
 * where a file was strictly required). Three states are modeled:
 *  1. No new file selected -> the existing file's name/size (from
 *     mock data) is displayed as-is, and "keep the existing file
 *     information" is satisfied by simply not touching it.
 *  2. A new file is selected -> it's validated (type + size) exactly
 *     like UploadDocument.jsx's dropzone, and shown as the pending
 *     replacement.
 *  3. Removing a pending *new* selection reverts back to state 1
 *     (showing the original file again) — the original file itself
 *     is never removable on its own, since your spec doesn't
 *     describe a "no file" end state for an existing document.
 *
 * This file does not import or modify UploadDocument.jsx — the
 * dropzone markup is intentionally re-implemented locally rather
 * than shared, per "No external components required" /
 * "Do NOT modify UploadDocument.jsx".
 */

// ---- Mock data -------------------------------------------------------

const MOCK_DOCUMENTS = [
  {
    id: 'DOC-001',
    name: 'Employee Handbook.pdf',
    type: 'Policy',
    uploadedBy: 'Admin',
    employee: '',
    description: 'Company employee handbook and workplace policies.',
    status: 'Active',
    fileSize: '2.4 MB',
  },
  {
    id: 'DOC-002',
    name: 'Q2 Financial Report.xlsx',
    type: 'Report',
    uploadedBy: 'Sneha Kapoor',
    employee: '',
    description: 'Quarterly financial summary for internal review.',
    status: 'Active',
    fileSize: '1.1 MB',
  },
  {
    id: 'DOC-003',
    name: 'Vendor Agreement - Softpro.pdf',
    type: 'Contract',
    uploadedBy: 'Rachel Ortiz',
    employee: '',
    description: 'Signed vendor agreement with Softpro India Computer Technologies.',
    status: 'Active',
    fileSize: '840 KB',
  },
  {
    id: 'DOC-004',
    name: 'John Doe - Offer Letter.pdf',
    type: 'Employee Document',
    uploadedBy: 'Priya Sharma',
    employee: 'John Doe',
    description: 'Signed offer letter for the Senior Developer role.',
    status: 'Active',
    fileSize: '312 KB',
  },
  {
    id: 'DOC-005',
    name: 'Leave Policy 2025.docx',
    type: 'Policy',
    uploadedBy: 'Admin',
    employee: '',
    description: 'Superseded leave policy, kept for reference.',
    status: 'Archived',
    fileSize: '456 KB',
  },
  {
    id: 'DOC-006',
    name: 'Anita Verma - ID Proof.jpg',
    type: 'Employee Document',
    uploadedBy: 'Anita Verma',
    employee: 'Anita Verma',
    description: 'Government-issued ID proof submitted during onboarding.',
    status: 'Active',
    fileSize: '2.9 MB',
  },
];

const EMPLOYEE_OPTIONS = ['John Doe', 'Priya Sharma', 'Rahul Mehta', 'Anita Verma', 'Karan Malhotra'];

const UPLOADED_BY_OPTIONS = ['Admin', 'John Doe', 'Priya Sharma', 'Rahul Mehta', 'Anita Verma', 'Karan Malhotra'];

const DOCUMENT_TYPE_OPTIONS = ['Policy', 'Report', 'Contract', 'Employee Document', 'Other'];

const STATUS_OPTIONS = ['Active', 'Archived'];

const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'png', 'jpg', 'jpeg'];
const ACCEPTED_ATTR = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',');
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const inputBaseClasses =
  'w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500';

const getFieldBorderClasses = (hasError) =>
  hasError
    ? 'border-red-300 focus:border-red-500 dark:border-red-800'
    : 'border-gray-200 focus:border-indigo-500 dark:border-gray-700';

const formatFileSize = (bytes) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

const getFileExtension = (fileName = '') => fileName.split('.').pop()?.toLowerCase();

// Same file-icon bucketing logic used across the Documents module.
const getFileIconMeta = (fileName = '') => {
  const extension = getFileExtension(fileName);
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

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const document = MOCK_DOCUMENTS.find((item) => item.id === id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      documentName: document?.name ?? '',
      documentType: document?.type ?? '',
      uploadedBy: document?.uploadedBy ?? '',
      employee: document?.employee ?? '',
      description: document?.description ?? '',
      status: document?.status ?? 'Active',
    },
  });

  const watchedDocumentType = watch('documentType');
  const isEmployeeDocument = watchedDocumentType === 'Employee Document';

  const validateFile = (file) => {
    const extension = getFileExtension(file.name);
    if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
      return `Unsupported file type. Accepted types: ${ACCEPTED_EXTENSIONS.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File exceeds the maximum size of 10 MB.';
    }
    return '';
  };

  const applyNewFile = (file) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setNewFile(null);
      return;
    }
    setFileError('');
    setNewFile(file);
  };

  const handleFileInputChange = (e) => {
    applyNewFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isSubmitting) return;
    applyNewFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // Clears a *pending new* selection only, reverting the display back
  // to the original document's existing file — does not touch or
  // remove the original file itself.
  const handleClearNewFile = () => {
    setNewFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // No API integration yet — logs the updated payload (including the
  // replacement file if one was selected, otherwise noting the
  // existing file is unchanged), simulates a network delay, then
  // navigates back to the documents list. Once PUT/PATCH
  // /documents/{id} is confirmed, only this function body changes.
  const onFormSubmit = (formData) => {
    setIsSubmitting(true);
    console.log('Updated document:', {
      id: document.id,
      ...formData,
      file: newFile || `(unchanged) ${document.name}`,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/documents');
    }, 1200);
  };

  const handleCancel = () => navigate(-1);

  // ---------------- Not Found State ----------------
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FiAlertCircle className="h-7 w-7 text-gray-400 dark:text-gray-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Document not found
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The document you're trying to edit doesn't exist or may have been removed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    );
  }

  const existingFileIcon = getFileIconMeta(document.name);

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
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
            Edit Document
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update document information and metadata.
          </p>
        </div>
      </div>

      {/* ---------------- Form Card ---------------- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-5">
          {/* Document Name */}
          <div>
            <label
              htmlFor="edit-document-name"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Document name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-document-name"
              type="text"
              disabled={isSubmitting}
              aria-invalid={errors.documentName ? 'true' : 'false'}
              aria-describedby={errors.documentName ? 'edit-document-name-error' : undefined}
              className={`${inputBaseClasses} ${getFieldBorderClasses(errors.documentName)}`}
              {...register('documentName', { required: 'Document name is required' })}
            />
            {errors.documentName && (
              <p id="edit-document-name-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.documentName.message}
              </p>
            )}
          </div>

          {/* Document Type + Uploaded By side by side */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-document-type"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Document type <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-document-type"
                disabled={isSubmitting}
                aria-invalid={errors.documentType ? 'true' : 'false'}
                aria-describedby={errors.documentType ? 'edit-document-type-error' : undefined}
                className={`${inputBaseClasses} ${getFieldBorderClasses(errors.documentType)} appearance-none`}
                {...register('documentType', { required: 'Please select a document type' })}
              >
                {DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.documentType && (
                <p id="edit-document-type-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.documentType.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-uploaded-by"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Uploaded by <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-uploaded-by"
                disabled={isSubmitting}
                aria-invalid={errors.uploadedBy ? 'true' : 'false'}
                aria-describedby={errors.uploadedBy ? 'edit-uploaded-by-error' : undefined}
                className={`${inputBaseClasses} ${getFieldBorderClasses(errors.uploadedBy)} appearance-none`}
                {...register('uploadedBy', { required: 'Please select who uploaded this document' })}
              >
                {UPLOADED_BY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.uploadedBy && (
                <p id="edit-uploaded-by-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.uploadedBy.message}
                </p>
              )}
            </div>
          </div>

          {/* Employee — required only when Document Type is
              "Employee Document"; disabled but visible otherwise so
              the layout doesn't jump. */}
          <div>
            <label
              htmlFor="edit-employee"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Employee{' '}
              {isEmployeeDocument ? (
                <span className="text-red-500">*</span>
              ) : (
                <span className="text-gray-400">(optional)</span>
              )}
            </label>
            <select
              id="edit-employee"
              disabled={isSubmitting || !isEmployeeDocument}
              aria-invalid={errors.employee ? 'true' : 'false'}
              aria-describedby={errors.employee ? 'edit-employee-error' : undefined}
              className={`${inputBaseClasses} ${getFieldBorderClasses(errors.employee)} appearance-none`}
              {...register('employee', {
                validate: (value) => {
                  if (!isEmployeeDocument) return true;
                  return Boolean(value) || 'Please select the related employee';
                },
              })}
            >
              <option value="">
                {isEmployeeDocument ? 'Select employee' : 'Not applicable for this document type'}
              </option>
              {EMPLOYEE_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.employee && (
              <p id="edit-employee-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.employee.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="edit-description"
              rows={3}
              disabled={isSubmitting}
              className={`${inputBaseClasses} ${getFieldBorderClasses(false)} resize-none`}
              {...register('description')}
            />
          </div>

          {/* Status */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status <span className="text-red-500">*</span>
            </span>
            <div className="flex gap-3">
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 dark:border-gray-700 dark:text-gray-400 dark:has-[:checked]:border-indigo-500 dark:has-[:checked]:bg-indigo-500/10 dark:has-[:checked]:text-indigo-400"
                >
                  <input
                    type="radio"
                    value={option}
                    disabled={isSubmitting}
                    className="sr-only"
                    {...register('status', { required: 'Please select a status' })}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.status && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.status.message}</p>
            )}
          </div>

          {/* Replace File — optional. Shows the existing file's info
              unless a new file has been selected to replace it. */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Replace file <span className="text-gray-400">(optional)</span>
            </span>

            <input
              ref={fileInputRef}
              type="file"
              id="edit-file-input"
              accept={ACCEPTED_ATTR}
              disabled={isSubmitting}
              onChange={handleFileInputChange}
              className="sr-only"
            />

            {newFile ? (
              // ---------------- Pending replacement preview ----------------
              <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-3 dark:border-indigo-500/30 dark:bg-indigo-500/5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FiFile className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {newFile.name}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      {formatFileSize(newFile.size)} · Will replace the current file
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearNewFile}
                  disabled={isSubmitting}
                  aria-label="Cancel file replacement"
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Existing file info — always shown when there is no
                    pending replacement, satisfying "keep the existing
                    file information". */}
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${existingFileIcon.className}`}>
                    <existingFileIcon.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {document.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {document.fileSize} · Current file
                    </p>
                  </div>
                </div>

                {/* Dropzone to select a replacement */}
                <label
                  htmlFor="edit-file-input"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800/20 dark:hover:border-gray-600'
                  } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <FiUploadCloud className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag &amp; drop a replacement file here
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">or click to browse</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">Maximum file size: 10 MB</p>
                </label>
              </div>
            )}

            {fileError && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Actions */}
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
              {isSubmitting && <FiLoader className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocument;