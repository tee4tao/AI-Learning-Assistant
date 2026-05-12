import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";

const getQuizzesForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching quizzes." }
    }
}

const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching the quiz." }
    }
}

const submitQuizAnswers = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while submitting the quiz answers." }
    }
}

const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching the quiz results." }
    }
}

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while deleting the quiz." }
    }
}

const quizService = {
    getQuizzesForDocument,
    getQuizById,
    submitQuizAnswers,
    getQuizResults,
    deleteQuiz
}

export default quizService;