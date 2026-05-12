import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const generateFlashcards = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { documentId, ...options });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while generating flashcards." }
    }
}

const generateQuiz = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { documentId, ...options });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while generating the quiz." }
    }
}

const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId });
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while generating the summary." }
    }
}

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId, question: message });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while chatting." }
    }
}

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, { documentId, concept });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while explaining the concept." }
    }
}

const chatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching chat history." }
    }
}

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    chatHistory
}

export default aiService;