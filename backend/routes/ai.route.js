import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { chat, explainConcept, generateFlashcard, generateQuiz, generateSummary, getChatHistory } from "../controllers/ai.controller.js";


const aiRouter = Router();

aiRouter.use(authorize);

aiRouter.post('/generate-flashcards', generateFlashcard);
aiRouter.post('/generate-quiz', generateQuiz);
aiRouter.post('/generate-summary', generateSummary);
aiRouter.post('/chat', chat);
aiRouter.post('/explain-concept', explainConcept);
aiRouter.get('/chat-history/:documentId', getChatHistory);

export default aiRouter