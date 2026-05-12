import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";

const getAllFlashCardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching flashcard sets." }
    }
}

const getFlashCardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARD_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching the flashcard." }
    }
}

const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to review the flashcard." }
    }
}

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to star the flashcard." }
    }
}

const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while deleting the flashcard set." }
    }
}

const flashcardService = {
    getAllFlashCardSets,
    getFlashCardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet
}

export default flashcardService;