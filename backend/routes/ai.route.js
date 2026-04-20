import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { chat, explainConcept, generateFlashcards, generateQuiz, generateSummary, getChatHistory } from "../controllers/ai.controller.js";


const aiRouter = Router();

aiRouter.use(authorize);

aiRouter.post('/generate-flashcards', generateFlashcards);
aiRouter.post('/generate-quiz', generateQuiz);
aiRouter.post('/generate-summary', generateSummary);
aiRouter.post('/chat', chat);
aiRouter.post('/explain-concept', explainConcept);
aiRouter.get('/chat-history/:documentId', getChatHistory);

export default aiRouter