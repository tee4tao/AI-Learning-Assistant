export const BASE_URL = 'http://localhost:8000';

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        GET_PROFILE: "/api/v1/auth/profile",
        UPDATE_PROFILE: "/api/v1/auth/profile",
        CHANGE_PASSWORD: "/api/v1/auth/change-password",
    },

    DOCUMENT: {
        UPLOAD: "/api/v1/documents/upload",
        GET_DOCUMENTS: "/api/v1/documents",
        GET_DOCUMENT_BY_ID: (id) => `/api/v1/documents/${id}`,
        UPDATE_DOCUMENT: (id) => `/api/v1/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/api/v1/documents/${id}`
    },

    AI: {
        GENERATE_FLASHCARDS: "/api/v1/ai/generate-flashcards",
        GENERATE_QUIZ: "/api/v1/ai/generate-quiz",
        GENERATE_SUMMARY: "/api/v1/ai/generate-summary",
        CHAT: "/api/v1/ai/chat",
        EXPLAIN_CONCEPT: "/api/v1/ai/explain-concept",
        GET_CHAT_HISTORY: (documentId) => `/api/v1/ai/chat-history/${documentId}`
    },

    FLASHCARDS: {
        GET_ALL_FLASHCARD_SETS: "/api/v1/flashcards",
        GET_FLASHCARD_FOR_DOC: (documentId) => `/api/v1/flashcards/${documentId}`,
        REVIEW_FLASHCARD: (cardId) => `/api/v1/flashcards/${cardId}/review`,
        TOGGLE_STAR: (cardId) => `/api/v1/flashcards/${cardId}/star`,
        DELETE_FLASHCARD_SET: (id) => `/api/v1/flashcards/${id}`
    },

    QUIZZES: {
        GET_QUIZZES_FOR_DOC: (documentId) => `/api/v1/quizzes/${documentId}`,
        GET_QUIZ_BY_ID: (id) => `/api/v1/quizzes/quiz/${id}`,
        SUBMIT_QUIZ: (id) => `/api/v1/quizzes/${id}/submit`,
        GET_QUIZ_RESULTS: (id) => `/api/v1/quizzes/${id}/results`,
        DELETE_QUIZ: (id) => `/api/v1/quizzes/${id}`
    },

    PROGRESS: {
        GET_DASHBOARD_DATA: "/api/v1/progress/dashboard"
    }
}