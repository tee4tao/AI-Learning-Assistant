import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";

const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.DOCUMENT.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while uploading the file." }
    }
}

const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENT.GET_DOCUMENTS);
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching documents." }
    }
}

const deleteDocument = async (documentId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENT.DELETE(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while deleting the document." }
    }
}

const getDocumentById = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENT.GET_DOCUMENT_BY_ID(documentId));
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching the document." }
    }
}

const documentService = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    getDocumentById
}

export default documentService;