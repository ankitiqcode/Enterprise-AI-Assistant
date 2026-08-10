// ==========================================================
// Enterprise AI Assistant
// File: src/services/documentService.js
// ==========================================================

import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../utils/constants";

// ==========================================================
// Get All Documents
// GET /documents
// ==========================================================

const getAll = async () => {
  const response = await axiosInstance.get(
    ENDPOINTS.DOCUMENTS.BASE
  );

  return response.data;
};

// ==========================================================
// Get Document By ID
// GET /documents/{id}
// ==========================================================

const getById = async (id) => {
  const response = await axiosInstance.get(
    ENDPOINTS.DOCUMENTS.BY_ID(id)
  );

  return response.data;
};

// ==========================================================
// Upload Document
// POST /documents/upload
// ==========================================================

const upload = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosInstance.post(
    ENDPOINTS.DOCUMENTS.UPLOAD,
    formData
  );

  return response.data;
};

// ==========================================================
// View Document
// GET /documents/{id}/view
// ==========================================================

const view = async (id) => {
  const response = await axiosInstance.get(
    `${ENDPOINTS.DOCUMENTS.BASE}/${id}/view`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

// ==========================================================
// Reindex Document
// PUT /documents/{id}/reindex
// ==========================================================

const reindex = async (id) => {
  const response = await axiosInstance.put(
    ENDPOINTS.DOCUMENTS.REINDEX(id)
  );

  return response.data;
};

// ==========================================================
// Delete Document
// DELETE /documents/{id}
// ==========================================================

const remove = async (id) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.DOCUMENTS.BY_ID(id)
  );

  return response.data;
};

// ==========================================================
// Export
// ==========================================================

const documentService = {
  getAll,
  getById,
  upload,
  view,
  reindex,
  remove,
};

export default documentService;